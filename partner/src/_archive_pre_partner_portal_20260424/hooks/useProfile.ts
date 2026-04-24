"use client";

import { useCallback, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { defaultProfile, type Profile } from "@/data/profile";

export const useProfileForm = (initialProfile: Profile = defaultProfile) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (field: keyof Profile) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const resetProfile = useCallback(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const saveProfile = useCallback(async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    return profile;
  }, [profile]);

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      return saveProfile();
    },
    [saveProfile]
  );

  return {
    profile,
    isSaving,
    handleChange,
    handleSubmit,
    resetProfile,
  };
};
