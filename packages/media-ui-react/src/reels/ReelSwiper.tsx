import { useEffect, useRef, useState } from "react";

export function ReelSwiper({ items }: any) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(
        container.scrollTop / window.innerHeight
      );
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () =>
      container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {items.map((item: any, index: number) => (
        <div
          key={item.id}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
          }}
        >
          <video
            src={item.videoUrl}
            muted
            loop
            playsInline
            autoPlay={index === activeIndex}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </div>
  );
}