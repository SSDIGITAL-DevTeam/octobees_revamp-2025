"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none transition";

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange =
    (field: "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.info("Login form submitted", form);
    router.push("/overview");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-stretch gap-10 px-10 py-10">
        {/* KIRI: form login */}
        <div className="flex w-full max-w-md flex-col justify-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-[#E30613]">
              <Image
                src="/assets/icons/octobees-icon.svg"
                alt="Octobees Icon"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <p className="text-2xl font-semibold tracking-wide">OCTOBEES</p>
            </div>

            <div className="mt-6 w-full border-t border-slate-100" />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-900">
              Octobees Partner Login
            </h1>
            <p className="text-sm text-slate-500">
              Enter your details below to login
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <input
                id="email"
                type="email"
                placeholder="Input your username"
                value={form.email}
                onChange={handleChange("email")}
                className={inputClass}
              />
            </div>

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
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange("password")}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#E30613] py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f]"
            >
              Login
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-4">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">
            © 2025 Octobees
          </div>
        </div>

        {/* KANAN: gambar background hanya di sisi kanan */}
        <div className="hidden lg:flex flex-1 items-center justify-end">
          <div className="relative h-full max-h-[640px] w-full max-w-[520px] rounded-[32px] overflow-hidden">
            <Image
              src="/assets/auth/login.png"
              alt="Login Illustration"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
