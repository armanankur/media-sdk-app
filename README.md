# Media SDK — Take-Home Assignment

Senior React Developer · Headless Media SDK + Component Library

## Live URLs

| | URL |
|---|---|
| **Web App** | https://media-sdk-app-web-app.vercel.app |
| **GitHub Repo** | https://github.com/armanankur/media-sdk-app |

## Repo Structure

```
media-sdk-app/
├── apps/
│   └── web-app/          # React + Vite app — wires data + UI together
├── packages/
│   ├── media-core/       # Framework-agnostic SDK (TypeScript only)
│   ├── media-react/      # React wrapper around media-core
│   └── media-ui-react/   # Headless UI component library (React)
├── skills/
│   ├── wiring-data.md    # SKILL.md — hooks, provider, auth, events
│   └── using-components.md # SKILL.md — prop-getters, styling, a11y
└── README.md
```

## Architecture

Dependency direction is strictly enforced:

```
app → media-react → media-core
app → media-ui-react

media-ui-react does NOT import media-core or media-react
media-react does NOT import media-ui-react
media-core has zero UI/React imports
```

## Package Overview

### `media-core` — Framework-agnostic SDK

- `PexelsClient` — typed API client: search, curated, single photo, videos popular/search, pagination
- `MediaSDK` — top-level class that wires client + cache + events; exposes `search()`, `curated()`, `videos.search()`, `videos.popular()`, `trackView()`, `trackDownload()`
- `MemoryCache` — simple in-memory cache keyed by request params; used inside `MediaSDK` for search and curated results
- `MediaEventEmitter` — pub/sub emitter for `view` and `download` events with `on()`, `off()`, `emit()`
- `createDefaultLogger` — default listener that logs all events to console; called automatically in `MediaSDK` constructor

### `media-react` — React Wrapper

- `MediaProvider` — initialises `MediaSDK` with API key, exposes via context
- `useMedia()` — hook to access the SDK instance anywhere in the tree

No business logic lives here — it only adapts `media-core` to React idioms.

### `media-ui-react` — Headless UI Components

- `Grid` — renders items in a responsive grid with load-more pagination. Accepts `items` and `renderItem` — no opinions on markup or styles.
- `Lightbox` — full-screen overlay with prev/next navigation, close, and download. Portal-based, keyboard-friendly.
- `ReelSwiper` — vertical snap-scroll reel with active-item detection and autoplay for the active video.

Components are **independent of `media-core` and `media-react`** — they receive data and callbacks purely as props.

### `apps/web-app` — UI App

The only place that imports both `media-react` (for data) and `media-ui-react` (for display):

- Search bar with 500ms debounce
- Grid of photos with infinite scroll
- Lightbox on photo click (emits `view` event)
- Download button in Lightbox (emits `download` event)
- Reels section for video results

## Event System

```ts
// Events fire automatically via MediaSDK methods:
sdk.trackView(item);     // called on lightbox open
sdk.trackDownload(item); // called on download click

// Default logger (auto-registered in MediaSDK constructor):
// [MEDIA VIEW] { id: 123, ... }
// [MEDIA DOWNLOAD] { id: 123, ... }

// App can also subscribe independently:
sdk.events.on("view", (payload) => {
  // custom analytics, etc.
});
```

## Caching

`MediaSDK` caches search and curated results in memory keyed by `query:page:perPage`. Repeated calls with the same params skip the network entirely.

## AI Usage

This project was built with Claude (Anthropic) as the primary AI coding assistant.

| Area | AI-assisted | Hand-written |
|---|---|---|
| Monorepo setup, tsconfig, package.json | ✅ AI — debugging build errors | — |
| `PexelsClient` API methods | ✅ AI — initial structure | ✅ Bug fixes (URL doubling) |
| `MemoryCache` | ✅ AI | — |
| `MediaEventEmitter` | ✅ AI | — |
| `MediaSDK` wiring | ✅ AI | — |
| `MediaProvider` + `useMedia` | ✅ AI | — |
| `Grid` component | ✅ AI | — |
| `Lightbox` component | ✅ AI | — |
| `ReelSwiper` component | ✅ AI | — |
| `App.tsx` — infinite scroll, debounce logic | ✅ AI | ✅ State bug fixes |
| `skills/*.md` | ✅ AI-drafted | ✅ Hand-tested against actual build |
| Vercel deployment config | ✅ AI | — |

The two `SKILL.md` files in `/skills` were used to steer Claude while building `App.tsx` — specifically the provider setup, hook usage, and component wiring sections.

## What Was Scoped Out

| Item | Reason |
|---|---|
| `media-native` (React Native wrapper) | Out of scope for web-only assignment window |
| `media-ui-native` | Same — no RN environment available |
| SDK docs site | Not built; README covers the API surface |
| Components docs site | Not built; inline JSDoc covers props |
| Keyboard trap in Lightbox | Partial — Escape key not yet wired |

## Local Development

```bash
# Install all workspace deps from root
npm install

# Build all packages in order
npm run build

# Run the web app
cd apps/web-app && npm run dev
```

Add a `.env` file in `apps/web-app/`:

```
VITE_PEXELS_API_KEY=your_key_here
```