<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` / `npm run build` — Turbopack is the default engine for both.
- `npm run lint` — runs bare `eslint`, which lints the whole repo (flat config in `eslint.config.mjs`).
- `npx tsc --noEmit` — typecheck; there is no `typecheck` npm script. No test framework is configured.
- Single focused check: `npx eslint src/app/page.tsx` or `npx tsc --noEmit` after changes; run `npm run build` as the final gate (it catches more than lint/tsc).

## Next.js 16 quirks (this repo enables them)

- `cacheComponents: true` in `next.config.ts`: dynamic data (cookies, db, external fetch) requires Suspense boundaries or `use cache`; pages making uncached dynamic reads without Suspense fail the build.
- `reactCompiler: true`: skip manual `useMemo`/`useCallback`/memoization — the compiler handles it. The `react-hooks` lint rules (e.g. `set-state-in-effect`) are strict here.
- Two pre-existing lint errors in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`) and a warning in `src/app/page.tsx` — not yours; don't build on top of unused vars in `page.tsx`.

## Styling & components

- Tailwind CSS v4 with no `tailwind.config.js` — theme tokens are CSS variables defined in `src/app/globals.css`; edit there, not in a config file.
- shadcn uses the `base-nova` style (`components.json`): primitives in `src/components/ui/` wrap `@base-ui/react/*`, not Radix. Add components with `npx shadcn@latest add <name>` rather than hand-writing them.
- `cn` is imported from the `cn` package (re-exported by `src/lib/utils.ts`), not a local clsx/tailwind-merge util.
- Path alias: `@/*` → `src/*`.
