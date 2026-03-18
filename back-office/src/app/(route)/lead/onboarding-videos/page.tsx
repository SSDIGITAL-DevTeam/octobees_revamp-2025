"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { failedToast, successToast } from "@/utils/toast";
import { Upload, Play, X } from "lucide-react";

type VideoFile = {
  desktopFile?: File;
  mobileFile?: File;
};

const VIDEO_LABELS = [
  {
    key: "Tutorial Memberikan Akses Akun",
    description: "Tutorial untuk memberikan akses akun kepada tim OCTOBEES",
  },
];

export default function OnboardingVideosPage() {
  const [videos, setVideos] = useState<Record<string, { desktop: string | null; mobile: string | null }>>({});
  const [videoFiles, setVideoFiles] = useState<Record<string, VideoFile>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/back-office/videos-onboarding/videos");
        setVideos(response.data);
      } catch {
        VIDEO_LABELS.forEach((label) => {
          setVideos((prev) => ({
            ...prev,
            [label.key]: { desktop: null, mobile: null },
          }));
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleFileChange = (label: string, type: "desktop" | "mobile", file: File) => {
    setVideoFiles((prev) => ({
      ...prev,
      [label]: {
        ...prev[label],
        [type === "desktop" ? "desktopFile" : "mobileFile"]: file,
      },
    }));
    setVideos((prev) => ({
      ...prev,
      [label]: {
        ...prev[label],
        [type]: URL.createObjectURL(file),
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      VIDEO_LABELS.forEach((label) => {
        const files = videoFiles[label.key];
        if (files?.desktopFile) {
          formData.append("desktop", files.desktopFile);
          formData.append("desktopKey", label.key);
        }
        if (files?.mobileFile) {
          formData.append("mobile", files.mobileFile);
          formData.append("mobileKey", label.key);
        }
      });

      await axiosInstance.post("/back-office/videos-onboarding/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      successToast("Video berhasil diupload!");
      setVideoFiles({});
      
      const response = await axiosInstance.get("/back-office/videos-onboarding/videos");
      setVideos(response.data);
    } catch (error: any) {
      failedToast(error.response?.data?.error || "Gagal upload video");
    } finally {
      setIsSaving(false);
    }
  };

  const VideoUploadCard = ({ 
    label, 
    type, 
    currentUrl, 
    onFileChange 
  }: { 
    label: string;
    type: "desktop" | "mobile";
    currentUrl: string | null;
    onFileChange: (file: File) => void;
  }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setPreviewUrl(currentUrl);
    }, [currentUrl]);

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-red-700" />
          <span className="font-semibold text-sm">
            Video {type === "desktop" ? "Desktop" : "Mobile"} ({type === "desktop" ? "16:9" : "9:16"})
          </span>
        </div>
        
        <div className="relative">
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            className="hidden"
            id={`${label}-${type}`}
            ref={inputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                onFileChange(file);
              }
            }}
          />
          
          <label
            htmlFor={`${label}-${type}`}
            className="cursor-pointer"
          >
            {previewUrl ? (
              <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-700/50 transition-colors group">
                <video
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-red-700 ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewUrl(null);
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-red-700/50 transition-colors">
                <div className="w-14 h-14 rounded-full bg-red-700/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-red-700" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-700">Upload Video</p>
                  <p className="text-xs text-gray-500">MP4, WebM, atau OGG</p>
                </div>
              </div>
            )}
          </label>
        </div>
        
        {currentUrl && !previewUrl?.startsWith("blob:") && (
          <p className="text-xs text-gray-500 truncate">File tersimpan: {currentUrl.split("/").pop()}</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <main className="w-full flex flex-col gap-12 pb-12">
        <Header title={"Onboarding Videos"} label={"Lead Management"} />
        <section className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-red-700/20 border-t-red-700 rounded-full animate-spin" />
        </section>
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Onboarding Videos"} label={"Lead Management"} />
      <section className="flex flex-col gap-6 p-8 rounded-3xl bg-white border border-border shadow-sm w-full">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Video Tutorial</h1>
          <p>Upload video tutorial untuk halaman Client Onboarding Kit</p>
        </div>

        <div className="w-full h-px bg-gray-200" />

        <div className="flex flex-col gap-8">
          {VIDEO_LABELS.map((video) => (
            <div key={video.key} className="flex flex-col gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{video.key}</h2>
                <p className="text-sm text-gray-500 mt-1">{video.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VideoUploadCard
                  label={video.key}
                  type="desktop"
                  currentUrl={videos[video.key]?.desktop}
                  onFileChange={(file) => handleFileChange(video.key, "desktop", file)}
                />
                <VideoUploadCard
                  label={video.key}
                  type="mobile"
                  currentUrl={videos[video.key]?.mobile}
                  onFileChange={(file) => handleFileChange(video.key, "mobile", file)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold h-12 px-8 rounded-full"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </div>
            ) : (
              "Simpan Video"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}
