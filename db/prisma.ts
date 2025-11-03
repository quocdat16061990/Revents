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
            compute(product: { price: { toString(): string } }) {
              return product.price.toString();
            },
          },
          rating: {
            compute(product: { rating: { toString(): string } }) {
              return product.rating.toString();
            },
          },
        },
      },
    });
