// src/services/authService.ts
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = any;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not set");
}

export async function partnerLogin(
  payload: LoginPayload
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/affiliate/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Login failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function partnerLogout(token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/affiliate/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Logout failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export type ForgotPasswordPayload = {
  email: string;
};

export async function partnerForgotPassword(
  payload: ForgotPasswordPayload
): Promise<any> {
  const res = await fetch(`${BASE_URL}/affiliate/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Forgot password failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export async function partnerChangePassword(
  payload: ChangePasswordPayload,
  token: string
): Promise<any> {
  const res = await fetch(`${BASE_URL}/affiliate/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      token,
      newPassword: payload.newPassword,
      confirmPassword: payload.newPassword,
    }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Change password failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function agreeToTnc(token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/affiliate/auth/agree-tnc`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Agree TnC failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const octobeesLogin = partnerLogin;
export const octobeesLogout = partnerLogout;
export const octobeesForgotPassword = partnerForgotPassword;
export const octobeesChangePassword = partnerChangePassword;
