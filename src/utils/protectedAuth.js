"use client";

import { useAuthStore } from "@/app/store/authStore.js";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withNonAuth = (Component) => {
  return (props) => {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (user) {
        router.replace("/"); // Redirect to home if already logged in
      }
    }, [user, router]);

    if (user) return null; // Prevent rendering login/signup

    return <Component {...props} />;
  };
};

export default withNonAuth;
