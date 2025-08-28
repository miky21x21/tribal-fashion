import { GET, POST } from '@/app/api/products/route'
import { GET as getFeatured } from '@/app/api/products/featured/route'
import { GET as getById } from '@/app/api/products/[id]/route'
import { server, mockProducts, errorHandlers } from '../utils/test-utils'
import { http, HttpResponse } from 'msw'
import { beforeAll, afterEach, afterAll, describe, it, expect } from '@jest/globals'

// Setup MSW
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('/api/products', () => {
  describe('GET /api/products', () => {
    it('should fetch all products successfully', async () => {
      const request = new Request('http://localhost:3000/api/products')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProducts)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: mockProducts.length
      })
    })

    it('should filter products by category', async () => {
      const request = new Request('http://localhost:3000/api/products?category=CLOTHING')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].category).toBe('CLOTHING')
    })

    it('should filter products by featured status', async () => {
      const request = new Request('http://localhost:3000/api/products?featured=true')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.every((product: { featured: boolean }) => product.featured)).toBe(true)
    })

    it('should handle pagination', async () => {
      const request = new Request('http://localhost:3000/api/products?page=1&limit=1')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 1,
        total: mockProducts.length
      })
    })

    it('should handle backend errors', async () => {
      server.use(errorHandlers.products)
      
      const request = new Request('http://localhost:3000/api/products')
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to fetch products')
    })
  })

  describe('GET /api/products/featured', () => {
    it('should fetch featured products successfully', async () => {
      const response = await getFeatured()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProducts.filter(p => p.featured))
    })

    it('should handle backend errors for featured products', async () => {
      server.use(errorHandlers.productsFeatured)
      
      const response = await getFeatured()
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to fetch featured products')
    })
  })

  describe('GET /api/products/[id]', () => {
    it('should fetch product by id successfully', async () => {
      const request = new Request('http://localhost:3000/api/products/1')
      const params = Promise.resolve({ id: '1' })
      
      const response = await getById(request, { params })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProducts[0])
    })

    it('should return 404 for non-existent product', async () => {
      const request = new Request('http://localhost:3000/api/products/999')
      const params = Promise.resolve({ id: '999' })
      
      const response = await getById(request, { params })
      const data = await response.json()
      
      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Product not found')
    })
  })

  describe('POST /api/products', () => {
    it('should create product successfully with auth', async () => {
      const productData = {
        name: 'New Product',
        description: 'New product description',
        price: '1500.00',
        image: '/images/new-product.jpg',
        category: 'ACCESSORIES',
        featured: 'false',
        inventory: '20'
      }
      
      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(productData)
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(productData.name)
      expect(data.data.price).toBe(1500.00)
      expect(data.data.inventory).toBe(20)
      expect(data.data.featured).toBe(false)
    })

    it('should handle invalid request data', async () => {
      // Override with error handler for POST
      server.use(
        http.post('http://localhost:5000/api/products', () => {
          return HttpResponse.json(
            { success: false, message: 'Validation error' },
            { status: 400 }
          )
        })
      )

      const invalidData = { name: 'Invalid Product' } // missing required fields
      
      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(invalidData)
      })
      
      const response = await POST(request)
      
      expect(response.status).toBe(400)
    })

    it('should handle JSON parsing errors', async () => {
      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: 'invalid json'
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to create product')
    })
  })
})