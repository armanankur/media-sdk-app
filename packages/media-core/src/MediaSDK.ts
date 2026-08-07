import { PexelsClient } from "./client/pexelsClient";
import { MemoryCache } from "./cache/memoryCache";
import { MediaEventEmitter, createDefaultLogger } from "./events/emitter";

export interface MediaSDKConfig {
  apiKey: string;
}

export class MediaSDK {
private client: PexelsClient;

private cache = new MemoryCache<any>();

public events = new MediaEventEmitter();

constructor(config: MediaSDKConfig) {

    this.client = new PexelsClient(config.apiKey);

    createDefaultLogger(this.events);

}

async search(query: string, page = 1, perPage = 20) {
  const cacheKey = `search:${query}:${page}:${perPage}`;

  if (this.cache.has(cacheKey)) {
    return this.cache.get(cacheKey);
  }

  const result = await this.client.search(query, page, perPage);

  this.cache.set(cacheKey, result);

  return result;
}

trackView(item: unknown) {
  this.events.emit("view", item);
}

trackDownload(item: unknown) {
  this.events.emit("download", item);
}


}


