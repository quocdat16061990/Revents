'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface SessionWrapperProps {
  session: Session | null;
  children: ReactNode;
}

export default function SessionWrapper({ session, children }: SessionWrapperProps) {
  return (
    <SessionProvider session={session}>
      <div suppressHydrationWarning>
        {children || <p>Loading session...</p>}
      </div>
    </SessionProvider>
  );
}
