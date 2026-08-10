import { useEffect, useRef, useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
interface ReelItem {
  id: number;
  videoUrl: string;
}

interface ReelProps {
  items: ReelItem[];
  onView?: (item: ReelItem) => void;
}

export function Reel({ items, onView }: ReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [likedIndex, setLikedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const lastTapRef = useRef(0);

  function handleTap(index: number) {
    const now = Date.now();

    if (now - lastTapRef.current < 300) {
      setLikedIndex(index);
      setTimeout(() => setLikedIndex(null), 700);
    }

    lastTapRef.current = now;
  }
  useEffect(() => {
  if (items.length > 0) {
    setActiveIndex(0);
  }
}, [items]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
    const visibleEntry = entries.find(e => e.isIntersecting);

if (!visibleEntry) return;

const index = Number(
  visibleEntry.target.getAttribute("data-index")
);

const item = items[index];

if (item) {
  onView?.(item);
  setActiveIndex(index);
}
      },
      { threshold: 0.6 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, onView]);

  return (
    <div
      ref={containerRef}
     style={{
  height: "100vh",
  overflowY: "scroll",
  scrollSnapType: "y mandatory",
  scrollBehavior: "smooth",
}}
    >

      {items.map((item, index) => (
  <div
    key={item.id}
    ref={(el) => {
      itemRefs.current[index] = el;
    }}
    data-index={index}
    style={{
      height: "100vh",
      scrollSnapAlign: "start",
      position: "relative",
    }}
  >
    {/* 🎥 Video Player */}
    <VideoPlayer
      src={item.videoUrl}
      isActive={activeIndex === index}
    />

    {/* ❤️ Like animation */}
    {likedIndex === index && (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 80,
        }}
      >
        ❤️
      </div>
    )}

    {/* 🔘 Buttons */}
    <div
      style={{
        position: "absolute",
        right: 20,
        bottom: 40,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <button onClick={() => handleTap(index)} 
         style={{
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
    transition: "all 0.25s ease",
  }}>
    <span style={{
      fontSize: "20px",
      color: "#111",
      transition: "all 0.2s ease",
    }}>
      ❤️ </span></button>

      <button
        onClick={() => window.open(item.videoUrl)}
 style={{
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
    transition: "all 0.25s ease",
  }}
      >
       <span style={{
      fontSize: "20px",
      color: "#111",
      transition: "all 0.2s ease",
    }}>  ⬇️ </span>
      </button>
    </div>
  </div>
))}
    </div>
  );
}
