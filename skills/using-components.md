# SKILL: Using media-ui-react Components

Use this skill when wiring `media-ui-react` components into any React app.
It covers the Grid, Lightbox, and ReelSwiper — their props, styling contract,
accessibility, and correct usage patterns.

---

## Key Rule: Components Are Headless

`media-ui-react` components ship **zero styles**. They handle behaviour and
structure only. You supply all CSS — either inline styles, CSS modules, Tailwind,
or any other approach. Never expect built-in visual polish.

---

## 1. Grid

Renders a list of items in a grid with built-in load-more pagination.

```tsx
import { Grid } from "media-ui-react";

<Grid
  items={photos}
  renderItem={(photo) => (
    <img
      src={photo.src.medium}
      alt={photo.alt}
      onClick={() => openLightbox(photo)}
      style={{ width: "100%", borderRadius: 8, cursor: "pointer" }}
    />
  )}
/>
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `T[]` | ✅ | Array of any item type |
| `renderItem` | `(item: T) => ReactNode` | ✅ | Render function — you control the markup |

### Behaviour
- Shows items in pages of 12 by default
- Renders a "Load More" button when more items exist
- `renderItem` is called for each visible item — generic, works with any data shape

### Styling the grid layout
The Grid renders a wrapping `<div>` — style it via `renderItem`'s container or
wrap `<Grid>` in your own div:

```tsx
<div className="my-grid-wrapper">
  <Grid items={items} renderItem={...} />
</div>
```

```css
.my-grid-wrapper > div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```

---

## 2. Lightbox

Full-screen overlay for viewing a list of images with prev/next navigation
and an optional download action.

```tsx
import { Lightbox } from "media-ui-react";

const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

// Open
<img onClick={() => setSelectedIndex(index)} ... />

// Lightbox
{selectedIndex !== null && (
  <Lightbox
    items={photos.map((p) => ({ id: p.id, imageUrl: p.src.large }))}
    selectedIndex={selectedIndex}
    isOpen={true}
    onClose={() => setSelectedIndex(null)}
    onDownload={(item) => sdk.trackDownload(item)}
  />
)}
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `{ id: number; imageUrl: string }[]` | ✅ | Flat array of lightbox items |
| `selectedIndex` | `number` | ✅ | Index of the initially selected item |
| `isOpen` | `boolean` | ✅ | Controls visibility |
| `onClose` | `() => void` | ✅ | Called when overlay or close button is clicked |
| `onDownload` | `(item) => void` | ❌ | Called after download completes |

### Behaviour
- Renders via `createPortal` into `document.body` — always on top
- Prev/Next buttons cycle through `items`
- Download fetches the image as a blob and triggers browser download
- Clicking the backdrop closes the lightbox

### Accessibility
- Add `aria-label` to your open trigger: `<button aria-label="View photo">`
- Lightbox backdrop has `onClick={onClose}` — keyboard users need an explicit close button (already included as ✕)
- For full keyboard trap support, add `onKeyDown` to the portal div:

```tsx
// Extend Lightbox usage with keyboard support in the app:
useEffect(() => {
  if (selectedIndex === null) return;
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedIndex(null);
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [selectedIndex]);
```

---

## 3. ReelSwiper (Reel)

Vertical snap-scroll video reel. Each item takes full viewport height.
The active video autoplays; others are paused.

```tsx
import { Reel } from "media-ui-react";

const reelItems = videos.map((v) => ({
  id: v.id,
  videoUrl: v.videoUrl,
}));

<Reel items={reelItems} />
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `{ id: number; videoUrl: string }[]` | ✅ | Video items to display |

### Behaviour
- Each item snaps to full viewport height on scroll (`scroll-snap-type: y mandatory`)
- Active index is tracked via scroll position
- Only the active item has `autoPlay` — others are paused
- Videos are `muted`, `loop`, `playsInline` by default (required for autoplay in browsers)

### Styling
Reel takes `height: 100vh` — make sure its parent doesn't constrain height:

```tsx
// ✅ correct
<section style={{ height: "100vh", overflow: "hidden" }}>
  <Reel items={reelItems} />
</section>

// ❌ wrong — parent clips the scroll
<div style={{ height: 400, overflow: "hidden" }}>
  <Reel items={reelItems} />
</div>
```

### Video URL Gotcha
Pexels video URLs sometimes contain encoded brackets. Clean them before passing:

```ts
videoUrl: v.videoUrl?.replace(/[[\]]/g, "")
```

---

## 4. Wiring Data + Components Together (Full Pattern)

```tsx
import { useMedia } from "media-react";
import { Grid, Lightbox, Reel } from "media-ui-react";

export default function App() {
  const sdk = useMedia();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    sdk.curated().then((r) => setPhotos(r?.photos ?? []));
    sdk.videos.popular().then((r) => setVideos(r?.videos ?? []));
  }, []);

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
    sdk.trackView(photos[index]); // emit view event
  };

  const handleDownload = (item: any) => {
    sdk.trackDownload(item); // emit download event
  };

  return (
    <>
      <Grid
        items={photos}
        renderItem={(photo: any) => (
          <img
            src={photo.src.medium}
            onClick={() => handleOpen(photos.indexOf(photo))}
            style={{ width: "100%", cursor: "pointer" }}
          />
        )}
      />

      {selectedIndex !== null && (
        <Lightbox
          items={photos.map((p: any) => ({ id: p.id, imageUrl: p.src.large }))}
          selectedIndex={selectedIndex}
          isOpen={true}
          onClose={() => setSelectedIndex(null)}
          onDownload={handleDownload}
        />
      )}

      <Reel
        items={videos.map((v: any) => ({
          id: v.id,
          videoUrl: v.videoUrl?.replace(/[[\]]/g, ""),
        }))}
      />
    </>
  );
}
```

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Passing `src` object directly to Lightbox `imageUrl` | Map to a specific size: `photo.src.large` |
| Reel not scrolling | Parent has `overflow: hidden` or fixed height less than `100vh` |
| Video not autoplaying | Missing `muted` — browsers block unmuted autoplay |
| Lightbox not closing on Escape | Add `keydown` listener in the app (see Accessibility section) |
| Grid items have no spacing | Grid is unstyled — add your own `gap` via wrapper CSS |
| `onDownload` not firing | Check that you passed the prop; it's optional so no error if missing |