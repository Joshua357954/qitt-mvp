"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X, PartyPopper, Link2, Hash, Plus } from "lucide-react";
import Link from "next/link";

export default function SpaceJoin() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle', 'pending', 'success', 'error'
  const [inputType, setInputType] = useState(null); // 'link', 'code'
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const isLink = input.toLowerCase().startsWith("https://qds:");
    const isCode = input.toLowerCase().startsWith("qds");
    setIsValid(isLink || isCode);
    setInputType(isLink ? "link" : isCode ? "code" : null);
  }, [input]);

  const resetForm = () => {
    setInput("");
    setStatus("idle");
    setInputType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("pending");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const shouldSucceed = Math.random() > 0.2;
      setStatus(shouldSucceed ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "pending":
        return (
          <>
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Request Sent</h2>
              <p className="text-muted-foreground">
                {inputType === "link"
                  ? "Verifying your invite link..."
                  : "Verifying your access code..."}
              </p>
            </div>
            <Button variant="outline" onClick={resetForm}>
              <X className="mr-2 h-4 w-4" />
              Cancel Request
            </Button>
          </>
        );

      case "success":
        return (
          <>
            <div className="relative">
              <PartyPopper className="h-12 w-12 text-blue-500" />
              <span className="absolute -top-2 -right-2 text-2xl">🎉</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                Your request has been Sent!
              </h2>
              <p className="text-muted-foreground">
                Once your request is accepted, <br /> you’ll be automatically
                onboarded into the department.
              </p>
            </div>
            <Button onClick={resetForm}>Cancel Request</Button>
          </>
        );

      case "error":
        return (
          <>
            <X className="h-12 w-12 text-red-500" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Something went wrong</h2>
              <p className="text-muted-foreground">
                {inputType
                  ? `The ${
                      inputType === "link" ? "link" : "code"
                    } you entered is invalid or expired.`
                  : "Please enter a valid QDS code or link."}
              </p>
            </div>
            <Button onClick={resetForm}>Try Again</Button>
          </>
        );

      default:
        return (
          <div className="bg-blue-5000 h-full w-full flex justify-center mb-[25%] flex-col items-center">
            <div className="flex flex-col gap-y-3 text-center">
              <h1 className="text-3xl font-bold text-blue-600">
                Join a Department Space
              </h1>
              <p className="text-muted-foreground mb-2">
                Enter your invite code (QDS) or link below
              </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter Code or Link"
                  className="h-12 text-center font-extrabold text-lg uppercase pr-10"
                />
                <div className="absolute right-3 top-3">
                  {inputType === "link" && (
                    <Link2 className="h-5 w-5 text-blue-500" />
                  )}
                  {inputType === "code" && (
                    <Hash className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                disabled={!isValid}
              >
                Join Space
              </Button>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-6 max-w-md mx-auto font-aeonik relative">
      {renderContent()}

      {/* Floating Create Space Button */}
      {status === "idle" && (
        <Link href="/create-space" className="fixed bottom-20 right-6">
          <Button className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </div>
  );
}
