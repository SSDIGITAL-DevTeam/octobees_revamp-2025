"use client";

import { useEffect, useMemo, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

/**
 * Extract YouTube video ID from various URL formats.
 * Returns null if the URL is not a recognizable YouTube link.
 */
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

type VideoPlayerProps = {
  url: string;
};

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  const youtubeId = useMemo(() => extractYouTubeId(url), [url]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any previous instance
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const container = containerRef.current;

    if (youtubeId) {
      // YouTube embed via Plyr
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-plyr-provider", "youtube");
      wrapper.setAttribute("data-plyr-embed-id", youtubeId);
      container.innerHTML = "";
      container.appendChild(wrapper);

      playerRef.current = new Plyr(wrapper, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
      });
    } else {
      // Direct video URL via HTML5 <video>
      const video = document.createElement("video");
      video.setAttribute("playsinline", "");
      video.setAttribute("controls", "");

      const source = document.createElement("source");
      source.setAttribute("src", url);

      // Infer type from extension
      const ext = url.split(".").pop()?.toLowerCase();
      if (ext === "mp4") source.setAttribute("type", "video/mp4");
      else if (ext === "webm") source.setAttribute("type", "video/webm");
      else if (ext === "ogg") source.setAttribute("type", "video/ogg");

      video.appendChild(source);
      container.innerHTML = "";
      container.appendChild(video);

      playerRef.current = new Plyr(video, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "settings",
          "pip",
          "fullscreen",
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [url, youtubeId]);

  return (
    <div className="rounded-2xl overflow-hidden bg-black">
      <div ref={containerRef} />
    </div>
  );
};

export default VideoPlayer;
