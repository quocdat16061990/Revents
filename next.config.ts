import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use the current project dir for output tracing root. The previous
  // hard-coded path pointed to a different machine (macOS) which caused
  // Turbopack to treat the `.next` dist dir as outside the project.
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
    domains: ['images.unsplash.com', 'utfs.io'],
  },
  eslint: {
    // Temporary: avoid build failing due to ESLint circular plugin issue on CI
    ignoreDuringBuilds: true,
  },
  // Externalize Prisma and related packages to prevent bundling issues
  serverExternalPackages: [
    '@prisma/client',
    'prisma',
    '@prisma/adapter-neon',
    '@neondatabase/serverless',
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize Prisma on server side to prevent webpack bundling issues with node: scheme
      config.externals = config.externals || [];
      
      // Externalize Prisma packages and generated files
      config.externals.push((
        { request, context }: { request?: string; context?: unknown },
        callback: (err?: unknown, result?: string) => void,
      ) => {
        // Externalize Prisma packages
        if (request === '@prisma/client' || request === 'prisma' || 
            request === '@prisma/adapter-neon' || request === '@neondatabase/serverless') {
          return callback(null, `commonjs ${request}`);
        }
        
        // Externalize generated Prisma client files
        if (request && (
          request.includes('lib/generated/prisma') ||
          request.includes('@/lib/generated/prisma') ||
          request.includes('./lib/generated/prisma')
        )) {
          return callback(null, `commonjs ${request}`);
        }
        
        // Externalize node: scheme imports (they are Node.js built-ins)
        if (request && request.startsWith('node:')) {
          return callback(null, `commonjs ${request}`);
        }
        
        callback();
      });
    }
    return config;
  },
};

export default nextConfig;
