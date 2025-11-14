"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none transition";

type ForgotStep = "request" | "reset" | "success";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<ForgotStep>("request");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const canSubmitReset = useMemo(() => {
    return Boolean(form.password) && form.password === form.confirmPassword;
  }, [form.password, form.confirmPassword]);

  const handleChange =
    (field: "email" | "password" | "confirmPassword") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("reset");
  };

  const handleSubmitReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitReset) return;
    setStep("success");
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6V3m0 3c-2.21 0-4 1.79-4 4 0 1.54.87 2.87 2.14 3.56-.46.3-.88.68-1.24 1.12C7.81 17.18 9.21 19 11 19h2c1.79 0 3.19-1.82 2.1-3.32-.36-.44-.78-.82-1.24-1.12C15.13 12.87 16 11.54 16 10c0-2.21-1.79-4-4-4Z"
          />
        </svg>
        <p className="text-2xl font-semibold tracking-wide">OCTOBEES</p>
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
          className="w-full rounded-full bg-[#E30613] py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f]"
        >
          Reset Password
        </button>
      </form>
    </>
  );

  const renderResetForm = () => (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">
          Set a New Password
        </h1>
        <p className="text-sm text-slate-500">
          Create a new password. Ensure it differs from previous ones for
          security.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmitReset}>
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
            placeholder="Enter your new password"
            value={form.password}
            onChange={handleChange("password")}
            className={inputClass}
            required
          />
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
          disabled={!canSubmitReset}
          className="w-full rounded-full bg-[#E30613] py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          Update Password
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
        <p className="text-sm text-slate-500">Please return to the login page</p>
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="w-full max-w-md rounded-[32px] bg-white px-8 py-10 shadow-lg">
          {renderHeader()}

          {step === "request" && renderRequestForm()}
          {step === "reset" && renderResetForm()}
          {step === "success" && renderSuccessState()}

          <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
            © 2025 Octobees
          </div>
        </div>

        <div className="relative hidden flex-1 overflow-hidden rounded-[32px] lg:mr-10 lg:mt-10 lg:mb-10 lg:block">
          <Image
            src="/assets/auth/login.png"
            alt="Octobees forgot password visual"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
