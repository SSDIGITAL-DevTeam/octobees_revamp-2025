"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import ClientHeader from "@/components/layouts/Navbar/ClientHeader";
import { Lock, Mail, Building, User, CheckCircle2, AlertCircle, X } from "lucide-react";

type ClientSession = {
  id: string;
  name: string;
  companyName: string;
  email: string;
};

const CLIENT_SESSION_KEY = "octobees_client_session";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<ClientSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const rawSession = localStorage.getItem(CLIENT_SESSION_KEY);
    if (!rawSession) {
      router.replace("/client-login");
      return;
    }

    const parsed = JSON.parse(rawSession) as ClientSession;
    setSession(parsed);
    setIsCheckingAuth(false);
  }, [router]);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateStatus(null);
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setUpdateStatus({ type: "error", message: "Semua field harus diisi" });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setUpdateStatus({ type: "error", message: "Password baru tidak cocok" });
      return;
    }

    if (newPassword.length < 6) {
      setUpdateStatus({ type: "error", message: "Password baru minimal 6 karakter" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!session) return;
      
      await axiosInstance.patch(`/client-onboarding/${session.id}/change-password`, {
        currentPassword,
        newPassword
      });

      setUpdateStatus({ type: "success", message: "Password berhasil diubah" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Close modal after success
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setUpdateStatus(null);
      }, 2000);
      
    } catch (err: any) {
      setUpdateStatus({ 
        type: "error", 
        message: err.response?.data?.error || "Terjadi kesalahan saat mengubah password" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth || !session) {
    return (
      <main className="bg-[#f8fafc] min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-sm px-6 w-full">
          <div className="rounded-[2rem] border border-white/60 bg-white/80 backdrop-blur-xl p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-10 h-10 mx-auto mb-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="font-heading text-lg text-gray-600 font-medium animate-pulse">
              Memuat profil...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <ClientHeader />
      <main className="min-h-screen bg-[#fafafa] pt-32 pb-24 md:pt-44 md:pb-32 relative overflow-hidden selection:bg-primary/20 selection:text-primary">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 mx-auto w-full max-w-2xl px-5 sm:px-8">
          <div className="rounded-[2.5rem] border border-white/60 bg-white/95 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <header className="space-y-4 text-center max-w-2xl mx-auto mb-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-heading font-black text-3xl sm:text-4xl shadow-lg border-4 border-white mb-6">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold tracking-tight">
                My Profile
              </h1>
              <p className="font-body text-sm sm:text-base text-gray-600">
                Kelola informasi akun dan kata sandi Anda.
              </p>
            </header>

            <div className="space-y-6">
              <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium text-[15px]">
                      {session.name}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200" />

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Company or Brand
                    </label>
                    <p className="text-gray-900 font-medium text-[15px]">
                      {session.companyName}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200" />

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900 font-medium text-[15px]">
                      {session.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl shadow-sm border">
                <div className="text-center sm:text-left">
                  <h3 className="font-heading font-bold text-gray-900">Keamanan Akun</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Ubah kata sandi Anda secara berkala</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsPasswordModalOpen(false)} />
            
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-500" />
                  Change Password
                </h3>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1.5 shadow-sm border border-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                {updateStatus && (
                  <div className={`flex items-start gap-3 p-3 text-sm rounded-xl border ${
                    updateStatus.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                    {updateStatus.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    ) : ( 
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                    )}
                    <span className="font-medium leading-relaxed">{updateStatus.message}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                    placeholder="Ketik ulang password baru"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-merah-700 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                  >
                    {isSubmitting ? "Memproses..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
