const fs = require('fs');
const path = require('path');

const runtimeDir = path.join(__dirname, '../lib/generated/prisma/runtime');

const filesToRemove = [
  'wasm-engine-edge.js',
  'wasm-edge-light-loader.mjs',
  'wasm-worker-loader.mjs',
];

filesToRemove.forEach((file) => {
  const filePath = path.join(runtimeDir, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed: ${file}`);
    }
  } catch (error) {
    // File doesn't exist or can't be removed, which is fine
    console.log(`Skipped: ${file} (${error.message})`);
  }
});

