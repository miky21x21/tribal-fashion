#!/usr/bin/env node

const http = require('http');

console.log('🔍 Quick Server Status Check\n');

// Test frontend server
console.log('Testing frontend server (port 3000)...');
http.get('http://localhost:3000', (res) => {
  console.log('✅ Frontend server: RUNNING');
  testBackend();
}).on('error', () => {
  console.log('❌ Frontend server: NOT RUNNING');
  console.log('   → Start with: npm run dev');
  testBackend();
});

// Test backend server
function testBackend() {
  console.log('\nTesting backend server (port 5000)...');
  http.get('http://localhost:5000', (res) => {
    console.log('✅ Backend server: RUNNING');
    console.log('\n🎯 Both servers are running. The 500 error is likely from Google Cloud Console configuration.');
    console.log('\n📋 Have you updated Google Cloud Console to have ONLY this redirect URI?');
    console.log('   → http://localhost:3000');
    console.log('\n⏰ If you just made the change, wait 5-10 minutes for Google to update.');
  }).on('error', () => {
    console.log('❌ Backend server: NOT RUNNING');
    console.log('   → Start with: cd backend && npm start');
  });
}