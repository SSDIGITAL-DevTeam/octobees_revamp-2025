"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Topbar from "@/components/layout/Topbar";
import ChangeEmailModal from "@/components/profile/ChangeEmailModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import { Shimmer } from "@/components/ui/Shimmer";
import {
  getCachedPartnerProfile,
  getPartnerToken,
  setCachedPartnerProfile,
  type PartnerProfile,
} from "@/lib/partner-portal";
import { getAffiliateProfile, updateAffiliateProfile } from "@/services/dashboardService";

const inputBaseClass =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none transition";

const emptyProfile: PartnerProfile = {
  username: "",
  phoneNumber: "",
  email: "",
  country: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountHolder: "",
  bankAccountCompleted: false,
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<PartnerProfile>(emptyProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const cached = getCachedPartnerProfile();
    if (cached) {
      setProfile((prev) => ({ ...prev, ...cached }));
    }

    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    let active = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getAffiliateProfile(token);
        const nextProfile = response?.data as PartnerProfile;

        if (!active || !nextProfile) return;

        setProfile({
          username: nextProfile.username || "",
          phoneNumber: nextProfile.phoneNumber || "",
          email: nextProfile.email || "",
          country: nextProfile.country || "",
          bankName: nextProfile.bankName || "",
          bankAccountNumber: nextProfile.bankAccountNumber || "",
          bankAccountHolder: nextProfile.bankAccountHolder || "",
          bankAccountCompleted: Boolean(nextProfile.bankAccountCompleted),
        });
        setCachedPartnerProfile(nextProfile);
      } catch (err: any) {
        if (!active) return;
        toast.error(err?.message || "Failed to load profile.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleChange =
    (field: keyof PartnerProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsSaving(true);

      const updatePromise = updateAffiliateProfile(token, {
        username: profile.username,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        bankName: profile.bankName,
        bankAccountNumber: profile.bankAccountNumber,
        bankAccountHolder: profile.bankAccountHolder,
      });
      await toast.promise(updatePromise, {
        pending: "Updating profile...",
        success: "Profile updated successfully.",
        error: {
          render({ data }) {
            return (data as Error)?.message || "Failed to update profile.";
          },
        },
      });

      setCachedPartnerProfile({
        ...profile,
        bankAccountCompleted: Boolean(
          profile.bankName?.trim() &&
          profile.bankAccountNumber?.trim() &&
          profile.bankAccountHolder?.trim()
        ),
      });
    } catch {
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsPasswordModalOpen(false);
    toast.info("Password change from profile is not connected yet.");
  };

  const handleEmailSubmit = async () => {
    setIsEmailModalOpen(false);
    toast.info("Email change flow is not connected yet.");
  };

  const handleEmailResend = async () => {
    toast.info("Email change flow is not connected yet.");
  };

  return (
    <div className="space-y-6">
      <Topbar title="My Profile" />

      <section className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-card sm:rounded-[32px] sm:p-8">
        <header className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Profile</h2>
        </header>

        {isLoading ? (
          <div
            className="space-y-6"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Shimmer className="h-3 w-28" />
                  <Shimmer className="h-12 w-full rounded-2xl" />
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-6">
              <Shimmer className="h-4 w-40" />
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Shimmer className="h-3 w-32" />
                    <Shimmer className="h-12 w-full rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Shimmer className="h-11 w-32 rounded-full" />
            </div>
          </div>
        ) : (
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

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email<span className="text-[#E30613]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className={`${inputBaseClass} bg-slate-50 text-slate-500`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-semibold text-slate-700">
                  Address
                </label>
                <input
                  id="country"
                  type="text"
                  value={profile.country || ""}
                  onChange={handleChange("country")}
                  placeholder="Full resident address"
                  className={inputBaseClass}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Bank Account</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add your payout details so commission transfers can be processed.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="bankName" className="text-sm font-semibold text-slate-700">
                    Bank Name<span className="text-[#E30613]">*</span>
                  </label>
                  <input
                    id="bankName"
                    type="text"
                    value={profile.bankName || ""}
                    onChange={handleChange("bankName")}
                    className={inputBaseClass}
                    placeholder="Bank Central Asia"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bankAccountHolder" className="text-sm font-semibold text-slate-700">
                    Account Holder<span className="text-[#E30613]">*</span>
                  </label>
                  <input
                    id="bankAccountHolder"
                    type="text"
                    value={profile.bankAccountHolder || ""}
                    onChange={handleChange("bankAccountHolder")}
                    className={inputBaseClass}
                    placeholder="Full legal account name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="bankAccountNumber" className="text-sm font-semibold text-slate-700">
                  Account Number<span className="text-[#E30613]">*</span>
                </label>
                <input
                  id="bankAccountNumber"
                  type="text"
                  value={profile.bankAccountNumber || ""}
                  onChange={handleChange("bankAccountNumber")}
                  className={inputBaseClass}
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613] sm:w-auto"
                >
                  Change Email Address
                </button>

                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#E30613] hover:text-[#E30613] sm:w-auto"
                >
                  Change Password
                </button>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#E30613] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
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
