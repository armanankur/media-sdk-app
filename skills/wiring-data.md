# Wiring Data with `media-react`

> **When to use this skill:** Any time you need to fetch photos or videos,
> handle search, paginate results, track user events, or wire the SDK into a
> React component tree.

---

## Table of Contents

1. [Provider Setup](#1-provider-setup)
2. [Accessing the SDK](#2-accessing-the-sdk)
3. [Fetching Photos](#3-fetching-photos)
4. [Fetching Videos](#4-fetching-videos)
5. [Unified Fetch Pattern](#5-unified-fetch-pattern)
6. [Debounced Search](#6-debounced-search)
7. [Infinite Scroll](#7-infinite-scroll)
8. [Event Tracking](#8-event-tracking)
9. [Caching](#9-caching)
10. [Common Mistakes](#10-common-mistakes)

---

## 1. Provider Setup

Wrap your entire app with `MediaProvider`. It initialises `MediaSDK` once and
makes it available to every component in the tree.

```tsx
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MediaProvider } from "media-react";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
      <App />
    </MediaProvider>
  </StrictMode>
);
```

**Ground rules**

| Rule | Why |
|---|---|
| `MediaProvider` must wrap every component that calls `useMedia()` | The hook reads from React context — no provider means a throw |
| Always read the API key from an env variable | Never hardcode keys in source |
| Never use `import.meta.env` inside `media-core` | Env vars belong in the app layer only |
| One provider per app — do not nest | A second provider creates a second SDK instance and a second cache |
| Add `VITE_PEXELS_API_KEY` to Vercel Environment Variables | Without it the app silently fails to fetch in production |

---

## 2. Accessing the SDK

```tsx
import { useMedia } from "media-react";

function MyComponent() {
  const sdk = useMedia(); // returns a MediaSDK instance
}
```

`useMedia()` throws a descriptive error if called outside `MediaProvider` —
no null-checking needed anywhere in your component.

---

## 3. Fetching Photos

```tsx
// Curated / trending feed
const result = await sdk.curated(page, perPage); // defaults: page=1, perPage=20
const photos = result?.photos ?? [];

// Keyword search
const result = await sdk.search("mountains", page, perPage);
const photos = result?.photos ?? [];
```

**Photo shape** (key fields you'll use most)

```ts
{
  id: number;
  alt: string;
  photographer: string;
  src: {
    tiny: string;      // thumbnail
    small: string;
    medium: string;    // ← use in Grid
    large: string;     // ← use in Lightbox
    original: string;
  };
}
```

---

## 4. Fetching Videos

```tsx
// Popular feed
const result = await sdk.videos.popular(page, perPage); // defaults: page=1, perPage=10
const videos = result?.videos ?? [];

// Keyword search
const result = await sdk.videos.search("ocean", page, perPage);
const videos = result?.videos ?? [];
```

**Video shape** (key fields)

```ts
{
  id: number;
  type: "video";
  width: number;
  height: number;
  duration: number;
  url: string;
  thumbnailUrl: string; // pre-mapped from v.image
  videoUrl: string;     // pre-mapped from v.video_files[0].link
}
```

> ⚠️ **Always sanitise `videoUrl` before use** — Pexels occasionally returns
> encoded brackets that break video playback:
> ```ts
> videoUrl: v.videoUrl?.replace(/[[\]]/g, "")
> ```

---

## 5. Unified Fetch Pattern

Use **one** `fetchData` function for both search and curated — never split
them into separate functions. Use `useCallback` so it stays stable across
renders, and a `loadingRef` to block duplicate calls:

```tsx
import { useState, useRef, useCallback, useEffect } from "react";
import { useMedia } from "media-react";

export default function App() {
  const sdk = useMedia();

  const [images, setImages]   = useState<any[]>([]);
  const [videos, setVideos]   = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage]       = useState(1);
  const [query, setQuery]     = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Use a ref — not state — so the observer never sees a stale value
  const loadingRef    = useRef(false);
  const isFirstRender = useRef(true);

  const fetchData = useCallback(
    async (q: string, currentPage: number) => {
      if (loadingRef.current) return; // guard against concurrent calls
      loadingRef.current = true;
      setLoading(true);

      try {
        const [photoRes, videoRes] = await Promise.all(
          q.trim()
            ? [sdk.search(q, currentPage), sdk.videos.search(q, currentPage)]
            : [sdk.curated(currentPage), sdk.videos.popular(currentPage)]
        );

        const newPhotos = photoRes?.photos ?? [];
        const newVideos = videoRes?.videos ?? [];

        if (currentPage === 1) {
          // Reset — new search or query cleared
          setImages(newPhotos);
          setVideos(newVideos);
        } else {
          // Append — user scrolled to load more
          setImages((prev) => [...prev, ...newPhotos]);
          setVideos((prev) => [...prev, ...newVideos]);
        }
      } catch (err) {
        console.error("[fetchData]", err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [sdk]
  );

  // Single effect drives ALL fetching
  useEffect(() => {
    fetchData(debouncedQuery, page);
  }, [debouncedQuery, page]);
}
```

---

## 6. Debounced Search

Reset `page` to `1` **inside** the debounce effect — never in a separate
effect. Use an `isFirstRender` ref to skip the debounce on mount so it
doesn't double-fetch on load:

```tsx
useEffect(() => {
  // Skip on first render — the fetch effect above handles initial load
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }

  const timer = setTimeout(() => {
    setPage(1);               // ← reset pagination for new search
    setDebouncedQuery(query); // ← triggers the fetch effect
  }, 500);

  return () => clearTimeout(timer);
}, [query]);
```

**Wire it to your input:**

```tsx
<input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Search images & videos..."
/>
```

**Show contextual loading states:**

```tsx
{loading && page === 1 && <p>Loading...</p>}
{loading && page > 1  && <p style={{ textAlign: "center" }}>Loading more...</p>}
```

---

## 7. Infinite Scroll

Attach `IntersectionObserver` **once** with empty deps `[]`. Read loading
state from `loadingRef` — never from the `loading` state variable — to avoid
stale closures inside the callback:

```tsx
const loadMoreRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!loadMoreRef.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      // loadingRef.current is always fresh — no stale closure
      if (entries[0].isIntersecting && !loadingRef.current) {
        setPage((prev) => prev + 1); // triggers fetchData via the fetch effect
      }
    },
    { rootMargin: "200px" } // trigger 200px before the sentinel is visible
  );

  observer.observe(loadMoreRef.current);
  return () => observer.disconnect();
}, []); // ← empty deps: attaches once, never re-registers
```

Place the sentinel div at the bottom of your list:

```tsx
<Grid items={images} renderItem={...} />
<div ref={loadMoreRef} style={{ height: 20 }} /> {/* ← scroll trigger */}
```

---

## 8. Event Tracking

`MediaSDK` ships a pub/sub emitter with `view` and `download` event types.
A default console logger is registered automatically in the constructor —
no setup needed for basic logging.

**Emit events from the app** — never from inside `media-ui-react` components:

```tsx
// Call when the user opens a photo in the Lightbox
const handleOpenLightbox = (index: number) => {
  setSelectedIndex(index);
  sdk.trackView(images[index]); // → logs [MEDIA VIEW] { id, ... }
};

// Call when the user downloads — pass as onDownload prop to Lightbox
const handleDownload = (item: any) => {
  sdk.trackDownload(item); // → logs [MEDIA DOWNLOAD] { id, ... }
};
```

**Add custom subscribers** (analytics, metrics, etc.):

```tsx
useEffect(() => {
  const onView = (payload: unknown) => {
    myAnalytics.track("photo_viewed", payload);
  };

  sdk.events.on("view", onView);
  return () => sdk.events.off("view", onView); // always clean up on unmount
}, [sdk]);
```

---

## 9. Caching

`MediaSDK` caches `search()` and `curated()` results automatically in memory,
keyed by `query:page:perPage`. Identical calls skip the network entirely.

No configuration needed — caching is active from the first call.

---

## 10. Common Mistakes

| ❌ Mistake | ✅ Fix |
|---|---|
| `useMedia()` called outside `MediaProvider` | Wrap the component tree with `<MediaProvider>` in `main.tsx` |
| API key hardcoded in source | Read from `import.meta.env.VITE_PEXELS_API_KEY` |
| `import.meta.env` used inside `media-core` | Env vars belong in the app layer only — never in the SDK |
| `VITE_PEXELS_API_KEY` missing on Vercel | Add it under Project → Settings → Environment Variables |
| Separate `loadData` and `searchData` functions | Use one unified `fetchData(query, page)` function |
| `loading` state used inside IntersectionObserver | Use `loadingRef` — state causes stale closure bugs |
| Observer re-attached on every render | Pass `[]` as deps — attach once only |
| Page reset in a separate `useEffect` | Reset page inside the debounce effect itself |
| Double fetch on mount | Guard with `isFirstRender` ref to skip debounce on first render |
| `sdk.trackView()` called inside Lightbox | Call it in `handleOpenLightbox` in `App.tsx` — UI components are SDK-unaware |
| `sdk.trackDownload()` called inside Lightbox | Pass `handleDownload` as the `onDownload` prop to `<Lightbox>` |
| `video.videoUrl` passed raw | Always sanitise: `v.videoUrl?.replace(/[[\]]/g, "")` |