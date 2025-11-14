"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
};

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

type PasswordFormState = Record<PasswordField, string>;

const baseInputClass =
  "w-full border-b border-slate-200 pb-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#E30613] focus:outline-none pr-10";

const ChangePasswordModal = ({
  open,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const [formValues, setFormValues] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldVisibility, setFieldVisibility] = useState<
    Record<PasswordField, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInvalidConfirmation = useMemo(() => {
    const { newPassword, confirmPassword } = formValues;
    return Boolean(confirmPassword) && newPassword !== confirmPassword;
  }, [formValues]);

  if (!open) {
    return null;
  }

  const handleInputChange =
    (field: PasswordField) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({ ...prev, [field]: value }));
    };

  const toggleVisibility = (field: PasswordField) => {
    setFieldVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isInvalidConfirmation) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit?.({
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword,
    });
    setIsSubmitting(false);
    setFormValues({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    onClose();
  };

  const renderField = (
    field: PasswordField,
    label: string,
    placeholder?: string
  ) => (
    <div key={field}>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center">
        <input
          type={fieldVisibility[field] ? "text" : "password"}
          value={formValues[field]}
          onChange={handleInputChange(field)}
          className={baseInputClass}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={() => toggleVisibility(field)}
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
      {field === "confirmPassword" && isInvalidConfirmation && (
        <p className="mt-1 text-xs text-[#E30613]">
          Confirmation must match the new password.
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {renderField("currentPassword", "Current Password")}
          {renderField("newPassword", "New Password")}
          {renderField("confirmPassword", "Confirm New Password")}

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isInvalidConfirmation}
              className="flex w-full items-center justify-center rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Change Password"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
