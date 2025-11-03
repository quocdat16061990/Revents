const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname, '../lib/generated/prisma');
const runtimeDir = path.join(__dirname, '../lib/generated/prisma/runtime');

// Files to remove from runtime directory
const runtimeFilesToRemove = [
  'wasm-engine-edge.js',
  'wasm-edge-light-loader.mjs',
  'wasm-worker-loader.mjs',
  'edge.js',
  'edge-esm.js',
  'wasm-compiler-edge.js',
];

// Files to remove from prisma root directory
const prismaFilesToRemove = [
  'wasm.js',
  'wasm.d.ts',
  'edge.js',
  'edge.d.ts',
  'default.js',
  'default.d.ts',
];

// Remove runtime files
runtimeFilesToRemove.forEach((file) => {
  const filePath = path.join(runtimeDir, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed: runtime/${file}`);
    }
  } catch (error) {
    console.log(`Skipped: runtime/${file} (${error.message})`);
  }
});

// Remove edge-related files from prisma root
prismaFilesToRemove.forEach((file) => {
  const filePath = path.join(prismaDir, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed: ${file}`);
    }
  } catch (error) {
    console.log(`Skipped: ${file} (${error.message})`);
  }
});

