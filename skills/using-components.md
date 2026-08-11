# Using `media-ui-react` Components

> **When to use this skill:** Any time you render a `Grid`, `Lightbox`, or
> `ReelSwiper` from `media-ui-react` — wiring props, applying styles, handling
> accessibility, or connecting SDK events to UI actions.

---

## Table of Contents

1. [The Headless Contract](#1-the-headless-contract)
2. [Grid](#2-grid)
3. [Lightbox](#3-lightbox)
4. [ReelSwiper](#4-reelswiper-reel)
5. [Full Wiring Example](#5-full-wiring-example)
6. [Common Mistakes](#6-common-mistakes)

---

## 1. The Headless Contract

`media-ui-react` ships **zero styles and zero SDK imports**. Every component:

- Handles **behaviour only** — pagination, navigation, keyboard events, scroll detection, video autoplay
- Accepts data and callbacks **purely as props** — no knowledge of Pexels or `media-core`
- Exposes **prop-getter functions** that return the correct event handlers and ARIA attributes
- Allows **full markup override** via `render*` props

```
media-ui-react ──────────────────────────────────────────────┐
│  Grid        → behaviour: pagination, load-more            │
│  Lightbox    → behaviour: navigation, keyboard, download   │
│  ReelSwiper  → behaviour: snap scroll, active-item detect  │
└────────────────────────────────────────────────────────────┘
        ▲ no imports from media-core or media-react
        ▲ you own all markup and CSS
```

**Always spread prop-getters** onto your elements — they carry ARIA attributes,
event handlers, and roles:

```tsx
// ✅ correct — a11y attributes included
<div {...getItemProps(index)} className="my-card">...</div>

// ❌ wrong — loses role, aria-*, and key
<div key={index} className="my-card">...</div>
```

---

## 2. Grid

A generic, paginated grid with a load-more control. No layout opinions.

### Basic Usage

```tsx
import { Grid } from "media-ui-react";

<Grid
  items={photos}
  renderItem={(photo, getItemProps) => (
    <div {...getItemProps()} className="photo-card">
      <img
        src={photo.src.medium}
        alt={photo.alt}
        onClick={() => handleOpenLightbox(photos.indexOf(photo))}
      />
    </div>
  )}
/>
```

### With Full Markup Control

```tsx
<Grid
  items={photos}
  pageSize={12}
  renderContainer={(props, children) => (
    <ul {...props} className="photo-grid">
      {children}
    </ul>
  )}
  renderItem={(photo, getItemProps) => (
    <li {...getItemProps()} className="photo-card">
      <img src={photo.src.medium} alt={photo.alt} onClick={...} />
    </li>
  )}
  renderLoadMore={(props) => (
    <button {...props} className="load-more-btn">
      Load More
    </button>
  )}
/>
```

### Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `items` | `T[]` | ✅ | — | Any array — fully generic |
| `renderItem` | `(item, getItemProps) => ReactNode` | ✅ | — | Render each visible item |
| `pageSize` | `number` | ❌ | `12` | Items shown per page |
| `renderContainer` | `(props, children) => ReactNode` | ❌ | `<div>` | Override the grid wrapper |
| `renderLoadMore` | `(props) => ReactNode` | ❌ | `<button>` | Override the load-more control |

### Prop Getters

| Getter | Returns |
|---|---|
| `getContainerProps()` | `role="list"` |
| `getItemProps(index)` | `role="listitem"`, `key` |
| `getLoadMoreProps()` | `onClick`, `aria-label="Load more items"`, `type="button"` |

### Styling Reference

```css
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
}

.photo-card img {
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
  display: block;
  transition: opacity 0.2s;
}

.photo-card img:hover { opacity: 0.85; }

.load-more-btn {
  display: block;
  margin: 32px auto 0;
  padding: 10px 28px;
  border-radius: 8px;
  cursor: pointer;
}
```

---

## 3. Lightbox

Full-screen image overlay with prev/next navigation, keyboard shortcuts,
portal rendering, and inline download. All six visual elements are
overridable via render props.

### ⚠️ Critical Rule

`Lightbox` ships **no styles** — without `renderOverlay`, it renders as
invisible unstyled elements. You **must** pass `renderOverlay` with at minimum
`position: fixed`, a background, and a `zIndex`.

### Usage

```tsx
import { Lightbox } from "media-ui-react";

const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

// Open lightbox — emit view event here, not inside the component
const handleOpenLightbox = (index: number) => {
  setSelectedIndex(index);
  sdk.trackView(images[index]);
};

// Download callback — emit download event here, not inside the component
const handleDownload = (item: any) => {
  sdk.trackDownload(item);
};

{selectedIndex !== null && (
  <Lightbox
    items={images.map((p) => ({ id: p.id, imageUrl: p.src?.large }))}
    selectedIndex={selectedIndex}
    isOpen={true}
    onClose={() => setSelectedIndex(null)}
    onDownload={handleDownload}

    // Required for visibility
    renderOverlay={(props, children) => (
      <div
        {...props}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
        }}
      >
        {children}
      </div>
    )}

    renderImage={(props, item) => (
      <img
        {...props}
        src={item.imageUrl}
        alt=""
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: 12,
        }}
      />
    )}

    renderPrevButton={(props) => (
      <button {...props} className="lb-btn lb-prev">◀</button>
    )}

    renderNextButton={(props) => (
      <button {...props} className="lb-btn lb-next">▶</button>
    )}

    renderCloseButton={(props) => (
      <button {...props} className="lb-btn lb-close">✕</button>
    )}

    renderDownloadButton={(props) => (
      <button {...props} className="lb-btn lb-download">Download</button>
    )}
  />
)}
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `{ id: number; imageUrl: string }[]` | ✅ | Map `photo.src.large` — not the full `src` object |
| `selectedIndex` | `number` | ✅ | Initially active item index |
| `isOpen` | `boolean` | ✅ | Controls visibility — render conditionally |
| `onClose` | `() => void` | ✅ | Called on backdrop click or close button |
| `onDownload` | `(item) => void` | ❌ | Called after blob download completes |
| `renderOverlay` | `(props, children) => ReactNode` | ❌ | Backdrop — must spread `{...props}` and render `{children}` |
| `renderImage` | `(props, item) => ReactNode` | ❌ | Image element |
| `renderPrevButton` | `(props) => ReactNode` | ❌ | Previous button |
| `renderNextButton` | `(props) => ReactNode` | ❌ | Next button |
| `renderCloseButton` | `(props) => ReactNode` | ❌ | Close button |
| `renderDownloadButton` | `(props) => ReactNode` | ❌ | Download button — blob fetch is handled internally |

### Prop Getters (from `useLightbox`)

| Getter | Returns |
|---|---|
| `getOverlayProps()` | `role="dialog"`, `aria-modal=true`, `aria-label`, `onClick` → close |
| `getImageProps()` | `role="img"`, `onClick` → stop propagation |
| `getPrevButtonProps()` | `onClick` → prev, `aria-label="Previous image"`, `type="button"` |
| `getNextButtonProps()` | `onClick` → next, `aria-label="Next image"`, `type="button"` |
| `getCloseButtonProps()` | `onClick` → close, `aria-label="Close lightbox"`, `type="button"` |
| `getDownloadButtonProps(cb, item)` | Handles blob fetch + save dialog + fires `cb(item)` |

### Keyboard Support

Built into `useLightbox` — no additional setup required:

| Key | Action |
|---|---|
| `Escape` | Close lightbox |
| `ArrowRight` | Next image |
| `ArrowLeft` | Previous image |

### Behaviour Notes

- Renders into `document.body` via `createPortal` — always above other content
- Prev/Next navigation wraps around (last → first, first → last)
- Download fetches the image as a Blob and triggers the browser's save dialog
- Event tracking (`trackView`, `trackDownload`) belongs in the **app**, not inside this component

### Button Positioning Reference

```css
.lb-btn {
  position: absolute;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.lb-btn:hover    { background: rgba(255, 255, 255, 0.25); }
.lb-prev         { left: 20px; top: 50%; transform: translateY(-50%); }
.lb-next         { right: 20px; top: 50%; transform: translateY(-50%); }
.lb-close        { top: 20px; right: 20px; }
.lb-download     { bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 14px; }
```

---

## 4. ReelSwiper (`Reel`)

Vertical snap-scroll video reel. One video per full viewport height.
The active video autoplays; all others are paused.

### Usage

```tsx
import { Reel } from "media-ui-react";

const reelItems = videos.map((v) => ({
  id: v.id,
  videoUrl: v.videoUrl?.replace(/[[\]]/g, ""), // sanitise before passing
}));

<Reel items={reelItems} />
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `items` | `{ id: number; videoUrl: string }[]` | ✅ | Video items. Always sanitise `videoUrl` first. |

### Behaviour

- Snap scrolls vertically — each item fills `100vh` (`scroll-snap-type: y mandatory`)
- Active index tracked via `scrollTop / window.innerHeight`
- Only the active video has `autoPlay` — others stop immediately on scroll
- All videos use `muted`, `loop`, `playsInline` — required for browser autoplay policy

### Container Requirements

The Reel is `height: 100vh`. Its parent must not clip or constrain it:

```tsx
// ✅ correct — parent doesn't constrain height
<section>
  <Reel items={reelItems} />
</section>

// ❌ wrong — fixed height and overflow clip the scroll
<div style={{ height: 400, overflow: "hidden" }}>
  <Reel items={reelItems} />
</div>
```

---

## 5. Full Wiring Example

The complete pattern — Grid + Lightbox + Reel with SDK events, headless
styling, and proper event placement:

```tsx
import { useMedia } from "media-react";
import { Grid, Lightbox, Reel } from "media-ui-react";

export default function App() {
  const sdk = useMedia();

  const [images, setImages]         = useState<any[]>([]);
  const [videos, setVideos]         = useState<any[]>([]);
  const [selectedIndex, setSelected] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([sdk.curated(), sdk.videos.popular()]).then(([p, v]) => {
      setImages(p?.photos ?? []);
      setVideos(v?.videos ?? []);
    });
  }, []);

  // ✅ trackView fired in the app — not inside the component
  const handleOpenLightbox = (index: number) => {
    setSelected(index);
    sdk.trackView(images[index]);
  };

  // ✅ trackDownload fired in the app — passed as onDownload callback
  const handleDownload = (item: any) => {
    sdk.trackDownload(item);
  };

  return (
    <div style={{ padding: 20 }}>

      {/* ── Grid ────────────────────────────────────── */}
      <Grid
        items={images}
        renderContainer={(props, children) => (
          <div {...props} className="photo-grid">{children}</div>
        )}
        renderItem={(photo: any, getItemProps) => (
          <div {...getItemProps()} className="photo-card">
            <img
              src={photo.src?.medium}
              alt={photo.alt}
              onClick={() => handleOpenLightbox(images.indexOf(photo))}
            />
          </div>
        )}
        renderLoadMore={(props) => (
          <button {...props} className="load-more-btn">Load More</button>
        )}
      />

      {/* ── Lightbox ─────────────────────────────────── */}
      {selectedIndex !== null && (
        <Lightbox
          items={images.map((p: any) => ({ id: p.id, imageUrl: p.src?.large }))}
          selectedIndex={selectedIndex}
          isOpen={true}
          onClose={() => setSelected(null)}
          onDownload={handleDownload}
          renderOverlay={(props, children) => (
            <div
              {...props}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 99999,
              }}
            >
              {children}
            </div>
          )}
          renderImage={(props, item) => (
            <img
              {...props}
              src={item.imageUrl}
              style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 12 }}
            />
          )}
          renderPrevButton={(props) => (
            <button {...props} className="lb-btn lb-prev">◀</button>
          )}
          renderNextButton={(props) => (
            <button {...props} className="lb-btn lb-next">▶</button>
          )}
          renderCloseButton={(props) => (
            <button {...props} className="lb-btn lb-close">✕</button>
          )}
          renderDownloadButton={(props) => (
            <button {...props} className="lb-btn lb-download">Download</button>
          )}
        />
      )}

      {/* ── Reels ────────────────────────────────────── */}
      <Reel
        items={videos.map((v: any) => ({
          id: v.id,
          videoUrl: v.videoUrl?.replace(/[[\]]/g, ""),
        }))}
      />

    </div>
  );
}
```

---

## 6. Common Mistakes

| ❌ Mistake | ✅ Fix |
|---|---|
| Lightbox opens but nothing is visible | Pass `renderOverlay` with `position: fixed`, a background colour, and `zIndex` |
| Passing `photo.src` directly to `imageUrl` | Map to a specific size string: `photo.src?.large` |
| Not spreading prop-getters | Always spread: `{...getItemProps()}`, `{...getOverlayProps()}` |
| Forgetting `{children}` inside `renderOverlay` | The overlay must render its children or nothing shows inside it |
| `sdk.trackView()` called inside Lightbox | Call it in `handleOpenLightbox` in the app — UI components don't import the SDK |
| `sdk.trackDownload()` called inside Lightbox | Pass `handleDownload` as the `onDownload` prop instead |
| Reel not snapping or scrolling | Parent element has `overflow: hidden` or a fixed height smaller than `100vh` |
| Videos not autoplaying in Reel | Browser requires `muted` for autoplay — it's set by the component, check your container isn't hiding the element |
| Grid items have no gap or layout | Grid ships no CSS — add your own grid layout to the container via `renderContainer` |
| Video playback fails with a URL error | Sanitise before passing: `v.videoUrl?.replace(/[[\]]/g, "")` |
| `onDownload` never fires | It's optional — no error if omitted. Confirm you actually passed the prop. |