#!/usr/bin/env node

const DatabaseReset = require('../src/utils/database-reset');

async function main() {
  const dbReset = new DatabaseReset();
  
  try {
    const args = process.argv.slice(2);
    
    if (args.includes('--validate-only')) {
      await dbReset.validateOnly();
    } else if (args.includes('--quick')) {
      await dbReset.quickReset();
    } else if (args.includes('--counts')) {
      await dbReset.getTableCounts();
    } else {
      // Full reset with validation and seeding
      await dbReset.resetForTesting();
    }
    
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  } finally {
    await dbReset.disconnect();
  }
}

if (require.main === module) {
  main();
}