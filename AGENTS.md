# Repository Guidelines

## Project Structure & Module Organization

This repository is a pnpm workspace for the `valaxy-theme-silence` Vue 3 theme.

- `theme/` contains the published theme source. Components use the `Silence` prefix, layouts live in `theme/layouts/`, public types in `theme/types/`, shared logic in `theme/utils/` and `theme/composables/`, and global styles in `theme/styles/`.
- `demo/` is the development and regression site. Its Markdown content is under `demo/pages/`, configuration is in `demo/*.config.ts`, and static assets belong in `demo/public/`.
- `.github/workflows/` contains build, deployment, and release automation.
- `.valaxy/`, `demo/dist/`, and `node_modules/` are generated and must not be edited or committed.

## Build, Test, and Development Commands

Use pnpm 10.18.2 from the repository root:

- `pnpm install` installs all workspace dependencies.
- `pnpm dev` starts the demo development server.
- `pnpm lint` runs ESLint with the Antfu configuration.
- `pnpm typecheck` runs strict Vue and TypeScript checks.
- `pnpm build` performs the demo SSG build and generates RSS feeds.

There is currently no maintained automated test suite. For UI changes, manually check the home, post, archive, category, tag, search, and 404 pages in desktop/mobile and light/dark modes.

## Coding Style & Naming Conventions

Use TypeScript and Vue 3 `<script setup lang="ts">`. Follow existing formatting: two-space indentation, single quotes, no semicolons, and ESLint-managed import ordering. Name theme components `Silence*.vue`. Keep route helpers in `theme/utils/route.ts` and pagination logic in `theme/utils/pagination.ts`. Access browser APIs only in client-safe code. New public theme options require matching types, defaults, demo configuration, and documentation.

## Testing Guidelines

Run `pnpm lint` and `pnpm typecheck` for Vue or TypeScript changes; also run `pnpm build` for layouts, routes, configuration, styles, plugins, or dependencies. Report the exact commands run and any known warnings. Do not describe a successful build as a test-suite pass.

## Commit & Pull Request Guidelines

History follows Conventional Commit-style prefixes such as `feat:`, `fix:`, and `chore:`. Keep commits focused and use an imperative summary, for example `fix: handle empty pagination results`. Pull requests should explain behavior changes, list validation commands, link relevant issues, and include screenshots for visual changes. Exclude generated files and unrelated lockfile updates.
