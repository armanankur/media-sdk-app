import { useEffect, useState } from "react";

interface UseGridProps<T> {
  items: T[];
  pageSize?: number;
}

export function useGrid<T>({
  items,
  pageSize = 20,
}: UseGridProps<T>) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = items.slice(0, visibleCount);

  function loadMore() {
    setVisibleCount((prev) => prev + pageSize);
  }

  const hasMore = visibleCount < items.length;

  return {
    items: visibleItems,
    loadMore,
    hasMore,
  };
}