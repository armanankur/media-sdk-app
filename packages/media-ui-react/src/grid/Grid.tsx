import { GridProps } from "./types";
import { useGrid } from "./useGrid";

export function Grid({ items, onSelect }: GridProps) {
  const { getItemProps } = useGrid({ onSelect });

  return (
    <>
      {items.map((item) => (
        <img
          key={item.id}
          src={item.thumbnailUrl}
          alt=""
          {...getItemProps(item)}
        />
      ))}
    </>
  );
}