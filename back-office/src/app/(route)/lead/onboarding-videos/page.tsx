"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { failedToast, successToast } from "@/utils/toast";
import { Link2, ExternalLink, Trash2, Play } from "lucide-react";

const VIDEO_LABELS = [
  {
    key: "Tutorial Penggunaan Client Portal",
    description: "Tutorial penggunaan Client Portal OCTOBEES",
  },
  {
    key: "Tutorial Unggah Assets ke ClickUp",
    description: "Tutorial cara upload assets ke ClickUp",
  },
  {
    key: "Tutorial Memberikan Akses Akun",
    description: "Tutorial memberikan akses akun kepada tim OCTOBEES",
  },
];

type VideoData = {
  desktop: string | null;
  mobile: string | null;
};

export default function OnboardingVideosPage() {
  const [videos, setVideos] = useState<Record<string, VideoData>>({});
  const [originalVideos, setOriginalVideos] = useState<Record<string, VideoData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/back-office/videos-onboarding/videos");
        const data = response.data || {};
        setVideos(data);
        setOriginalVideos(data);
      } catch {
        const emptyData: Record<string, VideoData> = {};
        VIDEO_LABELS.forEach((label) => {
          emptyData[label.key] = { desktop: null, mobile: null };
        });
        setVideos(emptyData);
        setOriginalVideos(emptyData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleUrlChange = (labelKey: string, type: "desktop" | "mobile", value: string) => {
    const trimmedValue = value.trim() || null;
    setVideos((prev) => ({
      ...prev,
      [labelKey]: {
        ...prev[labelKey],
        [type]: trimmedValue,
      },
    }));
    setHasChanges(true);
  };

  const handleClear = (labelKey: string, type: "desktop" | "mobile") => {
    setVideos((prev) => ({
      ...prev,
      [labelKey]: {
        ...prev[labelKey],
        [type]: null,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post("/back-office/videos-onboarding/videos/save", videos);
      successToast("Video URL berhasil disimpan!");
      setOriginalVideos(videos);
      setHasChanges(false);
    } catch (error: any) {
      failedToast(error.response?.data?.error || "Gagal menyimpan video");
    } finally {
      setIsSaving(false);
    }
  };

  const VideoInputCard = ({
    labelKey,
    type,
    currentUrl,
  }: {
    labelKey: string;
    type: "desktop" | "mobile";
    currentUrl: string | null;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const plyrInstance = useRef<any>(null);

    const isYouTube = currentUrl?.includes("youtube.com") || currentUrl?.includes("youtu.be");
    const isVimeo = currentUrl?.includes("vimeo.com");

    const getVideoInfo = () => {
      if (!currentUrl) return null;

      if (isYouTube) {
        let videoId = currentUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (!videoId && currentUrl.includes("embed/")) {
          videoId = currentUrl.split("embed/")[1]?.split("?")[0]?.split("&")[0];
        }
        if (!videoId && currentUrl.includes("shorts/")) {
          videoId = currentUrl.split("shorts/")[1]?.split("?")[0];
        }
        return videoId ? { type: 'youtube', id: videoId } : null;
      }

      if (isVimeo) {
        let videoId = currentUrl.match(/vimeo\.com\/(\d+)/)?.[1];
        if (!videoId && currentUrl.includes("player.vimeo.com")) {
          videoId = currentUrl.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1];
        }
        return videoId ? { type: 'vimeo', id: videoId } : null;
      }

      return { type: 'video', src: currentUrl };
    };

    const videoInfo = getVideoInfo();

    useEffect(() => {
      if (!containerRef.current || !videoInfo) return;

      let isMounted = true;

      const initPlyr = async () => {
        const PlyrLib = (await import("plyr")).default;
        await import("plyr/dist/plyr.css");

        if (!isMounted || !containerRef.current) return;

        const timer = setTimeout(() => {
          if (containerRef.current && isMounted) {
            const videoElement = containerRef.current.querySelector('video, [data-plyr-provider]');
            if (videoElement && !(videoElement as any)._plyr) {
              plyrInstance.current = new PlyrLib(videoElement as any, {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'fullscreen'],
                ratio: type === 'desktop' ? '16:9' : '9:16',
                youtube: {
                  noCookie: true,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  modestbranding: 1,
                },
              });
            }
          }
        }, 100);

        return () => {
          clearTimeout(timer);
        };
      };

      initPlyr();

      return () => {
        isMounted = false;
        if (plyrInstance.current) {
          plyrInstance.current.destroy();
          plyrInstance.current = null;
        }
      };
    }, [currentUrl, type]);

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
            type="url"
            value={currentUrl || ""}
            onChange={(e) => handleUrlChange(labelKey, type, e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700/50 focus:border-red-700 transition-all"
          />
          <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {currentUrl && (
          <div className="flex items-center gap-2">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-red-700 hover:text-red-800 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Test Link
            </a>
            <button
              type="button"
              onClick={() => handleClear(labelKey, type)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
              Hapus
            </button>
          </div>
        )}

        {videoInfo && (
          <div ref={containerRef} className={`mt-2 rounded-lg overflow-hidden [&_.plyr]:rounded-lg ${type === "desktop" ? "aspect-video" : "aspect-[9/16]"}`}>
            {videoInfo.type === 'youtube' ? (
              <div data-plyr-provider="youtube" data-plyr-embed-id={videoInfo.id} />
            ) : videoInfo.type === 'vimeo' ? (
              <div data-plyr-provider="vimeo" data-plyr-embed-id={videoInfo.id} />
            ) : (
              <video
                className="plyr-video"
                playsInline
                controls
                src={videoInfo.src}
              />
            )}
          </div>
        )}

        <p className="text-xs text-gray-500">
          Masukkan URL YouTube, Vimeo, atau hosting video lainnya
        </p>
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
          <p>Kelola URL video tutorial untuk halaman Client Onboarding Kit</p>
        </div>

        <div className="w-full h-px bg-gray-200" />

        <div className="flex flex-col gap-8">
          {VIDEO_LABELS.map((video) => (
            <div
              key={video.key}
              className="flex flex-col gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{video.key}</h2>
                <p className="text-sm text-gray-500 mt-1">{video.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VideoInputCard
                  labelKey={video.key}
                  type="desktop"
                  currentUrl={videos[video.key]?.desktop}
                />
                <VideoInputCard
                  labelKey={video.key}
                  type="mobile"
                  currentUrl={videos[video.key]?.mobile}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold h-12 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </div>
            ) : (
              "Simpan Video URL"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}
