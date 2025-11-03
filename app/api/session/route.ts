import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (session?.user) {
      return NextResponse.json({ 
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role
        }
      });
    } else {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ user: null });
  }
}
