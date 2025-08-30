export interface HealthStatus {
  success: boolean;
  message: string;
  timestamp: string;
  server?: {
    status: string;
    uptime: number;
    memory: NodeJS.MemoryUsage;
    version: string;
  };
  database?: {
    status: string;
    message: string;
    error?: string;
  };
}

export class HealthCheckService {
  private static readonly BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  private static readonly HEALTH_ENDPOINT = '/api/health';

  /**
   * Check the health of the Express backend server
   */
  static async checkBackendHealth(timeoutMs: number = 5000): Promise<HealthStatus> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.BACKEND_URL}${this.HEALTH_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data as HealthStatus;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Health check timed out after ${timeoutMs}ms`);
      }

      throw new Error(`Backend health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if cross-server communication is working
   */
  static async verifyCommunication(timeoutMs: number = 5000): Promise<{
    backendAccessible: boolean;
    frontendToBackend: boolean;
    error?: string;
  }> {
    try {
      const healthStatus = await this.checkBackendHealth(timeoutMs);
      
      return {
        backendAccessible: true,
        frontendToBackend: healthStatus.success,
        error: healthStatus.success ? undefined : healthStatus.message,
      };
    } catch (error) {
      return {
        backendAccessible: false,
        frontendToBackend: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get comprehensive health status including frontend and backend
   */
  static async getFullHealthStatus(timeoutMs: number = 5000): Promise<{
    frontend: {
      status: 'healthy' | 'unhealthy';
      timestamp: string;
    };
    backend: HealthStatus | { status: 'unreachable'; error: string };
    communication: {
      frontendToBackend: boolean;
      error?: string;
    };
  }> {
    const timestamp = new Date().toISOString();
    
    try {
      const backendHealth = await this.checkBackendHealth(timeoutMs);
      const communication = await this.verifyCommunication(timeoutMs);

      return {
        frontend: {
          status: 'healthy',
          timestamp,
        },
        backend: backendHealth,
        communication: {
          frontendToBackend: communication.frontendToBackend,
          error: communication.error,
        },
      };
    } catch (error) {
      return {
        frontend: {
          status: 'healthy',
          timestamp,
        },
        backend: {
          status: 'unreachable',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        communication: {
          frontendToBackend: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}