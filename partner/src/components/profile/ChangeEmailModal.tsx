"use client";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
type ChangeEmailModalProps = {
  open: boolean;
  currentEmail: string;
  onClose: () => void;
  onSubmit?: (payload: {
    password: string;
    newEmail: string;
  }) => Promise<void> | void;
  onResend?: (newEmail: string) => Promise<void> | void;
};
const inputClass =
  "w-full border-b border-slate-200 pb-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#E30613] focus:outline-none";
const ChangeEmailModal = ({
  open,
  currentEmail,
  onClose,
  onSubmit,
  onResend,
}: ChangeEmailModalProps) => {
  const [step, setStep] = useState<"form" | "sent">("form");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  if (!open) {
    return null;
  }
  const handleClose = () => {
    setStep("form");
    setPassword("");
    setNewEmail(currentEmail);
    setIsSubmitting(false);
    setIsResending(false);
    onClose();
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit?.({ password, newEmail });
    setIsSubmitting(false);
    setStep("sent");
  };
  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    await onResend?.(newEmail);
    setTimeout(() => setIsResending(false), 1500);
  };
  const renderFormStep = () => (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Current Password
        </label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            className={`${inputClass} pr-10`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="-ml-8 p-2 text-slate-400 transition hover:text-slate-600"
          >
            <span className="sr-only">Toggle visibility</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          New Email Address
        </label>
        <input
          type="email"
          value={newEmail}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setNewEmail(event.target.value)
          }
          className={inputClass}
          required
        />
      </div>
      <div className="space-y-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
  const renderSentStep = () => (
    <div className="mt-6 space-y-6 text-center">
      <div className="text-left">
        <button
          type="button"
          onClick={handleClose}
          className="-ml-1 inline-flex items-center text-sm font-semibold text-[#E30613] transition hover:text-[#b1050f]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-2 h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m10.5 19.5-7.5-7.5 7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#E30613] text-[#E30613]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Check Your New Email!
          </h3>
          <p className="mt-3 text-sm text-slate-600">
            We’ve sent a verification link to{" "}
            <span className="font-semibold text-slate-900">{newEmail}</span>.
            Click the link within the next{" "}
            <span className="font-semibold text-slate-900">30 minutes</span> to
            confirm your email change.
          </p>
          <p className="mt-5 text-sm text-slate-600">
            Didn&apos;t get the email? Check your spam folder or{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#E30613] underline-offset-2 hover:text-[#b1050f]"
              disabled={isResending}
            >
              {isResending ? "Resending..." : "resend the link."}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-900">Change Email</h2>
        {step === "form" ? renderFormStep() : renderSentStep()}
      </div>
    </div>
  );
};
export default ChangeEmailModal;
