import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'

export const config = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  // Only keep edge-safe logic for middleware
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false
      return true
    },
  },
} satisfies NextAuthConfig

export const { auth } = NextAuth(config)


