"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { partnerLogin } from "@/services/authService";
import { getPartnerToken, setCachedPartnerProfile } from "@/lib/partner-portal";
import PartnerRouteGuard from "@/components/auth/PartnerRouteGuard";

// Skip static prerendering for login page since it checks auth on mount
export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none transition";

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getPartnerToken()) {
      router.replace("/overview");
    }
  }, [router]);

  const handleChange =
    (field: "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const loginPromise = partnerLogin({
        email: form.email,
        password: form.password,
      });
      const response = await toast.promise(loginPromise, {
        pending: "Signing in...",
        success: "Login successful.",
        error: {
          render({ data }) {
            return (
              (data as Error)?.message ||
              "Login failed. Please check your credentials."
            );
          },
        },
      });

      if (
        response.data?.forcePasswordChange &&
        response.data?.changePasswordToken
      ) {
        // First-time login — must change password before accessing the portal
        localStorage.setItem("partner_token", response.data.token);
        if (response.data?.profile) {
          setCachedPartnerProfile({
            username: response.data.profile.fullName || "",
            email: response.data.profile.email || "",
            phoneNumber: "",
            country: "",
          });
        }
        router.push(
          `/forgot-password?token=${response.data.changePasswordToken}&forced=true`,
        );
        return;
      }

      if (response.data?.token) {
        localStorage.setItem("partner_token", response.data.token);
        localStorage.setItem("partner_tnc_agreed", response.data?.tncAgreed ? "true" : "false");
        if (response.data?.profile) {
          setCachedPartnerProfile({
            username: response.data.profile.fullName || "",
            email: response.data.profile.email || "",
            phoneNumber: "",
            country: "",
          });
        }
        router.push("/overview");
      } else {
        toast.error("Invalid login response.");
      }
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PartnerRouteGuard requireAuth={false}>
      <div className="flex min-h-screen bg-white">
        <div className="mx-auto flex h-[calc(100vh-80px)] w-full max-w-6xl gap-10 px-10 py-10">
          <div className="flex w-full max-w-md flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 text-[#E30613]">
                <Image
                  src="/asset-logo.webp"
                  alt="OCTOBEES"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                  priority
                />
                <span className="text-2xl font-semibold tracking-[0.16em] text-[#E30613]">
                  OCTOBEES
                </span>
              </div>

              <div className="mt-6 w-full border-t border-slate-100" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-slate-900">
                OCTOBEES Partner Login
              </h1>
              <p className="text-sm text-slate-500">
                Enter your details below to login
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Input your email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#E30613] py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-4">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
              © {new Date().getFullYear()} OCTOBEES
            </div>
          </div>

          <div className="hidden lg:flex flex-1">
            <div className="relative h-full w-full rounded-[32px] overflow-hidden">
              <Image
                src="/assets/auth/login.png"
                alt="Login Illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </PartnerRouteGuard>
  );
};

export default LoginPage;
