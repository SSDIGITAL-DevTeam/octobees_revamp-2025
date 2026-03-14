"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";

type LoginResponse = {
  id: string;
  name: string;
  companyName: string;
  email: string;
  agreementGuideApproved: boolean;
  agreementProgramCommitment: boolean;
};

const CLIENT_SESSION_KEY = "octobees_client_session";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(CLIENT_SESSION_KEY);
    if (stored) {
      router.replace("/onboarding-kit");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post<LoginResponse>("/client-onboarding/login", {
        email,
        password,
      });

      localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(response.data));
            router.replace("/onboarding-kit");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login gagal. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(179,0,11,0.2),#F8F5F2_35%,#F5F5F5_100%)] pt-36 pb-14 md:pt-44 md:pb-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl border border-primary/15 bg-white p-6 sm:p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-2 text-center">
              <p className="inline-flex rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                OCTOBEES Growth Engine
              </p>
              <h1 className="font-heading text-3xl text-dark font-semibold !leading-[120%] md:text-4xl">
                Client Login
              </h1>
              <p className="font-body text-secondary leading-relaxed">
                Silakan login terlebih dahulu untuk mengakses halaman Client Onboarding Guide.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="font-body text-sm text-dark">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-body text-dark outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="font-body text-sm text-dark">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-body text-dark outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  placeholder="Masukkan password"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-light transition hover:bg-merah-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Memproses login..." : "Login ke Onboarding Kit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}


