import { useState, useEffect, useCallback } from "react";

interface UseLightboxOptions {
  initialIndex: number;
  totalItems: number;
  onClose: () => void;
}

export function useLightbox({
  initialIndex,
  totalItems,
  onClose,
}: UseLightboxOptions) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % totalItems);
  }, [totalItems]);

  const previous = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, previous, onClose]);

  const getOverlayProps = () => ({
    onClick: onClose,
    role: "dialog" as const,
    "aria-modal": true,
    "aria-label": "Image lightbox",
  });

  const getImageProps = () => ({
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    role: "img" as const,
  });

  const getPrevButtonProps = () => ({
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      previous();
    },
    "aria-label": "Previous image",
    type: "button" as const,
  });

  const getNextButtonProps = () => ({
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      next();
    },
    "aria-label": "Next image",
    type: "button" as const,
  });

  const getCloseButtonProps = () => ({
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    "aria-label": "Close lightbox",
    type: "button" as const,
  });

  const getDownloadButtonProps = (onDownload?: (item: any) => void, item?: any) => ({
    onClick: async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!item) return;
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `image-${item.id}.jpg`;
      link.click();
      URL.revokeObjectURL(blobUrl);
      onDownload?.(item);
    },
    "aria-label": "Download image",
    type: "button" as const,
  });

  return {
    currentIndex,
    next,
    previous,
    getOverlayProps,
    getImageProps,
    getPrevButtonProps,
    getNextButtonProps,
    getCloseButtonProps,
    getDownloadButtonProps,
  };
}