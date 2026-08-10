import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  isActive: boolean;
}

export function VideoPlayer({ src, isActive }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);

  // 🔥 autoplay / pause logic
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      setProgress(0);
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  // 🔥 progress tracking
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const update = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
      }
    };

    video.addEventListener("timeupdate", update);

    return () => {
      video.removeEventListener("timeupdate", update);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* 🔥 Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 3,
          background: "rgba(255,255,255,0.3)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "#6c757d",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* 🎥 Video */}
      <video
        ref={ref}
         src={isActive ? src : undefined} 
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}