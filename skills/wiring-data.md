# SKILL: Wiring Data with media-react

Use this skill when building any UI that needs to fetch photos or videos from
the Pexels API using the `media-react` package. It covers provider setup,
authentication, hook usage, and event tracking.

---

## 1. Provider Setup

Wrap your entire app (or subtree) with `MediaProvider`. Pass your Pexels API
key as the `apiKey` prop. On Vite projects, read it from `import.meta.env`:

```tsx
// main.tsx
import { MediaProvider } from "media-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
    <App />
  </MediaProvider>
);
```

**Rules:**
- `MediaProvider` must be an ancestor of any component that calls `useMedia()`
- Never pass the API key as a hardcoded string — always use an env variable
- One provider is enough for the whole app; do not nest them

---

## 2. Accessing the SDK — `useMedia()`

```tsx
import { useMedia } from "media-react";

function MyComponent() {
  const sdk = useMedia();
  // sdk is a MediaSDK instance
}
```

`useMedia()` throws if called outside `MediaProvider`. No null-checking needed.

---

## 3. Fetching Photos

```tsx
// Curated/trending photos
const result = await sdk.curated(page, perPage);
const photos = result?.photos ?? [];

// Search photos
const result = await sdk.search("mountains", page, perPage);
const photos = result?.photos ?? [];

// Single photo
const photo = await sdk.getPhoto(id);
```

Default `page = 1`, default `perPage = 20`.

Photo shape (key fields):
```ts
{
  id: number;
  src: {
    tiny: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  photographer: string;
  alt: string;
}
```

---

## 4. Fetching Videos

```tsx
// Popular videos
const result = await sdk.videos.popular(page, perPage);
const videos = result?.videos ?? [];

// Search videos
const result = await sdk.videos.search("ocean", page, perPage);
const videos = result?.videos ?? [];
```

Default `page = 1`, default `perPage = 10`.

Video shape (key fields):
```ts
{
  id: number;
  type: "video";
  url: string;
  thumbnailUrl: string; // mapped from v.image
  videoUrl: string;     // mapped from v.video_files[0].link
  width: number;
  height: number;
  duration: number;
}
```

---

## 5. Pagination + Infinite Scroll Pattern

```tsx
const [page, setPage] = useState(1);
const [items, setItems] = useState<any[]>([]);
const loadingRef = useRef(false);
const sentinelRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        setPage((p) => p + 1);
      }
    },
    { rootMargin: "200px" }
  );
  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, []); // attach once — use ref for loading state, not state

// Fetch whenever page changes
useEffect(() => {
  async function load() {
    loadingRef.current = true;
    const res = await sdk.curated(page);
    setItems((prev) => page === 1 ? res.photos : [...prev, ...res.photos]);
    loadingRef.current = false;
  }
  load();
}, [page]);
```

---

## 6. Debounced Search Pattern

```tsx
const [query, setQuery] = useState("");
const [debouncedQuery, setDebouncedQuery] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setPage(1);           // reset to page 1 on new search
    setDebouncedQuery(query);
  }, 500);
  return () => clearTimeout(timer);
}, [query]);

useEffect(() => {
  if (!debouncedQuery.trim()) {
    // load curated when search is empty
  } else {
    // load search results
  }
}, [debouncedQuery, page]);
```

---

## 7. Event Tracking

`MediaSDK` emits `view` and `download` events. Call these explicitly in the app:

```tsx
// When user opens a photo (e.g. lightbox opens)
sdk.trackView(photo);

// When user downloads a photo
sdk.trackDownload(photo);
```

The default logger is registered automatically in `MediaSDK` — it prints to
console. To add custom tracking (analytics, etc.):

```tsx
useEffect(() => {
  sdk.events.on("view", (payload) => {
    // e.g. send to analytics
    console.log("viewed", payload);
  });
  return () => {
    sdk.events.off("view", yourListener);
  };
}, [sdk]);
```

---

## 8. Caching

Results from `search()` and `curated()` are cached in memory automatically by
`MediaSDK`. The same call with the same `query + page + perPage` will not hit
the network twice. No extra work needed in the app.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Calling `useMedia()` outside `MediaProvider` | Wrap the component tree with `<MediaProvider>` |
| Using `import.meta.env` inside `media-core` | Never — env vars belong only in the app layer |
| Re-attaching the IntersectionObserver on every render | Pass `[]` as deps; use a ref for loading state |
| Resetting page in a separate effect after query change | Reset page inside the debounce effect itself |
| Accessing `video.videoUrl` before checking it exists | Always use `?.` — `video.videoUrl?.replace(...)` |