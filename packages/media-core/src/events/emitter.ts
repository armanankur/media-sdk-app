export type MediaEvent = "view" | "download";
export type EventListener = (payload: unknown) => void;
export class MediaEventEmitter {
  private listeners = new Map<MediaEvent, Set<EventListener>>();

  on(event: MediaEvent, listener: EventListener) {
  if (!this.listeners.has(event)) {
    this.listeners.set(event, new Set());
  }

  this.listeners.get(event)!.add(listener);
}

off(event: MediaEvent, listener: EventListener) {
  this.listeners.get(event)?.delete(listener);
}

emit(event: MediaEvent, payload: unknown) {
  const listeners = this.listeners.get(event);

  if (!listeners) return;

  listeners.forEach((listener) => {
    listener(payload);
  });
}

}

export function createDefaultLogger(emitter: MediaEventEmitter) {
  emitter.on("view", (payload) => {
    console.log("[MEDIA VIEW]", payload);
  });

  emitter.on("download", (payload) => {
    console.log("[MEDIA DOWNLOAD]", payload);
  });
}