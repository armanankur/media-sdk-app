import { useEffect, useRef } from "react";
import { GridItem } from "./types";

interface UseGridProps {
  items: GridItem[];
  onSelect?(item: GridItem): void;
  onLoadMore?(): void;
}

export function useGrid({
  items,
  onSelect,
  onLoadMore,
}: UseGridProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current || !onLoadMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [onLoadMore]);

  const getItemProps = (item: GridItem) => ({
    onClick: () => onSelect?.(item),
    role: "button" as const,
    tabIndex: 0,
  });

  return {
    getItemProps,
    loaderRef,
  };
}