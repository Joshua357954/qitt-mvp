"use client";
import React, { useState } from "react";
import {
  addItem,
  departments,
  levels,
  schoolNames,
} from "../../../utils/utils";
import { toast } from "react-toastify";
import Axios from "axios";
import Loader from "../../../components/Loader";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { ArrowRight } from "lucide-react";
import { Select } from "@/components/Select";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../../firebase";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [formData, setFormData] = useState({
    school: "",
    nickname: "",
    department: "",
    level: "",
    pin: "",
    phone: "",
    name: "", // Store Google email
    email: "", // Store Google email
  });

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();

      googleProvider.setCustomParameters({ prompt: "select_account" }); // Force account selection

      toast.info("Signing in with Google...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // console.log(result.user.displayName);
      setFormData((prevData) => ({
        ...prevData,
        email: user.email,
        imageURL: user.photoURL,
        name: user.displayName,
      }));

      return;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In Failed!");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signInWithGoogle();

    setLoading(true);

    try {
      const { data } = await Axios.post(`/api/auth/register`, formData);
      
      toast.success(data.message);
      navigate("/dashboard"); // Corrected navigation
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout choose={0}>
      <div className="w-full h-full font-aeonik mx-auto bg-white py-8 sm:px-16 px-6 overflow-auto">
        <Loader open={loading} />
        <h1 className="text-4xl font-black mb-2">Hey, Genius!</h1>
        <p className="text-gray-700 mb-8">
          Welcome to Qitt, Let's get you signed up
        </p>

        {/* Google Sign-In Button */}
        {/* <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 w-full rounded flex items-center justify-center mb-6"
          onClick={signInWithGoogle}
          type="button"
        >
          Sign in with Google
        </button> */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Name Of School
            </label>
            <Select
              placeholder="Choose your school"
              value={formData.school}
              items={schoolNames}
              onChange={(value) => handleChange("school", value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              NickName
            </label>
            <input
              className="shadow border rounded w-full p-3"
              type="text"
              value={formData.nickname}
              onChange={(e) => handleChange("nickname", e.target.value)}
              placeholder=""
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Department
            </label>
            <Select
              items={departments}
              value={formData.department}
              onChange={(value) => handleChange("department", value)}
              placeholder="&nbsp;"
            />
          </div>

          <div className="mb-4 flex gap-5">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Level
              </label>
              <Select
                items={levels}
                value={formData.level}
                onChange={(value) => handleChange("level", value)}
                placeholder="&nbsp;"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Pin
              </label>
              <input
                maxLength={4}
                className="shadow border rounded w-full p-3"
                type="password"
                value={formData.pin}
                onChange={(e) => handleChange("pin", e.target.value)}
                placeholder="Choose Pin"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Phone Number (WhatsApp)
            </label>
            <input
              className="shadow border rounded w-full p-3"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder=""
              required
            />
          </div>

          <button
            className="bg-[#0A32F8] hover:bg-blue-700 text-white mt-6 font-bold p-4 rounded flex items-center w-full justify-center "
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
            <ArrowRight className="ml-2" />
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
