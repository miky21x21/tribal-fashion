# Tribal Fashion E-commerce Platform

A modern e-commerce platform built with Next.js 15, React 19, and TypeScript.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Testing

#### End-to-End Tests

This project includes comprehensive Playwright end-to-end tests covering:
- Product browsing and catalog functionality
- User authentication flow (login/logout)
- Complete order placement process

##### Running E2E Tests

```bash
# Run all e2e tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug
```

##### Test Requirements

The e2e tests require both frontend and backend servers to be running. The test configuration automatically starts both servers before running tests.

**Test Coverage:**
- ✅ Product browsing and fetching from catalog
- ✅ Search and filtering functionality  
- ✅ User registration and authentication
- ✅ Login/logout workflows
- ✅ Cart management (add, update, remove items)
- ✅ Complete checkout and order placement
- ✅ Order confirmation and history
- ✅ Error handling when backend services are unavailable
- ✅ Form validation and user input handling
- ✅ Mobile and desktop browser testing

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Backend**: Express.js + Prisma + SQLite
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Testing**: Playwright (E2E)
- **Linting**: ESLint

## Project Structure

```
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable UI components
│   └── data/         # Static data and types
├── backend/
│   ├── src/          # Express.js API server
│   ├── prisma/       # Database schema and migrations
│   └── scripts/      # Database utilities
├── tests/
│   └── e2e/          # Playwright end-to-end tests
│       ├── fixtures/     # Test data and helpers
│       ├── *.spec.ts     # Test specifications
│       ├── global-setup.ts
│       └── global-teardown.ts
└── playwright.config.ts  # Playwright configuration
```