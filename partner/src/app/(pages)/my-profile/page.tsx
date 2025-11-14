"use client";

import { useState } from "react";

import Topbar from "@/components/layout/Topbar";
import ChangeEmailModal from "@/components/profile/ChangeEmailModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import { useProfileForm } from "@/hooks/useProfile";

const ProfilePage = () => {
  const { profile, isSaving, handleChange, handleSubmit } = useProfileForm();
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const inputBaseClass =
    "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none transition";

  const toggleEmailEditable = () => setIsEmailEditable((prev) => !prev);

  const handlePasswordSubmit = async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.info("Password changed", { currentPassword, newPassword });
  };

  const handleEmailSubmit = async ({
    password,
    newEmail,
  }: {
    password: string;
    newEmail: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.info("Email change requested", { password, newEmail });
  };

  const handleEmailResend = async (newEmail: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.info("Email change link resent", { newEmail });
  };

  return (
    <div className="space-y-6">
      <Topbar title="My Profile" />

      <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-card sm:p-8">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-700">
                Username<span className="text-[#E30613]">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={profile.username}
                onChange={handleChange("username")}
                className={inputBaseClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                Phone No.<span className="text-[#E30613]">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={profile.phoneNumber}
                onChange={handleChange("phoneNumber")}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email<span className="text-[#E30613]">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              readOnly={!isEmailEditable}
              onChange={handleChange("email")}
              className={`${inputBaseClass} ${
                isEmailEditable ? "bg-white" : "bg-slate-50 text-slate-500"
              }`}
            />
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="inline-flex items-center rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613]"
              >
                Change Email Address
              </button>

              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613]"
              >
                Change Password
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#E30613] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      <ChangeEmailModal
        open={isEmailModalOpen}
        currentEmail={profile.email}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        onResend={handleEmailResend}
      />

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default ProfilePage;
