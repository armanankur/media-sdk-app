import { useState } from "react";

interface UseGridOptions<T> {
  items: T[];
  pageSize?: number;
}

export function useGrid<T>({ items, pageSize = 12 }: UseGridOptions<T>) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const loadMore = () => setVisibleCount((c) => c + pageSize);

  const getContainerProps = () => ({
    role: "list" as const,
  });

  const getItemProps = (index: number) => ({
    role: "listitem" as const,
    key: index,
  });

  const getLoadMoreProps = () => ({
    onClick: loadMore,
    "aria-label": "Load more items",
    type: "button" as const,
  });

  return {
    visibleItems,
    hasMore,
    loadMore,
    getContainerProps,
    getItemProps,
    getLoadMoreProps,
  };
}