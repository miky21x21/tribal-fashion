import { POST as register } from '@/app/api/auth/register/route'
import { POST as login } from '@/app/api/auth/login/route'
import { GET as getMe } from '@/app/api/auth/me/route'
import { server, mockAuthResponse, mockUser, errorHandlers } from '../utils/test-utils'
import { http, HttpResponse } from 'msw'
import { beforeAll, afterEach, afterAll, describe, it, expect } from '@jest/globals'

// Setup MSW
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('/api/auth', () => {
  describe('POST /api/auth/register', () => {
    it('should register user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      }
      
      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      
      const response = await register(request)
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.token).toBe(mockAuthResponse.data.token)
      expect(data.data.user).toEqual(mockUser)
    })

    it('should handle existing user email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User'
      }
      
      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      
      const response = await register(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBe('User already exists with this email')
    })

    it('should handle invalid request data', async () => {
      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      })
      
      const response = await register(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to register user')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password'
      }
      
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      
      const response = await login(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.token).toBe(mockAuthResponse.data.token)
      expect(data.data.user).toEqual(mockUser)
    })

    it('should handle invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }
      
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      
      const response = await login(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Invalid credentials')
    })

    it('should handle JSON parsing errors', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      })
      
      const response = await login(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to login user')
    })
  })

  describe('GET /api/auth/me', () => {
    it('should get user profile successfully', async () => {
      const request = new Request('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await getMe(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockUser)
    })

    it('should handle missing authorization header', async () => {
      const request = new Request('http://localhost:3000/api/auth/me')
      
      const response = await getMe(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('No authorization header provided')
    })

    it('should handle invalid token', async () => {
      server.use(
        http.get('http://localhost:5000/api/auth/me', ({ request }) => {
          const auth = request.headers.get('authorization')
          if (auth === 'Bearer invalid-token') {
            return HttpResponse.json(
              { success: false, message: 'Invalid token' },
              { status: 401 }
            )
          }
          return HttpResponse.json({
            success: true,
            data: mockUser
          })
        })
      )

      const request = new Request('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      })
      
      const response = await getMe(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Invalid token')
    })

    it('should handle backend errors', async () => {
      server.use(errorHandlers.authMe)
      
      const request = new Request('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      })
      
      const response = await getMe(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Internal server error')
    })
  })
})