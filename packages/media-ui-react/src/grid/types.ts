export interface GridItem {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
}

export interface GridProps {
  items: GridItem[];
  onSelect?(item: GridItem): void;
  onLoadMore?(): void;
}