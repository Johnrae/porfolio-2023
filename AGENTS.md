# AGENTS.md - Portfolio Project

## Project Overview

Next.js 16 (Pages Router) portfolio site with React 19, React Three Fiber (3D), Web Audio API synth, and Tailwind CSS v4. Package manager is pnpm wrapped by Vite+.

## Build / Dev / Lint / Test Commands

```bash
# Install dependencies (always run first after pulling changes)
vp install

# Development server (Next.js with webpack)
vp run dev

# Production build
vp run build

# Full check (format + lint + type-check)
vp check

# Auto-fix formatting and lint issues
vp check --fix

# Format only (Oxfmt)
vp fmt --check "./src/**/*.{ts,tsx,md}"

# Lint only
vp lint

# Run all tests (Vitest, via Vite+)
vp test

# Run a single test file
vp test src/path/to/file.test.ts

# Run tests matching a name pattern
vp test -t "pattern"
```

**Important:** `vp dev` and `vp build` invoke Vite's built-in server, not the Next.js dev/build scripts. This project uses Next.js, so always use `vp run dev` and `vp run build` to run the package.json scripts.

## Tech Stack

- **Framework:** Next.js 16 (Pages Router, NOT App Router) with webpack
- **React:** v19
- **3D:** React Three Fiber v9, drei v10, react-spring/three v10, Three.js v0.183
- **Audio:** Web Audio API + tunajs effects
- **Styling:** Tailwind CSS v4 (CSS-first, `@import 'tailwindcss'`, no config file)
- **Toolchain:** Vite+ (`vp` CLI) wrapping Oxfmt, Oxlint, Vitest
- **Package manager:** pnpm 10.7.0 (always use `vp` wrapper, never `pnpm` directly)

## Code Style Guidelines

### Formatting (enforced by Oxfmt via `vp fmt`)

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`), including JSX (`jsxSingleQuote: true`)
- 2-space indentation, no tabs
- 120 character line width
- Trailing commas everywhere (`trailingComma: 'all'`)
- Bracket spacing enabled, closing bracket on same line as last prop (`bracketSameLine: true`)
- Always use parentheses around arrow function params (`arrowParens: 'always'`)

### Imports

- Use the `@/*` path alias for all cross-directory imports (maps to `src/*`)
- Order: (1) third-party libraries, (2) local `@/` imports, (3) side-effect imports (CSS)
- Use `import type` for type-only imports: `import type { AppProps } from 'next/app'`
- No barrel exports (`index.ts` re-export files) -- import from specific files directly

### Components

- Always use **`export default function ComponentName()`** declarations (not arrow functions)
- Props interfaces use `interface {ComponentName}Props` and are declared directly above the component
- For trivial single-prop components, inline destructured types are acceptable: `{ title = 'default' }: { title?: string }`
- Use `[key: string]: unknown` index signature + spread for pass-through props
- Heavy components (Three.js, audio) should use `next/dynamic` for code-splitting with appropriate `ssr` settings

### Hooks

- Use **named exports** for hooks (not default exports): `export function useMyHook()` or `export const useMyHook = ...`
- File naming: `use{Name}.ts` in `src/hooks/`
- Hooks that set up side effects should return a cleanup function

### Naming Conventions

| Category               | Convention                  | Example                          |
| ---------------------- | --------------------------- | -------------------------------- |
| Component files        | PascalCase                  | `Blob.tsx`, `Layout.tsx`         |
| Hook files             | camelCase with `use` prefix | `useAudio.ts`                    |
| Page files             | lowercase                   | `index.tsx`, `_app.tsx`          |
| Directories            | lowercase                   | `components`, `canvas`, `dom`    |
| Module-level constants | UPPER_SNAKE_CASE            | `BASE_SCALE`, `MAX_DISTORTION`   |
| Variables / functions  | camelCase                   | `currentNote`, `noteToFrequency` |
| Refs                   | `{name}Ref` suffix          | `meshRef`, `cleanupRef`          |
| Boolean state          | `is` prefix                 | `isMouseDown`, `isComplete`      |
| Event handlers         | `handle{Event}`             | `handleStart`, `handleKeyDown`   |
| Props interfaces       | `{Component}Props`          | `LayoutProps`, `SceneProps`      |

### Types

- Prefer `interface` over `type` for object shapes
- Use `type` only for utility type extraction (e.g., `type X = NonNullable<...>`)
- Co-locate interfaces with their component (no separate shared type files)
- Use explicit generic parameters on `useRef`: `useRef<Mesh>(null)`, `useRef<HTMLDivElement>(null)`
- Use type assertions sparingly and only where inference falls short

### Utility Functions

- Module-scope helper functions use **arrow function `const` assignments** (distinct from components which use `function` declarations)
- Constants are defined at module scope in the file that uses them, not in separate constants files

### Error Handling

- Use guard clauses with early returns for null/undefined checks: `if (!ref.current) return`
- Error pages (`404.tsx`, `500.tsx`) are simple static pages

### Styling

- Tailwind CSS v4 utility classes only -- no CSS modules, styled-components, or inline styles
- All classes are string literals in `className` attributes
- Global resets go in `src/styles/index.css` under `@layer base`

## Project Structure

```
src/
  components/
    canvas/       # Three.js / React Three Fiber components (WebGL)
    dom/          # Standard DOM React components
  hooks/          # Custom React hooks (named exports)
  pages/          # Next.js pages (Pages Router)
  styles/         # Global CSS (Tailwind v4)
  config.tsx      # <Head> metadata / SEO config
  index.d.ts      # Module declarations (.vert, .frag shaders)
```

Components are split into `canvas/` (WebGL/Three.js context) vs `dom/` (HTML DOM context). This separation matters for React Three Fiber's rendering model.

## Testing Conventions

No tests exist yet. When adding tests:

- Import test utilities from `vite-plus/test` (NOT from `vitest` directly): `import { expect, test, vi, describe } from 'vite-plus/test'`
- Do NOT install `vitest` as a dependency -- it's bundled in Vite+
- Place test files alongside source: `Component.test.tsx` next to `Component.tsx`
- Run a single test: `vp test src/components/dom/Synth.test.tsx`

## Pre-commit Hooks

The `.vite-hooks/pre-commit` hook runs `vp staged`, which triggers `vp check --fix` on all staged files (configured in `vite.config.ts`). Commits will fail if formatting or lint errors cannot be auto-fixed.

## Agent Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started
- [ ] Run `vp check` and `vp test` to validate changes before committing
- [ ] Use `vp run dev` (not `vp dev`) to start the Next.js development server
- [ ] Use `vp run build` (not `vp build`) to create a production build
- [ ] Never use `pnpm`, `npm`, or `yarn` directly -- always use `vp`
- [ ] Never install `vitest`, `oxlint`, or `oxfmt` directly -- they're bundled in Vite+

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
