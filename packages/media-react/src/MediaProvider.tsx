import { ReactNode, useMemo } from "react";
import { MediaSDK } from "media-core";
import { MediaContext } from "./context/MediaContext";

interface MediaProviderProps {
  apiKey: string;
  children: ReactNode;
}

export function MediaProvider({
  apiKey,
  children,
}: MediaProviderProps) {
  const sdk = useMemo(() => {
    return new MediaSDK({
      apiKey,
    });
  }, [apiKey]);

  return (
    <MediaContext.Provider value={sdk}>
      {children}
    </MediaContext.Provider>
  );
}