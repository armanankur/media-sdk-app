# Media SDK — 

Senior React Developer · Headless Media SDK + Component Library

---

## Submission Links

| | URL |
|---|---|
| **Web App** | https://media-sdk-app-web-app.vercel.app |
| **SDK Documentation** | https://media-sdk-docs-ten.vercel.app |
| **Components Documentation** | https://media-sdk-components.vercel.app |
| **GitHub Repo** | https://github.com/armanankur/media-sdk-app |

---

## Repo Structure

```
media-sdk-app/
├── apps/
│   └── web-app/              # React + Vite app — wires data + UI together
├── packages/
│   ├── media-core/           # Framework-agnostic SDK (TypeScript only)
│   ├── media-react/          # React wrapper around media-core
│   └── media-ui-react/       # Headless UI component library (React)
├── docs/
│   ├── sdk/                  # SDK documentation site
│   │   └── index.html
│   └── components/           # Components documentation site
│       └── index.html
├── skills/
│   ├── wiring-data.md        # SKILL: hooks, provider, auth, events, pagination
│   └── using-components.md   # SKILL: prop-getters, render props, styling, a11y
├── README.md
└── package.json
```

---

## Architecture

Dependency direction is strictly enforced across all packages:

```
app → media-react  → media-core
app → media-ui-react

media-ui-react  ✗  does NOT import media-core or media-react
media-react     ✗  does NOT import media-ui-react
media-core      ✗  has zero React / DOM imports
```

This means:
- `media-core` is fully portable — could power a CLI, Node script, or any other UI framework with zero changes
- `media-ui-react` components are data-source agnostic — they accept anything via props and have no knowledge of Pexels or the SDK
- The app (`web-app`) is the only place that imports from both sides and wires them together

---

## Package Overview

### `media-core` — Framework-agnostic SDK

Pure TypeScript. No React, no DOM, no framework dependencies.

| Export | Description |
|---|---|
| `MediaSDK` | Top-level class. Wires client + cache + events. Entry point for all SDK usage. |
| `PexelsClient` | Typed API client — search, curated, single photo, video search, video popular, pagination |
| `MemoryCache` | Generic in-memory key-value cache. Used internally by `MediaSDK`. |
| `MediaEventEmitter` | Pub/sub emitter for `view` and `download` events — `on()`, `off()`, `emit()` |
| `createDefaultLogger` | Registers a console logger for all events. Called automatically in `MediaSDK` constructor. |

`MediaSDK` caches `search()` and `curated()` results automatically, keyed by `query:page:perPage`. Repeated identical calls skip the network.

### `media-react` — React Wrapper

Thin adapter — no business logic.

| Export | Description |
|---|---|
| `MediaProvider` | Initialises `MediaSDK` with an API key and exposes it via React context |
| `useMedia()` | Hook that returns the `MediaSDK` instance. Throws if used outside `MediaProvider`. |

### `media-ui-react` — Headless UI Component Library

Zero styles, zero SDK imports. Components handle behaviour only — you own all markup and CSS.

| Component | Behaviour |
|---|---|
| `Grid` | Paginated grid with load-more. Generic — works with any item shape. Exposes `renderItem`, `renderContainer`, `renderLoadMore`, and prop-getters for a11y. |
| `Lightbox` | Full-screen image overlay. Prev/next navigation, keyboard shortcuts (Escape, Arrow keys), portal rendering, inline blob download. All 6 elements overridable via render props. |
| `ReelSwiper` | Vertical snap-scroll video reel. Active-item detection via scroll position. Only the active video autoplays. |

Components receive data and callbacks purely as props — they have no knowledge of Pexels or `media-core`.

### `apps/web-app` — UI App

The only place that imports both `media-react` (data) and `media-ui-react` (display) and connects them:

- Search bar with 500ms debounce
- Photo grid with infinite scroll (IntersectionObserver)
- Lightbox on photo click → emits `view` event via `sdk.trackView()`
- Download button in Lightbox → emits `download` event via `sdk.trackDownload()`
- Reels section for video results

---

## Event System

```ts
// Emit events from the app layer — not inside UI components
sdk.trackView(photo);     // called when lightbox opens
sdk.trackDownload(photo); // called when user downloads

// Default logger fires automatically (no setup needed):
// [MEDIA VIEW]     { id: 123, src: {...}, photographer: "..." }
// [MEDIA DOWNLOAD] { id: 456, src: {...}, photographer: "..." }

// Subscribe independently for custom analytics:
sdk.events.on("view", (payload) => {
  myAnalytics.track("photo_viewed", payload);
});

// Always clean up subscriptions:
sdk.events.off("view", myListener);
```

---

## AI Skill Docs

Two `SKILL.md` documents in `/skills` teach an AI coding assistant how to
correctly consume this SDK when building UI. They were used to steer Claude
while building `App.tsx`.

| File | Covers |
|---|---|
| `skills/wiring-data.md` | Provider setup, `useMedia()`, fetching photos/videos, unified fetch pattern, debounced search, infinite scroll, event tracking, caching |
| `skills/using-components.md` | Headless contract, Grid prop-getters, Lightbox render props, ReelSwiper requirements, full wiring example, common mistakes |

---

## AI Usage

This project was built with **Claude (Anthropic)** as the primary AI coding assistant.

| Area | AI-assisted | Hand-written / Fixed |
|---|---|---|
| Monorepo setup, tsconfig, package.json | ✅ AI | ✅ Debugged TypeScript version conflicts (`^7.0.2` → `~6.0.2`) |
| `PexelsClient` API methods | ✅ AI — initial structure | ✅ Fixed doubled URL bug in `videosSearch` |
| `MemoryCache` | ✅ AI | — |
| `MediaEventEmitter` | ✅ AI | — |
| `MediaSDK` wiring | ✅ AI | ✅ Fixed wrong import paths (`./events/emitter` → `./emitter/emitter`) |
| `MediaProvider` + `useMedia` | ✅ AI | — |
| `Grid` component | ✅ AI | ✅ Refactored to headless prop-getter pattern |
| `Lightbox` component | ✅ AI | ✅ Refactored to render props; fixed invisible lightbox bug |
| `ReelSwiper` component | ✅ AI | — |
| `App.tsx` — fetch, debounce, infinite scroll | ✅ AI | ✅ Fixed stale closure bug, double fetch on mount, event wiring |
| `skills/*.md` | ✅ AI-drafted | ✅ Hand-tested against the actual build; updated after every bug found |
| SDK + Components docs sites | ✅ AI | — |
| Vercel deployment config | ✅ AI | ✅ Fixed root directory, output path, install command |

---

## What Was Scoped Out

| Item | Reason |
|---|---|
| `media-native` (React Native wrapper) | Out of scope — web-only assignment, no RN environment |
| `media-ui-native` | Same as above |
| Keyboard focus trap in Lightbox | Partial — Escape / Arrow keys work; full focus trap not implemented |
| Typed API responses | `any` used in several places; full Pexels response types not defined |

---

## Local Development

```bash
# 1. Install all workspace dependencies from repo root
npm install

# 2. Build all packages in dependency order
npm run build

# 3. Run the web app
cd apps/web-app && npm run dev
```

Create `apps/web-app/.env`:

```
VITE_PEXELS_API_KEY=your_pexels_api_key_here
```

Get a free API key at [pexels.com/api](https://www.pexels.com/api/).