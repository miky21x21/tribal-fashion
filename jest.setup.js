import 'whatwg-fetch'
import { TextEncoder, TextDecoder } from 'util'

// Add TextEncoder/TextDecoder for MSW compatibility
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Next.js server request/response objects
global.Request = global.Request || class Request {};
global.Response = global.Response || class Response {};
global.Headers = global.Headers || class Headers {};

// Mock console methods in tests
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
};