import { createContext } from "react";
import { MediaSDK } from "media-core";

export const MediaContext = createContext<MediaSDK | null>(null);