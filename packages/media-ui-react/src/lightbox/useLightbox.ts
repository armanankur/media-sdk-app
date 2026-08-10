import { useCallback, useEffect, useState } from "react";

interface UseLightboxProps {
  initialIndex: number;
  totalItems: number;
  onClose(): void;
}

export function useLightbox({
  initialIndex,
  totalItems,
  onClose,
}: UseLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, totalItems - 1));
  }, [totalItems]);

  const previous = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") previous();
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [next, previous, onClose]);

  return {
    currentIndex,
    next,
    previous,
  };
}