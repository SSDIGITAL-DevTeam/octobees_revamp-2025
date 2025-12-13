// src/lib/api/authAffiliate.ts
import { axiosAuthInstance } from "@/lib/axios";

export type AffiliateLoginPayload = {
  email: string;
  password: string;
};

export type AffiliateLoginResponse = {
  status: string;
  data: {
    token: string;
    expiresIn: string; // "4h"
    profile: {
      id: string;
      affiliateId: string;
      email: string;
      fullName: string;
    };
  };
};

export const affiliateLogin = (payload: AffiliateLoginPayload) => {
  console.info("[AUTH] Sending login request with payload:", payload); // log 1
  return axiosAuthInstance.post<AffiliateLoginResponse>("/login", payload);
};