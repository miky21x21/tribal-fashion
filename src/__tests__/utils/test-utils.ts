import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Mock data for testing
export const mockProducts = [
  {
    id: '1',
    name: 'Traditional Tribal Dress',
    description: 'Authentic tribal dress with intricate patterns',
    price: 2500.00,
    image: '/images/product1.jpg',
    category: 'CLOTHING',
    featured: true,
    inventory: 10
  },
  {
    id: '2',
    name: 'Handwoven Tribal Basket',
    description: 'Beautiful handwoven basket made by local artisans',
    price: 800.00,
    image: '/images/product2.jpg',
    category: 'ACCESSORIES',
    featured: true,
    inventory: 5
  }
]

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
}

export const mockAuthResponse = {
  success: true,
  data: {
    token: 'mock-jwt-token',
    user: mockUser
  }
}

export const mockOrders = [
  {
    id: '1',
    userId: '1',
    status: 'PENDING',
    total: 3300.00,
    items: [
      { productId: '1', quantity: 1, price: 2500.00 },
      { productId: '2', quantity: 1, price: 800.00 }
    ]
  }
]

// MSW handlers for mocking backend API
export const backendHandlers = [
  // Products endpoints
  http.get('http://localhost:5000/api/products/featured', () => {
    return HttpResponse.json({
      success: true,
      data: mockProducts.filter(p => p.featured)
    })
  }),

  http.get('http://localhost:5000/api/products', ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const featured = url.searchParams.get('featured')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    let filteredProducts = [...mockProducts]
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }
    if (featured) {
      filteredProducts = filteredProducts.filter(p => p.featured === (featured === 'true'))
    }

    const startIndex = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)

    return HttpResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length
      }
    })
  }),

  http.get('http://localhost:5000/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id)
    if (!product) {
      return HttpResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json({
      success: true,
      data: product
    })
  }),

  http.post('http://localhost:5000/api/products', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newProduct = {
      id: String(mockProducts.length + 1),
      ...body,
      price: parseFloat(String(body.price)),
      inventory: parseInt(String(body.inventory)),
      featured: body.featured === 'true'
    }
    return HttpResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 })
  }),

  // Auth endpoints
  http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      )
    }
    return HttpResponse.json(mockAuthResponse, { status: 201 })
  }),

  http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json(mockAuthResponse)
    }
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.get('http://localhost:5000/api/auth/me', ({ request }) => {
    const auth = request.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }
    return HttpResponse.json({
      success: true,
      data: mockUser
    })
  }),

  // Orders endpoints
  http.get('http://localhost:5000/api/orders', ({ request }) => {
    const auth = request.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }
    return HttpResponse.json({
      success: true,
      data: mockOrders
    })
  }),

  http.post('http://localhost:5000/api/orders', async ({ request }) => {
    const auth = request.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }
    const body = await request.json() as Record<string, unknown>
    const newOrder = {
      id: String(mockOrders.length + 1),
      ...body,
      userId: mockUser.id,
      status: 'PENDING'
    }
    return HttpResponse.json({
      success: true,
      data: newOrder
    }, { status: 201 })
  }),

  http.get('http://localhost:5000/api/orders/:id', ({ params, request }) => {
    const auth = request.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }
    const order = mockOrders.find(o => o.id === params.id)
    if (!order) {
      return HttpResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json({
      success: true,
      data: order
    })
  })
]

// Error handlers for testing error scenarios
export const errorHandlers = {
  products: http.get('http://localhost:5000/api/products', () => {
    return HttpResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }),
  productsFeatured: http.get('http://localhost:5000/api/products/featured', () => {
    return HttpResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }),
  authMe: http.get('http://localhost:5000/api/auth/me', () => {
    return HttpResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }),
  orders: http.get('http://localhost:5000/api/orders', () => {
    return HttpResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  })
}

// Create mock server instance
export const server = setupServer(...backendHandlers)

// Test utilities
export function createMockRequest(url: string, options: RequestInit = {}) {
  return new Request(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
}

export function createAuthenticatedRequest(url: string, token: string = 'mock-token', options: RequestInit = {}) {
  return createMockRequest(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  })
}