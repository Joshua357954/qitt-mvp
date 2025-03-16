"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsChat as Chat } from "react-icons/bs";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseApp from "../../firebase.js";
import {
  fetchUser,
  registerUser,
  updateUser,
} from "../../libs/features/authSlice2.js";
import { useRouter } from "next/navigation.js";
import Image from "next/image.js";
import { useAppDispatch } from "@/libs/hook.js";
import AuthLayout from "@/components/AuthLayout.js";
import Loader from "@/components/Loader.jsx";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuthStore from "../store/authStore.js";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const auth = getAuth();

  function completeLogin(user) {
    console.log("Setting User");
    setUser(user);
    console.log(user);
    navigate.push("/");
  }

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const { uid, email } = result.user;

      const { data } = await axios.post("/api/auth/login", { email, uid });
      toast.success(data.message);
      completeLogin(data.user);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/auth/login", { email, pin });

      toast.success(data.message);
      console.log("Login....");
      completeLogin(data.user);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center font-aeonik items-center w-full h-full bg-white">
        {/* <Loader open={authData?.status === "loading" || isLoading} /> */}

        <main className="max-w-md w-full p-8 ">
          <header className="text-center mb-10">
            <Image
              width={12}
              height={12}
              unoptimized
              className="w-14 mx-auto"
              src={"/qitt-logo.png"}
              alt="Qitt Logo"
            />
          </header>

          <button
            type="button"
            className="w-full bg-white border border-gray-900 rounded-md p-3 flex items-center justify-center mb-4 gap-2"
            onClick={handleSignInWithGoogle}
          >
            <Image
              width={10}
              height={10}
              src={"/assets/images/google-img.png"}
              className="w-8 h-8"
              alt="Google Logo"
              unoptimized
            />
            <span className="button-text ml-2 mt-1 font-bold">
              Sign In with Google
            </span>
          </button>

          <div className="flex items-center mb-4">
            <div className="border-t border-gray-900 flex-1"></div>
            <span className="mx-2 text-gray-800">or</span>
            <div className="border-t border-gray-900 flex-1"></div>
          </div>

          <form className="space-y-2">
            <label className="font-bold mb-[-10px]">
              Email
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
              />
            </label>

            <div className="h-3"></div>

            <label className="font-bold">
              Pin
              <InputOTP
                maxLength={6}
                containerClassName={
                  "w-full flex gap-4 justify-between font-semibold"
                }
                value={pin}
                onChange={setPin}
              >
                {[...Array(4)].map((_, index) => (
                  <InputOTPGroup key={index}>
                    <InputOTPSlot
                      index={index}
                      className="w-14 h-14 text-2xl border border-gray-500"
                    />
                  </InputOTPGroup>
                ))}
              </InputOTP>
            </label>

            <div className="h-3"></div>
            <button
              onClick={handleEmailSignIn}
              type="button"
              className="w-full py-4 px-6 bg-[#0A32F8] text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Continue with Email
            </button>
          </form>
        </main>
      </div>
    </AuthLayout>
  );
};

export default AuthScreen;
