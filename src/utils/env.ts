// Environment variable validation and configuration

interface EnvConfig {
  // Authentication
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  APPLE_CLIENT_ID: string;
  APPLE_CLIENT_SECRET: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  
  // Twilio
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  
  // Backend
  BACKEND_URL: string;
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'APPLE_CLIENT_ID',
    'APPLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'BACKEND_URL'
  ] as const;

  const missingVars: string[] = [];
  const config = {} as EnvConfig;

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    
    if (!value) {
      missingVars.push(envVar);
    } else if (value.includes('your_') || value.includes('_here')) {
      console.warn(`Warning: ${envVar} appears to contain placeholder value. Please update with real credentials.`);
    }
    
    config[envVar] = value || '';
  }

  // Additional validation for specific formats
  if (config.TWILIO_PHONE_NUMBER && !config.TWILIO_PHONE_NUMBER.startsWith('+')) {
    console.warn('Warning: TWILIO_PHONE_NUMBER should be in E.164 format (starting with +)');
  }

  if (config.NEXTAUTH_SECRET && config.NEXTAUTH_SECRET.length < 32) {
    console.warn('Warning: NEXTAUTH_SECRET should be at least 32 characters long for security');
  }

  if (missingVars.length > 0) {
    throw new EnvironmentError(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file and ensure all variables are set.'
    );
  }

  return config;
}

// Validate and export environment configuration
export const env = validateEnv();

// Helper functions for specific services
export const twilioConfig = {
  accountSid: env.TWILIO_ACCOUNT_SID,
  authToken: env.TWILIO_AUTH_TOKEN,
  phoneNumber: env.TWILIO_PHONE_NUMBER,
};

export const authConfig = {
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
  apple: {
    clientId: env.APPLE_CLIENT_ID,
    clientSecret: env.APPLE_CLIENT_SECRET,
  },
  nextAuth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
};

export const backendUrl = env.BACKEND_URL;