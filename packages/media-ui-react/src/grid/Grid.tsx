import React from "react";
import { useGrid } from "../hooks/useGrid";

interface GridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function Grid<T>({
  items,
  renderItem,
}: GridProps<T>) {
  const {
    items: visibleItems,
    loadMore,
    hasMore,
  } = useGrid({ items });

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        {visibleItems.map((item, index) => (
          <React.Fragment key={index}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>

      {hasMore && (
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
          }}
        >
          <button onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </>
  );
}