#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up environment variables...\n');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  process.exit(1);
}

try {
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Remove Apple-related environment variables
  const linesToRemove = [
    'NEXT_PUBLIC_APPLE_CLIENT_ID',
    'NEXT_PUBLIC_APPLE_REDIRECT_URI',
    'APPLE_ID',
    'APPLE_SECRET'
  ];
  
  let lines = content.split('\n');
  let removedLines = [];
  
  lines = lines.filter(line => {
    const shouldRemove = linesToRemove.some(prefix => 
      line.trim().startsWith(prefix)
    );
    
    if (shouldRemove) {
      removedLines.push(line.trim());
    }
    
    return !shouldRemove;
  });
  
  // Write back the cleaned content
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ Removed Apple-related environment variables:');
  removedLines.forEach(line => {
    console.log(`   - ${line}`);
  });
  
  console.log('\n📋 Your .env.local now contains only:');
  console.log('   - Google OAuth credentials');
  console.log('   - NextAuth configuration');
  console.log('   - Backend configuration');
  console.log('   - Other essential variables');
  
  console.log('\n🎉 Environment cleanup complete!');
  
} catch (error) {
  console.error('❌ Error cleaning up environment variables:', error.message);
  process.exit(1);
}
