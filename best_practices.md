# 📘 Project Best Practices

## 1. Project Purpose
A Next.js 15 (App Router) + React 19 TypeScript project for an e-commerce storefront showcasing Jharkhand’s tribal fashion and handcrafted products. The site includes a landing page with hero and featured products, product listing (Shop), and informational pages (About, Contact). Styling is done with Tailwind CSS, and animations use Framer Motion.

## 2. Project Structure
- Root
  - `next.config.ts`: Next.js configuration
  - `tsconfig.json`: TypeScript config with path alias `@/*`
  - `tailwind.config.ts`: Tailwind theme, colors, fonts, and background images
  - `eslint.config.mjs`: Flat ESLint config extending Next + TS
  - `postcss.config.js` / `postcss.config.mjs`: PostCSS config (consolidate to one; see Do’s/Don’ts)
  - `README.md`: Bootstrapped instructions from create-next-app
- `src/`
  - `app/`: App Router entrypoint
    - `layout.tsx`: Global layout, metadata, fonts, Navbar, footer
    - `globals.css`: Global styles (Tailwind imports expected)
    - `page.tsx`: Home page
    - `about/page.tsx`, `contact/page.tsx`, `shop/page.tsx`: Route pages
  - `components/`: Reusable UI (Client Components)
    - `Navbar.tsx`, `Hero.tsx`, `FeaturedProductsCarousel.tsx`
  - `data/`
    - `products.ts`: Typed product seed data
- `public/`
  - `images/products/*`: Product images referenced by Next Image
  - Fonts, logos, SVGs

Conventions
- App Router with server components by default; client-only where hooks/DOM APIs are used.
- Absolute imports via `@/*` path alias.
- Design tokens via Tailwind theme extensions (colors, backgrounds, fonts).

## 3. Test Strategy
Current state: No tests.

Recommended stack
- Unit tests: Vitest or Jest + `@testing-library/react`
- Component/integration tests: `@testing-library/react` with Next.js test utils; consider Playwright for E2E later
- Mocking: Use `msw` for network mocking when adding data fetching; prefer dependency injection for pure units

Organization & conventions
- Co-locate tests next to source: `ComponentName.test.tsx` or `__tests__/ComponentName.test.tsx`
- Name tests `*.test.ts`/`*.test.tsx`; use TypeScript in tests
- Aim for 70–80% coverage with meaningful assertions (don’t chase 100%)

Philosophy
- Unit tests for pure logic (helpers, data transforms)
- Integration tests for component behavior, routing, and user flows
- Snapshot tests sparingly; prefer queries and user-event interactions

## 4. Code Style
TypeScript
- `strict: true` is enabled; define explicit prop types/interfaces
- Prefer type inference; avoid `any`
- Avoid `React.FC` for component typing; type props explicitly

React/Next.js
- Server Components by default; add "use client" only where necessary (state, effects, DOM APIs, framer-motion)
- Use `next/link` for navigation and `next/image` for optimized images
- Memoize expensive child components with `memo` and stable callbacks (`useCallback`) as needed
- Accessibility: add `aria-*` attributes to interactive elements and maintain keyboard support

Naming & structure
- Components: PascalCase file and component names (e.g., `FeaturedProductsCarousel.tsx`)
- Pages: `app/<route>/page.tsx` with default exports
- Variables/functions: `camelCase`; types/interfaces: `PascalCase`
- Keep components focused; extract reusable UI into `src/components`

Styling
- Tailwind for utility-first styling; consolidate and reuse via custom classes if repeated patterns emerge
- Use theme tokens from `tailwind.config.ts`; keep names aligned with actual colors (e.g., avoid misnomers)
- Avoid undefined Tailwind classes; if you use a class (e.g., `font-tribal`), define it in Tailwind config

Error handling
- User-facing components should fail gracefully (e.g., missing image alt text, network errors once data fetching is added)
- Add error boundaries or Next error routes (`error.tsx`) for route-level failures later

## 5. Common Patterns
- App Router layout/metadata pattern (`layout.tsx` + `export const metadata`)
- Client component boundaries for Navbar, Hero (framer-motion), and Carousel
- Data seed pattern via `src/data/products.ts` with typed `Product` interface
- Performance: `next/image` for optimization; memoized components; stable callbacks with `useCallback`
- Theming via Tailwind custom colors, fonts, and background gradients

## 6. Do's and Don'ts
Do
- Keep client-only code minimal and colocated; prefer server components by default
- Use `@/*` alias for clean imports
- Keep a single PostCSS config that matches Tailwind v4 setup (prefer `postcss.config.js` with `@tailwindcss/postcss` plugin)
- Keep Tailwind token names consistent with palette values; update names if palette changes
- Add `aria` attributes and keyboard handlers to interactive UI (e.g., burger menu `aria-expanded`, menu `role="menu"`)
- Use `next/font` or self-host fonts instead of raw `<link>` when possible for better performance
- Validate image paths used by `next/image` exist in `public/`

Don't
- Don’t add "use client" to pages/layouts unless necessary
- Don’t maintain duplicate config files (`postcss.config.js` and `.mjs`)—choose one
- Don’t use dynamic values like `new Date()` in server components if you want static optimization (it makes route dynamic)
- Don’t hardcode English-only content if localization is planned; prepare for i18n
- Don’t rely solely on animation for essential interactions; ensure usability without motion

## 7. Tools & Dependencies
Key libraries
- Next.js 15, React 19, React DOM 19
- Tailwind CSS 4.x (with `@tailwindcss/postcss`), PostCSS, Autoprefixer
- Framer Motion for animations
- ESLint (Next + TS) for linting, TypeScript 5 for types

Setup
- Install dependencies: `npm install`
- Development: `npm run dev`
- Build: `npm run build`; Start: `npm start`
- Lint: `npm run lint`

Configuration notes
- `tsconfig.json` sets `paths: { "@/*": ["./src/*"] }`—use absolute imports
- `tailwind.config.ts` holds custom colors, fonts (`kiner`, `homemade-apple`), and backgrounds; keep classes in sync with these
- Consolidate PostCSS config to one file; with Tailwind v4 prefer:
  - `postcss.config.js` with:
    ```js
    module.exports = { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } };
    ```

## 8. Other Notes
- RSC vs Client boundaries: Carousel, Hero, and Navbar correctly use "use client" since they rely on state/effects/DOM APIs. Keep server pages/components free of client-only logic.
- SEO: `export const metadata` is present; consider route-level metadata and Open Graph tags per page.
- Accessibility: Carousel already supports keyboard arrows and ARIA labels; expand with focus management and announcing slide changes when appropriate.
- Fonts: Currently loaded via `<link>` in `layout.tsx`. Prefer `next/font` for performance and FOIT reduction.
- Tailwind tokens: `text-tribal-brown` maps to a red hex; consider renaming or correcting the actual color for clarity.
- Undefined Tailwind font class: `font-tribal` is used but not defined in Tailwind config; either add it or replace with existing `font-kiner`/`font-homemade-apple`.
- Navigation prefetch: Some links set `prefetch={false}`; ensure that choice is intentional for performance.
- Year in footer uses `new Date()` in a server component—this forces dynamic rendering of the layout. If static optimization is desired, move the year to a client component or hardcode at build time.
