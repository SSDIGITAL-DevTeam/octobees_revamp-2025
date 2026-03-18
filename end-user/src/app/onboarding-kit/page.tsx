"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import ClientHeader from "@/components/layouts/Navbar/ClientHeader";
import { X, Play } from "lucide-react";

type AgreementState = {
  agreementGuideApproved: boolean;
  agreementProgramCommitment: boolean;
};

type ClientSession = {
  id: string;
  name: string;
  companyName: string;
  email: string;
  agreementGuideApproved: boolean;
  agreementProgramCommitment: boolean;
};

const CLIENT_SESSION_KEY = "octobees_client_session";

const initialAgreementState: AgreementState = {
  agreementGuideApproved: false,
  agreementProgramCommitment: false,
};

function Divider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
  );
}

function VideoModal({ isOpen, onClose, type, label, videoUrl }: { isOpen: boolean, onClose: () => void, type: 'desktop' | 'mobile', label: string, videoUrl?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const getFullVideoUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';
    return `${baseUrl}${url}`;
  };

  if (!isOpen || !mounted) return null;
  
  const fullVideoUrl = getFullVideoUrl(videoUrl);
  
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl w-full flex flex-col animate-in fade-in zoom-in-95 duration-200 ${type === 'desktop' ? 'max-w-5xl aspect-video' : 'max-w-[400px] aspect-[9/16]'}`}>
        <div className="absolute top-3 right-3 md:top-5 md:right-5 z-10 transition-transform hover:scale-110">
          <button 
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-white hover:bg-primary backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        {fullVideoUrl ? (
          <video
            src={fullVideoUrl}
            className="w-full h-full object-contain bg-black"
            controls
            autoPlay
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-800 text-gray-400 relative">
            <div className="text-center p-6 relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-4 md:mb-6 shadow-inner ring-4 ring-gray-600/50">
                <svg viewBox="0 0 24 24" className="ml-1.5 h-8 w-8 md:h-10 md:w-10 text-gray-400 fill-current" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <p className="font-heading font-medium text-lg md:text-xl text-white mb-2">{label} - {type === 'desktop' ? 'Desktop' : 'Mobile'}</p>
              <p className="text-sm md:text-base">Video Player Placeholder</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

type VideoConfig = {
  desktop?: string;
  mobile?: string;
};

const defaultVideoConfigs: Record<string, VideoConfig> = {
  "Tutorial Penggunaan Client Portal": {
    desktop: "/mp4/VIDEO TUTORIAL CLICKUP DESKTOP.mp4",
    mobile: "/mp4/VIDEO TUTORIAL CLICKUP MOBILE.mp4",
  },
  "Tutorial Unggah Assets ke ClickUp": {
    desktop: "/mp4/TUTORIAL UPLOAD ASSETS DESKTOP.mp4",
    mobile: "/mp4/TUTORIAL UPLOAD ASSETS MOBILE.mp4",
  },
  "Tutorial Memberikan Akses Akun": {},
};

function VideoPlaceholder({ label }: { label: string }) {
  const [modalType, setModalType] = useState<'desktop' | 'mobile' | null>(null);
  const [videoConfigs, setVideoConfigs] = useState<Record<string, VideoConfig>>(defaultVideoConfigs);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get("/videos-onboarding/videos");
        if (response.data && Object.keys(response.data).length > 0) {
          setVideoConfigs((prev) => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };
    fetchVideos();
  }, []);
  
  const videoConfig = videoConfigs[label] || {};
  const hasVideo = videoConfig.desktop || videoConfig.mobile;

  const VideoThumbnail = ({ type, url }: { type: 'desktop' | 'mobile', url?: string }) => {
    if (!url) {
      return (
        <div className="flex items-center justify-center gap-3 rounded-full border border-gray-200/80 bg-white/90 backdrop-blur-md px-6 py-3 shadow-md">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300 text-white">
            <Play className="h-4 w-4" />
          </span>
          <span className="font-heading font-bold text-gray-500 tracking-wide text-[14px]">
            Coming Soon
          </span>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 group/thumbnail">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover/thumbnail:scale-110 transition-transform">
            <Play className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover/thumbnail:bg-black/20 transition-colors" />
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">
          {type === 'desktop' ? '16:9' : '9:16'}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-6 md:gap-8 items-start max-w-2xl mx-auto">
        {/* Desktop Video Container */}
        <div className="group perspective-1000 w-full flex flex-col gap-3">
          <div 
            onClick={() => hasVideo && setModalType('desktop')}
            className={`cursor-pointer aspect-video relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/40 border border-gray-200/60 rounded-[2rem] shadow-sm transition-all duration-500 hover:shadow-lg hover:border-primary/30 ${!hasVideo ? 'opacity-60' : ''}`}
          >
            <VideoThumbnail type="desktop" url={videoConfig.desktop} />
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 bg-white border border-gray-100 py-2.5 rounded-xl shadow-sm">
            {label} - Desktop
          </p>
        </div>

        {/* Mobile Video Container */}
        <div className="group perspective-1000 w-full max-w-xs mx-auto flex flex-col gap-3">
          <div 
            onClick={() => hasVideo && setModalType('mobile')}
            className={`cursor-pointer aspect-[9/16] max-h-[320px] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/40 border border-gray-200/60 rounded-[2rem] shadow-sm transition-all duration-500 hover:shadow-lg hover:border-primary/30 ${!hasVideo ? 'opacity-60' : ''}`}
          >
            <VideoThumbnail type="mobile" url={videoConfig.mobile} />
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 bg-white border border-gray-100 py-2.5 rounded-xl shadow-sm">
            {label} - Mobile
          </p>
        </div>
      </div>

      <VideoModal 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)} 
        type={modalType || 'desktop'} 
        label={label}
        videoUrl={modalType === 'desktop' ? videoConfig.desktop : videoConfig.mobile}
      />
    </>
  );
}

function SectionBlock({ children }: { title?: string; children: ReactNode }) {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="space-y-5 font-body text-gray-600 leading-relaxed text-[16px] sm:text-[17px]">
        {children}
      </div>
    </section>
  );
}

const frameworkSteps = [
  {
    stage: "Traffic",
    desc: "Calon pelanggan mulai menemukan bisnis Anda melalui iklan atau konten",
  },
  {
    stage: "Brand Awareness",
    desc: "Mereka mulai mengenal brand Anda",
  },
  {
    stage: "Customer Engagement",
    desc: "Mereka mulai berinteraksi dengan konten Anda",
  },
  {
    stage: "Conversion",
    desc: "Mereka memutuskan untuk menjadi pelanggan",
  },
  {
    stage: "Repeat Customers",
    desc: "Pelanggan kembali membeli dan menjadi pelanggan tetap",
  },
];

const productServiceInfo = [
  {
    info: "Daftar produk / layanan",
    example: "menu makanan, paket kursus, dll",
  },
  { info: "Harga", example: "harga tiap produk" },
  { info: "Produk / layanan terlaris", example: "best seller" },
  { info: "Produk unggulan", example: "signature product" },
  { info: "Produk promosi", example: "menu atau layanan promo" },
];

const brandAssets = [
  { asset: "Logo", desc: "logo brand Anda" },
  { asset: "Warna brand", desc: "warna utama yang digunakan" },
  { asset: "Brand guideline", desc: "panduan brand jika tersedia" },
  { asset: "Foto produk", desc: "foto produk atau layanan" },
  { asset: "Foto outlet / tempat usaha", desc: "foto lokasi usaha" },
];

const accessRequired = [
  { access: "Meta Business Manager", objective: "Mengelola iklan" },
  { access: "Ad Account", objective: "Menjalankan campaign iklan" },
  { access: "Instagram", objective: "Mengelola konten dan interaksi" },
  { access: "Facebook Page", objective: "Mengelola aktivitas pemasaran" },
  { access: "TikTok", objective: "Jika bisnis menggunakan TikTok" },
  {
    access: "Google Business",
    objective: "Membantu bisnis ditemukan di Google",
  },
  { access: "Website / Hosting", objective: "Jika bisnis memiliki website" },
];

const setupTimeline = [
  {
    week: "Week 1",
    stage: "Planning",
    activity: "Pengumpulan asset dari klien dan perencanaan campaign",
  },
  {
    week: "Week 2",
    stage: "Production",
    activity: "Pembuatan desain, konten, dan materi campaign",
  },
  {
    week: "Week 3",
    stage: "Review",
    activity: "Klien melakukan review dan memberikan revisi",
  },
  {
    week: "Week 4",
    stage: "Activation",
    activity: "Campaign mulai dijalankan dan dioptimalkan",
  },
];

const reportingTypes = [
  {
    report: "Weekly Summary",
    desc: "Ringkasan performa campaign setiap minggu",
  },
  {
    report: "Monthly Report",
    desc: "Laporan lengkap performa campaign",
  },
];

const teamRoles = [
  { role: "Digital Marketing Specialist", duty: "Mengelola strategi campaign" },
  {
    role: "Social Media Specialist",
    duty: "Mengelola konten dan akun media sosial",
  },
  { role: "Graphic Designer", duty: "Membuat desain konten dan materi visual" },
  { role: "Web Programmer", duty: "Mengelola website dan sistem digital" },
];

export default function OnboardingKitPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [session, setSession] = useState<ClientSession | null>(null);
  const [agreements, setAgreements] = useState<AgreementState>(
    initialAgreementState,
  );

  useEffect(() => {
    const boot = async () => {
      try {
        const rawSession = localStorage.getItem(CLIENT_SESSION_KEY);
        if (!rawSession) {
          router.replace("/client-login");
          return;
        }

        const parsed = JSON.parse(rawSession) as ClientSession;
        if (!parsed?.id) {
          localStorage.removeItem(CLIENT_SESSION_KEY);
          router.replace("/client-login");
          return;
        }

        const response = await axiosInstance.get<ClientSession>(
          `/client-onboarding/${parsed.id}`,
        );
        const latestSession = response.data;

        setSession(latestSession);
        setAgreements({
          agreementGuideApproved: Boolean(latestSession.agreementGuideApproved),
          agreementProgramCommitment: Boolean(
            latestSession.agreementProgramCommitment,
          ),
        });
        localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(latestSession));
      } catch {
        localStorage.removeItem(CLIENT_SESSION_KEY);
        router.replace("/client-login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    boot();
  }, [router]);

  const agreementDone = useMemo(
    () =>
      agreements.agreementGuideApproved &&
      agreements.agreementProgramCommitment,
    [agreements],
  );

  const handleAgree = async (key: keyof AgreementState) => {
    if (!session || agreements[key]) return;

    const nextState: AgreementState = {
      ...agreements,
      [key]: true,
    };

    setAgreements(nextState);

    try {
      const payload =
        key === "agreementGuideApproved"
          ? { agreementGuideApproved: true }
          : { agreementProgramCommitment: true };

      const response = await axiosInstance.patch<ClientSession>(
        `/client-onboarding/${session.id}/agreement`,
        payload,
      );
      const updatedSession = response.data;

      setSession(updatedSession);
      setAgreements({
        agreementGuideApproved: Boolean(updatedSession.agreementGuideApproved),
        agreementProgramCommitment: Boolean(
          updatedSession.agreementProgramCommitment,
        ),
      });
      localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(updatedSession));
    } catch {
      setAgreements(agreements);
    }
  };

  if (isCheckingAuth || !session) {
    return (
      <>
        <ClientHeader />
        <main className="bg-[#f8fafc] min-h-screen relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-sm px-6 w-full">
            <div className="rounded-[2rem] border border-white/60 bg-white/80 backdrop-blur-xl p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-10 h-10 mx-auto mb-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="font-heading text-lg text-gray-600 font-medium animate-pulse">
                Memeriksa autentikasi...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <ClientHeader />
      <main className="min-h-screen bg-[#fafafa] pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden selection:bg-primary/20 selection:text-primary">
        {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 mx-auto w-full max-w-[1040px] px-5 sm:px-8">
        <div className="rounded-[2.5rem] md:rounded-[3.5rem] border border-white/60 bg-white/95 backdrop-blur-2xl p-6 sm:p-12 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          <header className="space-y-6 text-center max-w-3xl mx-auto mb-4 md:mb-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-1.5 font-heading text-[11px] font-bold tracking-[0.25em] text-primary uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              OCTOBEES Growth Engine
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-[3.5rem] text-gray-900 font-black tracking-tight !leading-[1.1]">
              Client Onboarding
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                {" "}
                Guide
              </span>
            </h1>
            <div className="space-y-5 font-body text-gray-600 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto pt-4">
              <p className="font-medium text-gray-900 text-lg">
                Selamat datang di OCTOBEES Growth Engine.
              </p>
              <p>
                Halaman ini dibuat untuk membantu Anda memahami bagaimana sistem bekerja, apa yang perlu Anda siapkan, serta bagaimana kita akan bekerja bersama selama program berjalan.
              </p>
              <div className="inline-flex mt-2 bg-amber-50 md:bg-amber-50/50 border border-amber-200/60 rounded-2xl px-5 py-3 text-amber-800 text-sm font-medium shadow-[0_2px_10px_rgba(251,191,36,0.1)]">
                Mohon membaca seluruh halaman ini dengan baik sebelum memulai.
              </div>
            </div>
          </header>

          <div className="my-10 md:my-14">
            <Divider />
          </div>

          <div className="space-y-12 md:space-y-16">
            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                Apa itu OCTOBEES Growth Engine
              </h3>
              <p>
                OCTOBEES Growth Engine adalah sistem pemasaran digital
                terstruktur yang dirancang untuk membantu bisnis mendapatkan
                lebih banyak pelanggan secara konsisten.
              </p>
              <p>
                Sistem ini bekerja dengan menggabungkan beberapa aktivitas
                pemasaran digital secara terkoordinasi sehingga calon pelanggan
                dapat:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 list-none pl-0">
                {[
                  "Menemukan bisnis Anda",
                  "Mengenal brand Anda",
                  "Berinteraksi dengan konten Anda",
                  "Memutuskan untuk membeli",
                  "Kembali membeli di masa depan",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 bg-gray-50/80 px-4 py-3 rounded-xl border border-gray-100 transition-colors hover:bg-white hover:border-primary/20 hover:shadow-sm"
                  >
                    <svg
                      className="w-5 h-5 text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <p className="font-heading font-bold text-lg text-gray-900 mb-4">
                  Aktivitas yang dijalankan dalam sistem ini meliputi:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Iklan digital di media sosial",
                    "Pembuatan konten untuk brand Anda",
                    "Pengelolaan akun media sosial",
                    "Optimalisasi halaman promosi",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:border-primary/50 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <p className="italic text-gray-500 border-l-4 border-primary/30 pl-4 py-1 mt-6">
                Dengan sistem ini, aktivitas pemasaran tidak dilakukan secara
                acak, tetapi dijalankan secara terstruktur dan terukur.
              </p>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                Client Portal (ClickUp)
              </h3>
              <p>
                Untuk menjalankan sistem Growth Engine, OCTOBEES menggunakan
                Client Portal berbasis{" "}
                <span className="font-bold text-gray-900">ClickUp</span>.
              </p>
              <p>Portal ini adalah tempat dimana Anda dapat:</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Melihat progress pekerjaan yang sedang dikerjakan tim OCTOBEES",
                  "Memberikan feedback atau revisi",
                  "Mengajukan request atau pertanyaan",
                  "Melihat laporan performa campaign",
                ].map((item) => (
                  <div
                    key={item}
                    className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 p-5 group transition-all hover:bg-white hover:border-gray-200"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-4 bg-primary/[0.03] border border-primary/10 rounded-2xl p-5 md:p-6 mt-4">
                <svg
                  className="w-6 h-6 text-primary shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700 italic leading-relaxed">
                  Semua aktivitas kerja akan dilakukan melalui portal ini agar
                  komunikasi tetap rapi, terorganisir, dan tidak tercecer.
                </p>
              </div>
              <p className="text-gray-600">
                Agar lebih mudah dipahami, silakan ikuti panduan lengkap pada
                video berikut.
              </p>
              <VideoPlaceholder label="Tutorial Penggunaan Client Portal" />
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                Growth Engine Framework
              </h3>
              <p>
                Agar Anda memahami bagaimana sistem bekerja, berikut adalah
                tahapan yang digunakan dalam Growth Engine.
              </p>
              <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {frameworkSteps.map((item, idx) => (
                  <article
                    key={item.stage}
                    className="group relative rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
                  >
                    <span className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-sm font-bold text-white shadow-lg ring-4 ring-white transition-transform group-hover:scale-110">
                      0{idx + 1}
                    </span>
                    <h4 className="font-heading text-xl text-gray-900 font-bold mb-3">
                      {item.stage}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </article>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight pt-4">
                Pembagian Tugas
              </h3>
              <p>
                Agar sistem berjalan efektif, terdapat pembagian peran antara
                OCTOBEES dan klien.
              </p>
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent p-8 sm:p-10 overflow-hidden group hover:border-primary/40 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)]">
                      <span className="text-white font-heading font-black text-xl">
                        O
                      </span>
                    </div>
                    <div>
                      <p className="font-heading text-2xl text-gray-900 font-bold">
                        Tugas OCTOBEES
                      </p>
                      <p className="text-sm text-primary font-medium">
                        Tim Eksekutor
                      </p>
                    </div>
                  </div>
                  <ul className="list-none space-y-4 text-gray-700 relative z-10">
                    {[
                      "Manajemen Iklan Digital (Ads)",
                      "Pembuatan Konten Kreatif",
                      "Perencanaan Strategi Campaign",
                      "Sistem Pemasaran Pelanggan",
                    ].map((task) => (
                      <li key={task} className="flex items-start gap-3">
                        <svg
                          className="h-6 w-6 text-primary shrink-0 drop-shadow-sm"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium text-[15px]">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm overflow-hidden group hover:border-gray-300 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-[40px] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-gray-900 flex items-center justify-center shadow-md">
                      <span className="text-white font-heading font-black text-xl">
                        K
                      </span>
                    </div>
                    <div>
                      <p className="font-heading text-2xl text-gray-900 font-bold">
                        Fokus Klien
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        Pemilik Bisnis
                      </p>
                    </div>
                  </div>
                  <ul className="list-none space-y-4 text-gray-700 relative z-10">
                    {[
                      "Memberikan pelayanan terbaik",
                      "Menjaga kualitas produk/layanan",
                      "Memastikan operasional berjalan lancar",
                      "Merespons pelanggan dengan cepat",
                    ].map((task) => (
                      <li key={task} className="flex items-start gap-3">
                        <svg
                          className="h-6 w-6 text-gray-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="font-medium text-[15px]">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-center italic text-gray-500 mt-2">
                Dengan kolaborasi dan pembagian fokus ini, pertumbuhan bisnis
                Anda akan jauh lebih terakselerasi.
              </p>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                Persiapan Klien
              </h3>
              <p>
                Bagian ini sangat penting, karena tim OCTOBEES membutuhkan
                informasi dan materi dari klien untuk memulai campaign.
              </p>

              <div className="space-y-5 pt-4">
                <h4 className="font-heading text-xl text-gray-900 font-bold flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <span className="h-3 w-1 rounded-full bg-primary" />
                  </span>
                  Product / Service Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {productServiceInfo.map((item) => (
                    <div
                      key={item.info}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                    >
                      <p className="font-bold text-gray-900 mb-1">
                        {item.info}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 min-w-1.5" />
                        {item.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-6">
                <h4 className="font-heading text-xl text-gray-900 font-bold flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <span className="h-3 w-1 rounded-full bg-emerald-500" />
                  </span>
                  Brand Assets
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brandAssets.map((item) => (
                    <article
                      key={item.asset}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all"
                    >
                      <p className="font-heading text-lg font-bold text-gray-900 mb-1">
                        {item.asset}
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-200/60 rounded-3xl p-6 sm:p-8">
                  <h4 className="font-heading text-xl text-amber-900 font-bold mb-3 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                    Detail Promosi
                  </h4>
                  <p className="text-amber-800/80 leading-relaxed text-[15px]">
                    Jika bisnis Anda memiliki promosi yang sedang berjalan,
                    mohon informasikan juga kepada tim OCTOBEES.{" "}
                    <span className="font-semibold text-amber-900 block mt-2">
                      Misal: Promo diskon, Promo paket, Event khusus, Happy
                      hour, Bundle deals, Promo musiman, Program loyalitas
                      pelanggan.
                    </span>
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-600">
                    Informasi ini akan membantu tim kami membuat campaign yang
                    lebih efektif.
                  </p>
                  <p className="text-gray-600 mt-2 mb-4">
                    Silakan ikuti panduan lengkap pada video berikut untuk
                    mengetahui cara mengunggah semua informasi dan asset yang
                    dibutuhkan.
                  </p>
                  <VideoPlaceholder label="Tutorial Unggah Assets ke ClickUp" />
                </div>
              </div>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                Access Required
              </h3>
              <p>
                Agar tim OCTOBEES dapat menjalankan sistem pemasaran dengan
                maksimal, kami memerlukan akses ke beberapa akun bisnis Anda.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {accessRequired.map((item) => (
                  <article
                    key={item.access}
                    className="group rounded-2xl border border-gray-100 bg-white p-6 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div>
                      <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                      </div>
                      <p className="font-heading text-lg font-bold text-gray-900">
                        {item.access}
                      </p>
                      <p className="mt-2 text-[13px] text-gray-500 font-medium">
                        {item.objective}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-6 rounded-3xl bg-gray-900 p-8 text-white/90 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[50px] pointer-events-none -mr-20 -mt-20" />
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="leading-relaxed">
                      Jika bisnis Anda belum memiliki beberapa akun di atas, tim OCTOBEES akan membantu menyiapkannya.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mt-6">
                Silakan ikuti panduan pada video berikut untuk mengetahui cara memberikan akses akun kepada tim OCTOBEES.
              </p>
              <VideoPlaceholder label="Tutorial Memberikan Akses Akun" />
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                Campaign Setup Timeline
              </h3>
              <p>
                Agar ekspektasi tetap realistis, berikut adalah timeline standar
                campaign yang dijalankan oleh OCTOBEES.
              </p>

              <div className="mt-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {setupTimeline.map((item, idx) => (
                  <div
                    key={item.week}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8 last:mb-0"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                      <span className="font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="font-heading font-bold text-lg text-gray-900">
                          {item.stage}
                        </span>
                        <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                          {item.week}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50/30 p-5 mt-8 shadow-sm">
                <svg
                  className="h-6 w-6 text-amber-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="text-sm font-medium leading-relaxed text-amber-800">
                  <span className="font-bold block mb-1">Catatan penting</span>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Maksimal 2 kali revisi untuk setiap materi campaign</li>
                    <li>Semua revisi harus disampaikan melalui ClickUp</li>
                  </ul>
                </div>
              </div>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
                Communication Protocol
              </h3>
              <p>
                Agar komunikasi tetap rapi dan tidak membingungkan, OCTOBEES
                menggunakan sistem komunikasi berikut.
              </p>
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <article className="rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#00e3ff]/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-transform group-hover:scale-125" />
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00e3ff] to-[#00b0ff] flex items-center justify-center shadow-md">
                      <svg
                        className="w-6 h-6 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2 18.439l3.69-2.828c1.961 2.56 4.044 3.739 6.363 3.739 2.307 0 4.33-1.166 6.203-3.704L22 18.405C19.298 22.065 15.941 24 12.053 24 8.178 24 4.788 22.078 2 18.439zM12.04 6.15l-6.568 5.66-3.036-3.52L12.055 0l9.543 8.296-3.05 3.509z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-heading text-xl md:text-2xl text-gray-900 font-bold">
                        ClickUp
                      </h4>
                    </div>
                  </div>
                  <div className="relative z-10 text-[15px] space-y-3">
                    <p className="text-gray-600 font-medium">Digunakan untuk:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Request konten</li>
                      <li>Memberikan feedback</li>
                      <li>Mengajukan revisi</li>
                      <li>Mengirim pertanyaan atau support request</li>
                    </ul>
                    <p className="text-gray-900 font-semibold pt-2">
                      Semua aktivitas kerja akan dicatat melalui portal ini.
                    </p>
                  </div>
                </article>

                <article className="rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-transform group-hover:scale-125" />
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-heading text-xl md:text-2xl text-gray-900 font-bold">
                        Response Time (SLA)
                      </h4>
                    </div>
                  </div>
                  <div className="relative z-10 text-[15px]">
                    <p className="text-gray-600 leading-relaxed">
                      Respon tiket adalah <strong className="text-gray-900">4-8 jam kerja</strong>. Waktu respon dihitung pada hari dan jam operasional.
                    </p>
                  </div>
                </article>
              </div>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight text-center">
                Performance Reporting
              </h3>
              <p className="text-center max-w-2xl mx-auto">
                Agar klien dapat memantau perkembangan campaign, OCTOBEES menyediakan laporan secara berkala.
              </p>
              <div className="grid gap-6 md:grid-cols-2 mt-8">
                {reportingTypes.map((item) => (
                  <article
                    key={item.report}
                    className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 flex items-start gap-5 shadow-sm transition-all hover:bg-gray-50/50 hover:border-gray-200"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-heading text-xl text-gray-900 font-bold mb-1.5">
                        {item.report}
                      </p>
                      <p className="text-[15px] text-gray-500">{item.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                <h4 className="font-bold text-gray-900 mb-3 ml-2 text-lg">
                  Isi Laporan
                </h4>
                <p className="text-gray-600 leading-relaxed ml-2 text-[15px] mb-2">
                  Laporan biasanya mencakup:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2 text-[15px]">
                  <li>Performa iklan</li>
                  <li>Jumlah orang yang melihat konten</li>
                  <li>Interaksi dengan konten</li>
                  <li>Jumlah calon pelanggan yang masuk</li>
                  <li>Jumlah konversi atau pembelian</li>
                </ul>
                <div className="inline-flex mt-6 ml-2 items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 text-primary font-medium text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Semua laporan dapat dilihat melalui Client Portal.
                </div>
              </div>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight text-center">
                Team
              </h3>
              <p className="text-center max-w-2xl mx-auto">
                Selama program berjalan, Anda akan didukung oleh tim OCTOBEES yang terdiri dari:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-8">
                {teamRoles.map((item) => (
                  <article
                    key={item.role}
                    className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                  >
                    <p className="font-heading text-lg text-gray-900 font-bold transition-colors group-hover:text-primary mb-1.5">
                      {item.role}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {item.duty}
                    </p>
                  </article>
                ))}
              </div>
              <p className="italic text-gray-400 text-center mt-6 text-sm">
                Tim profesional yang bekerja terkoordinasi untuk memastikan
                setiap campaign mencapai potensi terbaiknya.
              </p>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 relative z-10">
                  Commitment
                </h3>
                <p className="text-gray-300 mb-8 relative z-10 text-[17px]">
                  Dengan menerima dan membuka halaman onboarding ini, Anda dianggap:
                </p>
                <div className="grid gap-4 relative z-10">
                  {[
                    "Telah membaca seluruh panduan onboarding",
                    "Memahami cara kerja sistem OCTOBEES Growth Engine",
                    "Menyetujui aturan komunikasi dan proses kerja",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-center bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 transition-colors hover:bg-white/10"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[12px] font-bold text-primary ring-1 ring-primary/50">
                        ✓
                      </span>
                      <p className="text-sm sm:text-[15px] font-medium text-white/90">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-12 text-center relative z-10">
                  <p className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 font-heading text-xl sm:text-2xl font-black tracking-wide">
                    Kami sangat senang dapat bekerja sama dengan Anda untuk membantu mengembangkan bisnis Anda melalui OCTOBEES Growth Engine.
                  </p>
                </div>
              </div>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <h3 className="font-heading text-3xl md:text-4xl text-gray-900 font-bold text-center tracking-tight mb-4">
                Disclaimer & Agreement
              </h3>
              <p className="text-center max-w-2xl mx-auto text-gray-600 text-lg">
                Sebelum program OCTOBEES Growth Engine dijalankan, mohon membaca bagian ini dengan baik.
              </p>
              <p className="text-center max-w-2xl mx-auto mb-10 text-gray-600 text-[15px]">
                Bagian ini menjelaskan beberapa ketentuan penting mengenai kerahasiaan informasi, tanggung jawab masing-masing pihak, serta batasan layanan.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "1. Kerahasiaan Informasi (Non-Disclosure Agreement)",
                    content: (
                      <>
                        <p className="mb-2">Selama program berlangsung, klien mungkin akan memberikan berbagai informasi kepada OCTOBEES, termasuk namun tidak terbatas pada:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          <li>Data bisnis</li>
                          <li>Data pelanggan</li>
                          <li>Informasi produk atau layanan</li>
                          <li>Strategi pemasaran</li>
                          <li>Informasi operasional internal</li>
                        </ul>
                        <p className="mb-2">OCTOBEES berkomitmen untuk menjaga kerahasiaan seluruh informasi tersebut dan tidak akan membagikannya kepada pihak lain tanpa izin dari klien, kecuali jika diperlukan untuk menjalankan layanan yang disepakati.</p>
                        <p className="mb-2">Sebaliknya, klien juga tidak diperkenankan menyebarkan informasi internal OCTOBEES, termasuk namun tidak terbatas pada:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1 text-gray-600">
                          <li>Sistem kerja internal</li>
                          <li>Framework pemasaran</li>
                          <li>Template campaign</li>
                          <li>Proses operasional</li>
                          <li>Materi strategi yang diberikan selama program</li>
                        </ul>
                        <p>Informasi tersebut merupakan properti intelektual OCTOBEES.</p>
                      </>
                    )
                  },
                  {
                    title: "2. Tanggung Jawab Klien",
                    content: (
                      <>
                        <p className="mb-2">Agar sistem Growth Engine dapat berjalan dengan baik, klien memiliki beberapa tanggung jawab, antara lain:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          <li>Memberikan informasi bisnis yang akurat dan benar</li>
                          <li>Menyediakan asset dan materi yang diminta oleh tim OCTOBEES</li>
                          <li>Memberikan akses akun yang diperlukan</li>
                          <li>Memberikan feedback atau revisi dalam waktu yang wajar</li>
                          <li>Mengikuti sistem komunikasi yang telah ditetapkan</li>
                        </ul>
                        <p>Keterlambatan dalam penyediaan informasi, asset, atau akses dapat mempengaruhi timeline campaign.</p>
                      </>
                    )
                  },
                  {
                    title: "3. Batasan Layanan",
                    content: (
                      <>
                        <p className="mb-2">OCTOBEES menyediakan layanan sistem pemasaran digital, namun terdapat beberapa faktor yang berada di luar kendali OCTOBEES, seperti:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          <li>kualitas produk atau layanan klien</li>
                          <li>harga produk</li>
                          <li>pelayanan kepada pelanggan</li>
                          <li>pengalaman pelanggan di outlet atau tempat usaha</li>
                          <li>kondisi pasar</li>
                          <li>kompetitor di industri yang sama</li>
                        </ul>
                        <p>Oleh karena itu, OCTOBEES tidak dapat menjamin hasil penjualan tertentu, namun akan menjalankan sistem pemasaran secara profesional sesuai dengan framework Growth Engine.</p>
                      </>
                    )
                  },
                  {
                    title: "4. Hak Kekayaan Intelektual",
                    content: (
                      <>
                        <p className="mb-2">Semua sistem, framework, metode kerja, template campaign, dan materi strategi yang digunakan dalam program Growth Engine merupakan milik OCTOBEES.</p>
                        <p className="mb-2">Klien tidak diperkenankan untuk:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          <li>menyalin sistem kerja OCTOBEES</li>
                          <li>mendistribusikan materi internal</li>
                          <li>menjual ulang sistem kepada pihak lain</li>
                        </ul>
                        <p>tanpa izin tertulis dari OCTOBEES.</p>
                      </>
                    )
                  },
                  {
                    title: "5. Risiko Operasional",
                    content: (
                      <>
                        <p className="mb-2">OCTOBEES tidak bertanggung jawab atas kerugian yang disebabkan oleh:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          <li>kesalahan informasi yang diberikan oleh klien</li>
                          <li>perubahan mendadak pada bisnis klien</li>
                          <li>gangguan pada platform pihak ketiga (Meta, Google, TikTok, dll)</li>
                          <li>kebijakan platform yang berubah</li>
                          <li>akun bisnis yang dibatasi oleh platform</li>
                        </ul>
                        <p>Namun tim OCTOBEES akan membantu mencari solusi terbaik jika situasi tersebut terjadi.</p>
                      </>
                    )
                  },
                  {
                    title: "6. Penyelesaian Perselisihan",
                    content: (
                      <>
                        <p className="mb-2">Apabila terjadi perbedaan pendapat atau konflik selama program berlangsung, kedua pihak sepakat untuk:</p>
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          <li>Menyelesaikan masalah melalui komunikasi secara baik</li>
                          <li>Mengutamakan diskusi dan solusi bersama</li>
                          <li>Menghindari tindakan yang dapat merugikan reputasi kedua pihak</li>
                        </ul>
                        <p>Jika diperlukan, penyelesaian dapat dilakukan melalui jalur hukum sesuai dengan peraturan yang berlaku di wilayah hukum Republik Indonesia.</p>
                      </>
                    )
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md"
                  >
                    <h3 className="font-heading text-lg sm:text-xl text-gray-900 font-bold mb-4">
                      {item.title}
                    </h3>
                    <div className="text-[15px] text-gray-600 leading-relaxed">
                      {item.content}
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-16 rounded-[2.5rem] md:rounded-[3rem] border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent p-8 sm:p-12 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none -mr-32 -mt-32" />
                <h3 className="font-heading text-2xl md:text-3xl text-gray-900 font-bold tracking-tight relative z-10">
                  Agreement Confirmation
                </h3>
                <p className="mt-3 text-gray-600 max-w-2xl relative z-10 text-[15px] sm:text-lg mb-2">
                  Sebelum melanjutkan program, mohon konfirmasi bahwa Anda telah membaca dan memahami seluruh isi halaman onboarding ini.
                </p>

                <div className="mt-10 space-y-5 relative z-10">
                  <label
                    className={`flex cursor-pointer items-start gap-5 rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md ${agreements.agreementGuideApproved ? "bg-white border-primary shadow-[0_0_15px_rgba(255,107,0,0.1)]" : "bg-white border-gray-200 hover:border-primary/50"}`}
                  >
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={agreements.agreementGuideApproved}
                        onChange={() => handleAgree("agreementGuideApproved")}
                        disabled={agreements.agreementGuideApproved}
                      />
                      <div className="w-6 h-6 rounded-md border-2 border-gray-300 bg-white transition-all peer-checked:bg-primary peer-checked:border-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center">
                        <svg
                          className={`w-4 h-4 text-white transition-opacity ${agreements.agreementGuideApproved ? "opacity-100" : "opacity-0"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <span
                      className={`text-[15px] leading-relaxed transition-colors ${agreements.agreementGuideApproved ? "text-gray-900 font-bold" : "text-gray-600 font-medium"}`}
                    >
                      Saya menyatakan bahwa saya telah membaca, memahami, dan
                      menyetujui seluruh isi panduan OCTOBEES Growth Engine,
                      termasuk sistem kerja, aturan komunikasi, serta disclaimer
                      yang tercantum pada halaman ini.
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-5 rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md ${agreements.agreementProgramCommitment ? "bg-white border-primary shadow-[0_0_15px_rgba(255,107,0,0.1)]" : "bg-white border-gray-200 hover:border-primary/50"}`}
                  >
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={agreements.agreementProgramCommitment}
                        onChange={() =>
                          handleAgree("agreementProgramCommitment")
                        }
                        disabled={agreements.agreementProgramCommitment}
                      />
                      <div className="w-6 h-6 rounded-md border-2 border-gray-300 bg-white transition-all peer-checked:bg-primary peer-checked:border-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center">
                        <svg
                          className={`w-4 h-4 text-white transition-opacity ${agreements.agreementProgramCommitment ? "opacity-100" : "opacity-0"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <span
                      className={`text-[15px] leading-relaxed transition-colors ${agreements.agreementProgramCommitment ? "text-gray-900 font-bold" : "text-gray-600 font-medium"}`}
                    >
                      Saya berkomitmen untuk mengikuti program OCTOBEES Growth
                      Engine sesuai dengan sistem yang telah dijelaskan.
                    </span>
                  </label>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-primary/10 relative z-10">
                  <div
                    className={`flex items-center gap-3 rounded-full px-5 py-2.5 font-bold uppercase tracking-wider text-xs border ${
                      agreementDone
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-white text-gray-500 border-gray-200 shadow-sm"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${agreementDone ? "bg-emerald-500" : "bg-gray-400"}`}
                    />
                    {agreementDone
                      ? "Agreement Confirmed"
                      : "Pending Confirmation"}
                  </div>

                  {agreementDone && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        Dengan mencentang pernyataan di atas, Anda dianggap telah memberikan persetujuan penuh untuk menjalankan program OCTOBEES Growth Engine.
                      </p>
                      <p className="text-[13px] text-gray-500 mt-1">
                        Kami sangat menghargai kepercayaan Anda untuk bekerja sama dengan OCTOBEES.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SectionBlock>

            <Divider />

            <SectionBlock>
              <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -mr-10 -mt-10" />
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-heading text-xl md:text-2xl text-gray-900 font-bold tracking-tight">
                      Langkah Selanjutnya
                    </h3>
                    <p className="text-gray-600 text-[15px] leading-relaxed">
                      Setelah Anda membaca dan mencentang persetujuan di atas, kami mengharapkan Anda untuk segera mengubah kata sandi demi menjaga keamanan akun. Silakan akses opsi <b>Change Password</b> melalui menu profil Anda yang berada di sudut kanan atas layar.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 transition-colors">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </SectionBlock>
          </div>
        </div>
      </div>
    </main>
  </>
);
}
