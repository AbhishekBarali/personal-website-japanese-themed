# Project Guidelines

## Overview

Japanese-themed personal portfolio — single-page React app with a bento-grid layout, physics-based canvas animations, and draggable UI elements. Dark aesthetic (`#08070e` base).

## Architecture

- **Single-page, no router.** All content lives in `src/App.tsx` (~600 lines) — layout, data, modals, and state.
- **Portfolio data** is a static `const portfolioData` object at the top of `App.tsx` — no API, no CMS.
- **State** is minimal: single `useState<string | null>` for the active modal. No context providers or state libraries.
- **Components:** `InteractiveBackground` (canvas silk ribbon), `PortfolioEyes` (mouse-tracking eyes), plus inline components (`Modal`, `DraggableBox`, `ScrollArrows`) defined in `App.tsx`.
- **`src/components/ui/`** is an empty placeholder for future shadcn/ui components.
- **`generate_bg.ts`** is a standalone Node script (runs via `tsx`) that calls Gemini image generation → `public/bg.png`. Not part of the app bundle.

## Code Style

- React 19, TypeScript (ES2022 target, `bundler` module resolution)
- Functional components only; named exports from component files, default export from `App.tsx`
- Props typed with inline interfaces
- Import motion as `import { motion, AnimatePresence } from 'motion/react'` (Framer Motion v12 path — NOT `framer-motion`)
- Path alias: `@` → workspace root (configured in both `vite.config.ts` and `tsconfig.json`)

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- Theme tokens defined in `src/index.css` inside an `@theme` block (fonts: Space Grotesk, JetBrains Mono)
- Custom easing CSS variables in `index.css`: `--ease-out-quart`, `--ease-out-quint`, `--ease-out-expo`
- Arbitrary Tailwind values used heavily: `bg-[#050505]/60`, `auto-rows-[190px]`, etc.
- `prefers-reduced-motion` media query kills all animations

## Animations

- Framer Motion v12 (`motion` package) for layout animations, drag, and `AnimatePresence`
- Shared easing constant: `const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const`
- Staggered entry pattern: parent `variants` with `staggerChildren: 0.08`, children use `itemVariants` (fade-up)
- Canvas API for the silk ribbon effect (`InteractiveBackground.tsx`)

## Build and Test

```bash
npm run dev       # vite --port=3000 --host=0.0.0.0
npm run build     # vite build
npm run preview   # vite preview
npm run clean     # rm -rf dist
npm run lint      # tsc --noEmit (type-check only, no ESLint)
```

No testing framework is configured.

## Conventions

- Icons from `lucide-react` — do not introduce other icon libraries
- Grid layout uses CSS Grid with `grid-cols-1 md:grid-cols-4`, `auto-rows-[190px]`, `grid-flow-dense`
- `useRef` for DOM interaction (canvas, scroll containers); `useCallback` + `useEffect` for event listeners with cleanup
- HMR can be disabled via `process.env.DISABLE_HMR` (Google AI Studio compatibility)
