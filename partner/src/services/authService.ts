// src/services/authService.ts
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = any; // ganti kalau sudah tahu bentuk responsnya

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not set");
}

export async function octobeesLogin(
  payload: LoginPayload
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/v1/affiliate/auth/login`, {
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

export async function octobeesLogout(token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/v1/affiliate/auth/logout`, {
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

export async function octobeesForgotPassword(
  payload: ForgotPasswordPayload
): Promise<any> {
  const res = await fetch(`${BASE_URL}/v1/affiliate/auth/forgot-password`, {
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

export async function octobeesChangePassword(
  payload: ChangePasswordPayload,
  token: string
): Promise<any> {
  const res = await fetch(`${BASE_URL}/v1/affiliate/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
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