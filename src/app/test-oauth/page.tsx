'use client';

export default function TestOAuthPage() {
  const redirectUri = 'http://localhost:3000/api/auth/callback/google';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-tribal-cream to-tribal-cream-light flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-tribal-dark mb-6 text-center">
          OAuth Configuration Test
        </h1>
        
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-tribal-dark mb-4">
              🔑 Required Google OAuth Settings
            </h2>
            <div className="space-y-3 text-sm text-tribal-brown">
              <div><strong>Redirect URI:</strong></div>
              <div className="bg-tribal-dark text-white p-3 rounded-lg font-mono text-xs break-all">
                {redirectUri}
              </div>
              <div className="mt-2 text-xs opacity-75">
                Copy this EXACTLY to Google Cloud Console
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-tribal-dark mb-4">
              📋 Google Cloud Console Steps
            </h2>
            <div className="space-y-2 text-sm text-tribal-brown">
              <div>1. Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-tribal-red underline">Google Cloud Console</a></div>
              <div>2. Navigate to "APIs & Services" → "Credentials"</div>
              <div>3. Edit your OAuth 2.0 Client ID</div>
              <div>4. Add the redirect URI above to "Authorized redirect URIs"</div>
              <div>5. Save and wait 2-3 minutes</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-tribal-dark mb-4">
              ✅ Verification Checklist
            </h2>
            <div className="space-y-2 text-sm text-tribal-brown">
              <div>☐ Redirect URI matches exactly (no extra spaces)</div>
              <div>☐ Using http:// not https://</div>
              <div>☐ Port is :3000</div>
              <div>☐ Path is /api/auth/callback/google</div>
              <div>☐ Saved changes in Google Console</div>
              <div>☐ Waited 2-3 minutes for propagation</div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <a 
              href="/login" 
              className="inline-block bg-tribal-red/90 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-semibold hover:bg-tribal-red-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
            >
              Test Google Sign-In
            </a>
            <div className="text-xs text-tribal-brown opacity-75">
              After fixing the redirect URI, test here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
