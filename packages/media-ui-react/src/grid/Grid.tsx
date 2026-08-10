import React from "react";
import { useGrid } from "../hooks/useGrid";

interface GridProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T, getItemProps: (index: number) => object) => React.ReactNode;
  renderLoadMore?: (getLoadMoreProps: () => object) => React.ReactNode;
  renderContainer?: (
    getContainerProps: () => object,
    children: React.ReactNode
  ) => React.ReactNode;
}

export function Grid<T>({
  items,
  pageSize,
  renderItem,
  renderLoadMore,
  renderContainer,
}: GridProps<T>) {
  const {
    visibleItems,
    hasMore,
    getContainerProps,
    getItemProps,
    getLoadMoreProps,
  } = useGrid({ items, pageSize });

  const children = visibleItems.map((item, index) =>
    renderItem(item, getItemProps.bind(null, index))
  );

  const container = renderContainer ? (
    renderContainer(getContainerProps, children)
  ) : (
    <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 16,
        }} {...getContainerProps()}>{children}</div>
  );

  const loadMoreEl = hasMore
    ? renderLoadMore ? (
        renderLoadMore(getLoadMoreProps)
      ) : (
        <button style={{
            textAlign: "center",
            marginTop: 24,
          }} {...getLoadMoreProps()}>Load More</button>
      )
    : null;

  return (
    <>
      {container}
      {loadMoreEl}
    </>
  );
}