import { server } from './utils/test-utils'
import { beforeAll, afterEach, afterAll } from '@jest/globals'

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ 
    onUnhandledRequest: 'warn' // Warn on unhandled requests instead of failing
  })
})

// Reset any request handlers after each test
afterEach(() => {
  server.resetHandlers()
})

// Clean up after all tests are done
afterAll(() => {
  server.close()
})

// Export empty to make this a module
export {}