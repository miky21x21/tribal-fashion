# Tribal Fashion - E-commerce Platform

A modern e-commerce platform showcasing tribal fashion from Jharkhand, built with Next.js 15 and featuring comprehensive testing infrastructure.

## Features

- **Modern Tech Stack**: Next.js 15 with App Router, React 19, TypeScript
- **Comprehensive Testing**: Complete test coverage with both Jest unit tests and Playwright E2E tests
- **Mock Server Integration**: MSW (Mock Service Worker) for testing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Authentication System**: JWT-based authentication with protected routes
- **Product Management**: Full CRUD operations for products
- **Order Management**: Order creation and tracking

## Testing Architecture

### API Route Testing (Jest)

The project includes comprehensive Jest test suites for all Next.js API routes that proxy requests to the Express backend:

- **Products API** (`/api/products`): Get all products, featured products, product by ID, create products
- **Authentication API** (`/api/auth`): Register, login, get user profile  
- **Orders API** (`/api/orders`): Get orders, create orders, get order by ID

### End-to-End Testing (Playwright)

Comprehensive Playwright end-to-end tests covering:
- Product browsing and catalog functionality
- User authentication flow (login/logout)
- Complete order placement process

### Test Features

- **MSW Integration**: Mock Service Worker for intercepting HTTP requests
- **Independent Testing**: Tests run without requiring the actual backend server
- **Request/Response Validation**: Verify proper data transformation and status codes
- **Error Scenario Testing**: Test both success and error scenarios
- **Authentication Testing**: Test protected routes with token validation

### Test Structure

```
src/__tests__/
├── api/
│   ├── products.test.ts    # Product API route tests
│   ├── auth.test.ts        # Authentication API route tests
│   └── orders.test.ts      # Orders API route tests
├── utils/
│   ├── test-utils.ts       # Mock data and MSW handlers
│   └── test-utils.test.ts  # Utility test file
├── setup.ts                # Global test setup
└── setup.test.ts           # Setup validation test

tests/
└── e2e/                    # Playwright end-to-end tests
    ├── fixtures/           # Test data and helpers
    ├── *.spec.ts          # Test specifications
    ├── global-setup.ts
    └── global-teardown.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Install frontend dependencies:
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run Jest tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run Playwright E2E tests
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# Build for production
npm run build

# Run linting
npm run lint
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

#### Jest Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test products.test.ts

# Run tests with coverage
npm test -- --coverage
```

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

## API Routes

### Products
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/featured` - Get featured products
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create new product (admin only)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Orders  
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Backend**: Express.js + Prisma + SQLite
- **Styling**: Tailwind CSS v4, PostCSS, Autoprefixer  
- **Animation**: Framer Motion
- **Testing**: Jest, MSW, Playwright, @jest/globals
- **Linting**: ESLint with Next.js configuration
- **Build**: Next.js build system with optimization

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── orders/         # Order management endpoints  
│   │   │   └── products/       # Product management endpoints
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── shop/               # Shop page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable UI components
│   ├── data/                   # Static data files
│   └── __tests__/              # Jest test files
├── tests/
│   └── e2e/                    # Playwright end-to-end tests
│       ├── fixtures/           # Test data and helpers
│       ├── *.spec.ts          # Test specifications
│       ├── global-setup.ts
│       └── global-teardown.ts
├── backend/                    # Express.js backend (separate)
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup file
├── playwright.config.ts        # Playwright configuration
└── tailwind.config.ts          # Tailwind configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test` and `npm run test:e2e`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License.