import { GET, POST } from '@/app/api/orders/route'
import { GET as getById } from '@/app/api/orders/[id]/route'
import { server, mockOrders, errorHandlers } from '../utils/test-utils'
import { beforeAll, afterEach, afterAll, describe, it, expect } from '@jest/globals'

// Setup MSW
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('/api/orders', () => {
  describe('GET /api/orders', () => {
    it('should fetch orders successfully with auth', async () => {
      const request = new Request('http://localhost:3000/api/orders', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockOrders)
    })

    it('should handle missing authorization header', async () => {
      const request = new Request('http://localhost:3000/api/orders')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('No authorization header provided')
    })

    it('should pass query parameters to backend', async () => {
      const request = new Request('http://localhost:3000/api/orders?status=PENDING&page=1&limit=5', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should handle backend errors', async () => {
      server.use(errorHandlers.orders)
      
      const request = new Request('http://localhost:3000/api/orders', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Internal server error')
    })
  })

  describe('POST /api/orders', () => {
    it('should create order successfully with auth', async () => {
      const orderData = {
        items: [
          { productId: '1', quantity: 2, price: 2500.00 },
          { productId: '2', quantity: 1, price: 800.00 }
        ],
        total: 5800.00,
        shippingAddress: {
          street: '123 Main St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        }
      }
      
      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: JSON.stringify(orderData)
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.userId).toBe('1')
      expect(data.data.status).toBe('PENDING')
    })

    it('should handle missing authorization header for create', async () => {
      const orderData = {
        items: [{ productId: '1', quantity: 1, price: 2500.00 }],
        total: 2500.00
      }
      
      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('No authorization header provided')
    })

    it('should handle invalid request data', async () => {
      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token'
        },
        body: 'invalid json'
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to create order')
    })
  })

  describe('GET /api/orders/[id]', () => {
    it('should fetch order by id successfully', async () => {
      const request = new Request('http://localhost:3000/api/orders/1', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      const params = Promise.resolve({ id: '1' })
      
      const response = await getById(request, { params })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockOrders[0])
    })

    it('should return 404 for non-existent order', async () => {
      const request = new Request('http://localhost:3000/api/orders/999', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      const params = Promise.resolve({ id: '999' })
      
      const response = await getById(request, { params })
      const data = await response.json()
      
      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Order not found')
    })

    it('should handle missing authorization header for get by id', async () => {
      const request = new Request('http://localhost:3000/api/orders/1')
      const params = Promise.resolve({ id: '1' })
      
      const response = await getById(request, { params })
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('No authorization header provided')
    })
  })
})