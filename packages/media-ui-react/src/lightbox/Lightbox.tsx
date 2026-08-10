import { createPortal } from "react-dom";
import { useLightbox } from "../lightbox/useLightbox"

export interface LightboxItem {
  id: number;
  imageUrl: string;
}

export interface LightboxProps {
  items: LightboxItem[];
  selectedIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (item: LightboxItem) => void;
  // Render props — consumer controls all markup and styles
  renderOverlay?: (props: object, children: React.ReactNode) => React.ReactNode;
  renderImage?: (props: object, item: LightboxItem) => React.ReactNode;
  renderPrevButton?: (props: object) => React.ReactNode;
  renderNextButton?: (props: object) => React.ReactNode;
  renderCloseButton?: (props: object) => React.ReactNode;
  renderDownloadButton?: (props: object) => React.ReactNode;
}

export function Lightbox({
  items,
  selectedIndex,
  isOpen,
  onClose,
  onDownload,
  renderOverlay,
  renderImage,
  renderPrevButton,
  renderNextButton,
  renderCloseButton,
  renderDownloadButton,
}: LightboxProps) {
  const {
    currentIndex,
    getOverlayProps,
    getImageProps,
    getPrevButtonProps,
    getNextButtonProps,
    getCloseButtonProps,
    getDownloadButtonProps,
  } = useLightbox({
    initialIndex: selectedIndex,
    totalItems: items.length,
    onClose,
  });

  if (!isOpen) return null;

  const currentItem = items[currentIndex];

  const prevButton = renderPrevButton ? (
    renderPrevButton(getPrevButtonProps())
  ) : (
    <button {...getPrevButtonProps()}>◀</button>
  );

  const nextButton = renderNextButton ? (
    renderNextButton(getNextButtonProps())
  ) : (
    <button {...getNextButtonProps()}>▶</button>
  );

  const closeButton = renderCloseButton ? (
    renderCloseButton(getCloseButtonProps())
  ) : (
    <button {...getCloseButtonProps()}>✕</button>
  );

  const downloadButton = renderDownloadButton ? (
    renderDownloadButton(getDownloadButtonProps(onDownload, currentItem))
  ) : (
    <button {...getDownloadButtonProps(onDownload, currentItem)}>
      Download
    </button>
  );

  const image = renderImage ? (
    renderImage(getImageProps(), currentItem)
  ) : (
    <img
      {...getImageProps()}
      src={currentItem.imageUrl}
      alt=""
      style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
    />
  );

  const content = (
    <>
      {prevButton}
      {image}
      {nextButton}
      {closeButton}
      {downloadButton}
    </>
  );

  const overlay = renderOverlay ? (
    renderOverlay(getOverlayProps(), content)
  ) : (
    <div {...getOverlayProps()}>{content}</div>
  );

  return createPortal(overlay, document.body);
}