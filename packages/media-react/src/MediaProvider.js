import { useMemo } from "react";
import { MediaSDK } from "media-core";
import { MediaContext } from "./context/MediaContext";
export function MediaProvider({ apiKey, children, }) {
    const sdk = useMemo(() => {
        return new MediaSDK({
            apiKey,
        });
    }, [apiKey]);
    return (<MediaContext.Provider value={sdk}>
      {children}
    </MediaContext.Provider>);
}
