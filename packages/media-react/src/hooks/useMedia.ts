import { useContext } from "react";
import { MediaContext } from "../context/MediaContext";

export function useMedia() {
  const sdk = useContext(MediaContext);

  if (!sdk) {
    throw new Error("useMedia must be used inside MediaProvider");
  }

  return sdk;
}