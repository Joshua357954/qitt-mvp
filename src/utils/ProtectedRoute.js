"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/app/store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Define which pages require authentication
    const protectedRoutes = ["/", "/profile", "/assignment",'timetable'];
    const authPages = ["/auth", "/auth/register"];

    if (!user && protectedRoutes.includes(pathname)) {
      router.replace("/auth"); // Redirect unauthenticated users
    } else if (user && authPages.includes(pathname)) {
      router.replace("/"); // Redirect logged-in users away from auth pages
    }
  }, [user, pathname]);

  return children;
};

export default ProtectedRoute;
