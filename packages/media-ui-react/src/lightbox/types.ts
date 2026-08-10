export interface LightboxItem {
  id: number;
  imageUrl: string;
}

export interface LightboxProps {
  items: LightboxItem[];
  selectedIndex: number;
  isOpen: boolean;
  onClose(): void;
  onDownload?(item: LightboxItem): void;
}

export interface LightboxProps {
  items: LightboxItem[];
  selectedIndex: number;
  isOpen: boolean;
  onClose(): void;

  onDownload?(item: LightboxItem): void;   // ✅ correct
}