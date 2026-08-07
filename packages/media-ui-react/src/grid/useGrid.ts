import { useCallback } from "react";
import { GridItem } from "./types";

interface UseGridProps {
  onSelect?(item: GridItem): void;
}

export function useGrid({ onSelect }: UseGridProps) {
  const getItemProps = useCallback(
    (item: GridItem) => ({
      onClick: () => onSelect?.(item),
      role: "button",
      tabIndex: 0,
    }),
    [onSelect]
  );

  return {
    getItemProps,
  };
}