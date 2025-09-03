'use client';

import { useState } from 'react';

export default function DebugOAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testOAuthFlow = async () => {
    setIsLoading(true);
    try {
      // Test the exact redirect URI that NextAuth is using
      const response = await fetch('/api/auth/signin/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        redirect: 'manual'
      });
      
      // Get the Location header which contains the redirect URI
      const location = response.headers.get('location');
      
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        location: location,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Test direct Google OAuth URL construction
      const response = await fetch('/api/auth/providers');
      const providers = await response.json();
      
      setDebugInfo({
        providers: providers,
        timestamp: new Date().toISOString(),
        method: 'Direct providers test'
      });
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        method: 'Direct providers test'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const expectedUri = 'http://localhost:3000/api/auth/callback/google';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-tribal-dark mb-6 text-center">
            🔍 OAuth Debug Tool
          </h1>
          
          <div className="space-y-6">
            {/* Expected Configuration */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-tribal-dark mb-4">
                📋 Expected Configuration
              </h2>
              <div className="space-y-3 text-sm text-tribal-brown">
                <div><strong>Expected Redirect URI:</strong></div>
                <div className="bg-tribal-dark text-white p-3 rounded-lg font-mono text-xs break-all">
                  {expectedUri}
                </div>
                <div className="text-xs opacity-75">
                  This is what should be in Google Cloud Console
                </div>
              </div>
            </div>

            {/* Debug Tests */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-tribal-dark mb-4">
                🧪 Debug Tests
              </h2>
              <div className="space-y-3">
                <button
                  onClick={testOAuthFlow}
                  disabled={isLoading}
                  className="w-full bg-tribal-red/90 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-tribal-red-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                >
                  {isLoading ? 'Testing...' : 'Test OAuth Sign-In Flow'}
                </button>
                
                <button
                  onClick={testDirectGoogleAuth}
                  disabled={isLoading}
                  className="w-full bg-tribal-green/90 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-royal-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                >
                  {isLoading ? 'Testing...' : 'Test Providers API'}
                </button>
              </div>
              <div className="text-xs text-tribal-brown mt-2 opacity-75">
                These tests will show us exactly what's happening with OAuth
              </div>
            </div>

            {/* Debug Results */}
            {debugInfo && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-tribal-dark mb-4">
                  🔍 Debug Results
                </h2>
                <div className="space-y-3 text-sm text-tribal-brown">
                  <div><strong>Method:</strong> {debugInfo.method || 'OAuth Flow Test'}</div>
                  <div><strong>Status:</strong> {debugInfo.status}</div>
                  {debugInfo.statusText && (
                    <div><strong>Status Text:</strong> {debugInfo.statusText}</div>
                  )}
                  <div><strong>Location Header:</strong></div>
                  <div className="bg-tribal-dark text-white p-3 rounded-lg font-mono text-xs break-all">
                    {debugInfo.location || 'No location header'}
                  </div>
                  <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
                  {debugInfo.error && (
                    <div><strong>Error:</strong> {debugInfo.error}</div>
                  )}
                  {debugInfo.providers && (
                    <div>
                      <strong>Providers:</strong>
                      <pre className="bg-tribal-dark text-white p-3 rounded-lg text-xs overflow-auto">
                        {JSON.stringify(debugInfo.providers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Critical Google Cloud Console Steps */}
            <div className="bg-red-100/20 backdrop-blur-sm rounded-2xl p-6 border border-red-300/30">
              <h2 className="text-xl font-semibold text-red-800 mb-4">
                🚨 CRITICAL: Google Cloud Console Fix
              </h2>
              <div className="space-y-3 text-sm text-red-700">
                                 <div className="font-semibold">Your OAuth client ID is:</div>
                 <div className="bg-red-800 text-white p-3 rounded-lg font-mono text-xs break-all">
                   750638286490-6827m3k46egnho2mp7774ms2n63841c2.apps.googleusercontent.com
                 </div>
                
                <div className="font-semibold mt-4">Steps to fix:</div>
                <div className="ml-4 space-y-2">
                  <div>1. Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-red-600 underline font-bold">Google Cloud Console</a></div>
                  <div>2. Make sure you're in the RIGHT PROJECT</div>
                  <div>3. Go to "APIs & Services" → "Credentials"</div>
                  <div>4. Find OAuth client with ID above</div>
                  <div>5. Click EDIT (pencil icon)</div>
                  <div>6. In "Authorized redirect URIs":</div>
                  <div className="ml-4">
                    • Remove ALL existing redirect URIs
                    • Add ONLY: <code className="bg-red-800 text-white px-2 py-1 rounded">http://localhost:3000/api/auth/callback/google</code>
                  </div>
                  <div>7. Save changes</div>
                  <div>8. Wait 3-5 minutes</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="text-center space-y-3">
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href="/test-oauth" 
                  className="bg-tribal-green/90 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-royal-green/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                >
                  OAuth Test Page
                </a>
                <a 
                  href="/login" 
                  className="bg-tribal-red/90 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-tribal-red-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                >
                  Login Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
