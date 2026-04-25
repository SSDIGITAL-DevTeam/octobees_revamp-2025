"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";
import {
  partnerForgotPassword,
  partnerChangePassword,
} from "@/services/authService";
import { clearPartnerSession } from "@/lib/partner-portal";

// Skip static prerendering for auth pages
export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none transition";

type ForgotStep = "request" | "reset" | "success";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const isForced = searchParams.get("forced") === "true";

  const [step, setStep] = useState<ForgotStep>(
    tokenFromUrl ? "reset" : "request",
  );
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(tokenFromUrl || "");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setStep("reset");
    }
  }, [tokenFromUrl]);

  const canSubmitReset = useMemo(() => {
    return (
      Boolean(form.password) &&
      form.password === form.confirmPassword &&
      form.password.length >= 8
    );
  }, [form.password, form.confirmPassword]);

  const handleChange =
    (field: "email" | "password" | "confirmPassword") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmitRequest = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      await toast.promise(partnerForgotPassword({ email: form.email }), {
        pending: "Sending reset email...",
        success: "Reset instructions sent.",
        error: {
          render({ data }) {
            return (data as Error)?.message || "Failed to send reset email";
          },
        },
      });
      // Show a generic success message (security: don't reveal if email exists)
      setStep("reset");
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitReset) return;
    setLoading(true);
    try {
      const changeToken = token || searchParams.get("token") || "";
      await toast.promise(
        partnerChangePassword(
          {
            oldPassword: "", // Not used for token-based change
            newPassword: form.password,
          },
          changeToken,
        ),
        {
          pending: "Updating password...",
          success: "Password updated successfully.",
          error: {
            render({ data }) {
              return (data as Error)?.message || "Failed to update password";
            },
          },
        },
      );
      clearPartnerSession();
      setStep("success");
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="mb-6 flex flex-col space-y-4">
      <Link
        href={step === "request" ? "/login" : "#"}
        className="flex items-center text-xs font-semibold text-[#E30613] hover:text-[#b1050f]"
        onClick={() => {
          if (step !== "request") {
            setStep("request");
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mr-1 h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m10.5 19.5-7.5-7.5 7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </Link>

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

      <div className="w-full border-t border-slate-100" />
    </div>
  );

  const renderRequestForm = () => (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">
          Forgot Password
        </h1>
        <p className="text-sm text-slate-500">
          Please enter your email to reset the password
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmitRequest}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange("email")}
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#E30613] py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:opacity-50"
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
    </>
  );

  const renderResetForm = () => (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">
          {isForced ? "Set Your New Password" : "Set a New Password"}
        </h1>
        <p className="text-sm text-slate-500">
          {isForced
            ? "For security, you need to change your automatically generated password before accessing the portal."
            : "Create a new password. Ensure it differs from previous ones for security."}
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmitReset}>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your new password"
            value={form.password}
            onChange={handleChange("password")}
            className={inputClass}
            required
            minLength={8}
          />
          <p className="text-xs text-slate-400">Minimum 8 characters</p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            className={inputClass}
            required
          />
          {!canSubmitReset && form.confirmPassword && (
            <p className="text-xs text-[#E30613]">
              Confirmation must match the new password.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmitReset || loading}
          className="w-full rounded-full bg-[#E30613] py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );

  const renderSuccessState = () => (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">
          Password Has Been Changed
        </h1>
        <p className="text-sm text-slate-500">
          Please return to the login page to access your partner portal.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <Link
          href="/login"
          className="block w-full rounded-full bg-[#E30613] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#b1050f]"
        >
          Back to Login Page
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <div className="mx-auto flex h-[calc(100vh-80px)] w-full max-w-6xl gap-10 px-6 py-10 lg:px-10">
        <div className="flex w-full max-w-md flex-col justify-center">
          {renderHeader()}

          {step === "request" && renderRequestForm()}
          {step === "reset" && renderResetForm()}
          {step === "success" && renderSuccessState()}

          <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} OCTOBEES
          </div>
        </div>

        <div className="hidden flex-1 lg:flex">
          <div className="relative h-full w-full overflow-hidden rounded-[32px]">
            <Image
              src="/assets/auth/login.png"
              alt="OCTOBEES forgot password visual"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ForgotPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
};

export default ForgotPasswordPage;
