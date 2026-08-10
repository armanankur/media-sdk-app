export interface ReelItem {
  id: number;
  videoUrl: string;
  thumbnailUrl?: string;
}

export interface ReelSwiperProps {
  items: ReelItem[];
  onActiveChange?(index: number): void;
}