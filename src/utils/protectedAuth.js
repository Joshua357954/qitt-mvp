"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/libs/hook";

export default function ProtectedAuth({ children }) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("qitt-user"));

    // Redirect to `/auth` if the user is not enrolled
    if (!user?.enrolled  ) {
      // router.push("/auth");
    }
  }, [router]);

  // Render children if validation passes
  return <>{children}</>;
}
