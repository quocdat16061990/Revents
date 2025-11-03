import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import { cookies } from 'next/headers';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const config = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        // Check if user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user doesn't exist or password is incorrect, return null
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }: any) {
      // Array of regex patterns of protected paths
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
    
      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;
    
      // Check if user is not authenticated and on a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Allow all other routes (including assets and sign-in)
      return true;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        // Assign user properties to the token
        token.id = user.id;
        token.role = user.role;
    
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;
    
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });
    
            if (sessionCart) {
              // Overwrite any existing user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });
    
              // Assign the guest cart to the logged-in user
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
        if (session?.user.name && trigger === 'update') {
          token.name = session.user.name;
        }
      }
      return token;
    },
    async session({ session, user, trigger, token }: any) {
      // Map the token data to the session object
      session.user.id = token.id || token.sub;
      session.user.name = token.name;
      session.user.role = token.role;

      // Optionally handle session updates (like name change)
      if (trigger === 'update' && token.name) {
        session.user.name = token.name;
      }

      // Return the updated session object
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
