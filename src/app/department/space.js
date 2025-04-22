"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Loader2, Plus, RefreshCw, UserRound } from "lucide-react";
import Link from "next/link";
import useAuthStore from "../store/authStore";
import axios from "axios";
import { toast } from "react-toastify";
// import toast from "react-toastify";

export default function SpaceJoin() {
  const { user, updateUser } = useAuthStore();
  const defaultStatus =
    user?.department_space?.status === "pending" ? "pending" : "idle";

  const [input, setInput] = useState("");
  const [status, setStatus] = useState(defaultStatus);

  const isValid = input.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const toastId = toast.loading("Joining Department Space...");

    try {
      const { data } = await axios.post("/api/department/join-space", {
        uid: user.uid,
        schoolId: user.schoolId,
        departmentId: user.departmentId,
        level: user.level,
        code: input.toLocaleLowerCase(),
      });

      // toast(JSON.stringify(data));
      if (data.spaceId) {
        await updateUser({
          department_space: {
            spaceId: data.spaceId,
            name: data.name,
            status: "pending",
          },
        });

        setStatus("pending");
        toast.dismiss(toastId);
        toast.success(data.message || "Request sent successfully!");
      }
    } catch (error) {
      setStatus("idle");
      toast.dismiss(toastId);
      toast.error("InCorrect Code, Pls Try again ");
    }
  };

  const reset = () => {
    setInput("");
    setStatus("idle");
  };

  return (
    <div className="flex flex-col justify-center items-center h-full pt-[12%] text-center p-6 max-w-md mx-auto">
      {status === "idle" && (
        <div className="w-full flex flex-col gap-y-6 items-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-600">
              Join a Department Space
            </h1>
            <p className="text-muted-foreground">
              Enter your invite code below, let’s vibe!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Code or Link"
              className="h-12 text-center font-extrabold text-lg uppercase"
            />
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              disabled={!isValid}
            >
              Join Space
            </Button>
          </form>
        </div>
      )}

      {status === "pending" && (
        <div className="text-center space-y-6 max-w-md mx-auto p-6 rounded-lg border bg-gray-50/50">
          <div className="flex justify-center">
            <div className="relative">
              <UserRound className="h-12 w-12 text-blue-500" />
              <HelpCircle className="absolute -right-1 -top-1 h-5 w-5 text-yellow-500 animate-pulse" />
            </div>
          </div>

          {/* <h3 className="text-lg font-medium text-gray-900">
         Department Join Request Pending
       </h3> */}

          {/* <p className="text-gray-600">
         Your request to join <span className="font-semibold text-blue-600">Marketing Team</span> is being reviewed
       </p> */}

          <div className="py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm font-medium text-blue-700">
                Awaiting department admin approval
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            {/* <Button
              onClick={reset}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel Request
            </Button> */}
            <Button
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
              disabled
            >
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refresh Status
            </Button>
          </div>

          <p className="text-xs text-gray-500 pt-4">
            You'll be automatically redirected to the department space once
            approved
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-semibold">You're in! 🎉</p>
          <Button onClick={reset} className="mt-2">
            Done
          </Button>
        </div>
      )}

      {status === "idle" && (
        <Link href="/space/create-space" className="fixed bottom-20 right-6">
          <Button className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </div>
  );
}
