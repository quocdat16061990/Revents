import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SessionWrapper  from '@/components/sessionWrapper';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Customer Profile',
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  
  return (
    <SessionWrapper session={session}>
      <div className='max-w-md  mx-auto space-y-4'>
        <h2 className='h2-bold'>Profile</h2>
        Test User: {session?.user?.name}
      </div>
    </SessionWrapper>
  );
}