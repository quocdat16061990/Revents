import { PrismaClient } from '@prisma/client';

// Prefer DATABASE_URL; fall back to other common envs when missing
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  '';

if (!databaseUrl || !/^postgres(ql)?:\/\//.test(databaseUrl)) {
  // Fail fast with a clear message during build/runtime
  throw new Error(
    'DATABASE_URL is missing or invalid. It must start with postgresql:// or postgres://. Configure it in your environment (e.g., Vercel Project → Settings → Environment Variables).'
  );
}

export const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
}).$extends({
      result: {
        product: {
          price: {
            compute(product: { price?: { toString(): string } | null }) {
              return product.price?.toString() ?? '0';
            },
          },
          rating: {
            compute(product: { rating?: { toString(): string } | null }) {
              return product.rating?.toString() ?? '0';
            },
          },
        },
      },
    });
