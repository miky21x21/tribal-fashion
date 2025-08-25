# AGENTS.md

## Commands

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Tests
No test framework configured yet.

### Dev Server
```bash
npm run dev
```

## Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4, PostCSS, Autoprefixer
- **Animation**: Framer Motion
- **Linting**: ESLint with Next.js config

## Architecture
- App Router structure in `src/app/`
- Server components by default, client components only for interactivity
- Path alias `@/*` maps to `src/*`
- Product data in `src/data/products.ts`
- UI components in `src/components/`

## Code Style
- TypeScript strict mode enabled
- Server components default, "use client" only when needed
- PascalCase for components, camelCase for variables
- Tailwind utility-first styling with custom theme tokens