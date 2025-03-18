"use client";

import { useAuthStore } from "@/app/store/login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function withAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        jwtDecode(token); 
        setToken(token); 
      } catch (error) {
        console.error("Invalid token", error);
        sessionStorage.removeItem("token");
        router.push("/login");
      }
    }, []); // ✅ tambahin dependency

    return <Component {...props} />;
  };
}
