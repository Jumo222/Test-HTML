# Repository Guidelines

## Project Structure & Module Organization
- root: Static pages (`index.html`, `about.html`) and global styles (`styles.css`).
- `src/`: TypeScript source (entry: `src/script.ts`).
- `dist/`: Compiled JS + source maps (`dist/script.js`).
- Config: `tsconfig.json`, `package.json`. Do not edit files in `dist/` directly.

## Build, Test, and Development Commands
- `npm install`: Install TypeScript and project deps.
- `npm run dev`: Compile TypeScript in watch mode to `dist/`.
- `npm run build`: One-time TypeScript build to `dist/`.
- Local preview: `python3 -m http.server 8080` then open `http://localhost:8080/index.html` (or use `npx serve .`).

## Coding Style & Naming Conventions
- Language: TypeScript in `src/` with strict mode enabled (see `tsconfig.json`).
- Indentation: 2 spaces; keep lines readable (<100 chars when practical).
- Filenames: lowercase (`script.ts`, `styles.css`, `index.html`).
- Symbols: `camelCase` for variables/functions, `PascalCase` for classes/types, `UPPER_SNAKE_CASE` for constants.
- Do not commit compiled files under `dist/` with manual edits.

## Testing Guidelines
- Current: No test framework configured (`npm test` is a placeholder).
- If adding tests, prefer Vitest or Jest with TypeScript.
- Location/Naming: `tests/**/*.spec.ts` (or colocate as `src/**/*.spec.ts`).
- Coverage: Aim for meaningful unit coverage of DOM-interaction helpers; exclude pure HTML/CSS.

## Commit & Pull Request Guidelines
- Commits: Use clear, imperative subjects (e.g., "feat: add hover effect", "fix: correct counter color").
- Scope small, focused changes; reference issues with `#id` where applicable.
- PRs: Include a concise description, before/after screenshots for UI changes, steps to verify (add beginner-friendly DevTools steps where useful), and any risk notes.
- CI: Ensure `npm run build` succeeds before requesting review.

## Security & Configuration Tips
- This is a static site—avoid embedding secrets in code or HTML.
- If introducing runtime config, load from environment at build time and document in `README`.
- Keep third-party scripts minimal and pinned to specific versions.

## Architecture Overview
- Simple static front end. TypeScript in `src/` manipulates the DOM and compiles to `dist/`, which pages reference via `<script src="dist/script.js"></script>`.

## Learning Context & Guidance
- Audience: The project exists for learning; assume contributors may be new to web dev.
- Explanations: Prefer clarity over cleverness. Briefly explain "what/why" in PR descriptions.
- DevTools: When relevant, include steps to observe changes in Chrome DevTools (e.g., Elements > select button > check event listeners; Console to see logs from `dist/script.js`).
- References: Link to MDN for APIs used (e.g., `addEventListener`, DOM manipulation, CSS selectors).
- Examples: Add small runnable snippets or screenshots that demonstrate the behavior you changed.
