import { LightboxProps } from "./types";
import { useLightbox } from "./useLightbox";
import { createPortal } from "react-dom";
export function Lightbox({
  items,
  selectedIndex,
  isOpen,
  onClose,
   onDownload,
}: LightboxProps) {
  const { currentIndex, next, previous } = useLightbox({
    initialIndex: selectedIndex,
    totalItems: items.length,
    onClose,
  });

  if (!isOpen) return null;

return createPortal(
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.9)",

      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      zIndex: 99999,
    }}
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        previous();
      }}
      style={{
        position: "absolute",
        left: 20,
        fontSize: 24,
        cursor: "pointer",
        padding: "8px 16px",

  background: "rgba(255, 255, 255, 0.15)",   // translucent
  backdropFilter: "blur(10px)",             // glass blur
  WebkitBackdropFilter: "blur(10px)",       // safari support

  border: "1px solid rgba(255,255,255,0.3)",
  color: "#fffd",
  borderRadius: 999,   // pill shape
  fontWeight: 400,
  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
  
}}

onMouseLeave={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
  
}}
    >◀
    </button>

    <img
      src={items[currentIndex].imageUrl}
      alt=""
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        objectFit: "contain",
        borderRadius: 12,
      }}
    />

    <button

onClick={async (e) => {
  e.stopPropagation();

  const url = items[currentIndex].imageUrl;

  const response = await fetch(url);
  const blob = await response.blob();

  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `image-${items[currentIndex].id}.jpg`;

  link.click();

  URL.revokeObjectURL(blobUrl);

  onDownload?.(items[currentIndex]);
}}




onMouseEnter={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
  e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
  e.currentTarget.style.transform = "translateX(-50%) scale(1)";
}}
style={{
  position: "absolute",
  bottom: 5,
  left: "50%",
  transform: "translateX(-50%)",

  padding: "8px 16px",

  background: "rgba(255, 255, 255, 0.15)",   // translucent
  backdropFilter: "blur(10px)",             // glass blur
  WebkitBackdropFilter: "blur(10px)",       // safari support

  border: "1px solid rgba(255,255,255,0.3)",

  color: "#fffd",

  borderRadius: 999,   // pill shape

  fontSize: 14,
  fontWeight: 400,

  cursor: "pointer",

  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

  transition: "all 0.2s ease",
}}
>
  Download
</button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        next();
      }}
     
            style={{
        position: "absolute",
        right: 20,
        fontSize: 24,
        cursor: "pointer",
        padding: "8px 16px",

  background: "rgba(255, 255, 255, 0.15)",   // translucent
  backdropFilter: "blur(10px)",             // glass blur
  WebkitBackdropFilter: "blur(10px)",       // safari support

  border: "1px solid rgba(255,255,255,0.3)",
  color: "#fffd",
  borderRadius: 999,   // pill shape
  fontWeight: 400,
  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
 
}}

onMouseLeave={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
 
}}
    >
      ▶
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
   
            style={{
        position: "absolute",
        top: 20,
         right: 20,
        fontSize: 20,
        cursor: "pointer",
        padding: "8px 14px",

  background: "rgba(255, 255, 255, 0.15)",   // translucent
  backdropFilter: "blur(10px)",             // glass blur
  WebkitBackdropFilter: "blur(10px)",       // safari support

  border: "1px solid rgba(255,255,255,0.3)",
  color: "#fffd",
  borderRadius: 999,   // pill shape
  fontWeight: 400,
  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
  
}}

onMouseLeave={(e) => {
  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
 
}}
    >
      ✕
    </button>
  </div>,
  document.body
);
}