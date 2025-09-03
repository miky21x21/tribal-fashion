#!/usr/bin/env node

/**
 * Generate a secure NextAuth secret
 * Run this script to generate a 32+ character secret for NEXTAUTH_SECRET
 */

const crypto = require('crypto');

// Generate a random 32-byte (256-bit) secret
const secret = crypto.randomBytes(32).toString('base64');

console.log('🔐 Generated NextAuth Secret:');
console.log('');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('');
console.log('📝 Copy this to your .env.local file');
console.log('⚠️  Keep this secret secure and never commit it to version control');
console.log('');
console.log('✅ Secret length:', secret.length, 'characters');
console.log('✅ Meets NextAuth security requirements');
