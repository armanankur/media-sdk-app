import { useEffect, useRef } from "react";

interface UseReelSwiperProps {
  onActiveChange?(index: number): void;
}

export function useReelSwiper({
  onActiveChange,
}: UseReelSwiperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(
            entry.target.getAttribute("data-index")
          );

          onActiveChange?.(index);
        });
      },
      {
        threshold: 0.7,
      }
    );

    const children = containerRef.current.children;

    Array.from(children).forEach((child) =>
      observer.observe(child)
    );

    return () => observer.disconnect();
  }, [onActiveChange]);

  return {
    containerRef,
  };
}