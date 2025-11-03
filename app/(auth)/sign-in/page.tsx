import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import CredentialsSignInForm from './credentials-signin-form';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

const SignIn = async (
  props: {
    searchParams: Promise<{
      callbackUrl: string;
    }>;
  }
) => {
  const { callbackUrl } = await props.searchParams;
  
  const session = await auth();

  if (session?.user) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8'>
      <div className='w-full max-w-4xl mx-auto pt-12'>
        <Card className='shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden'>
          <CardHeader className='space-y-6 text-center pb-6 pt-8'>
            <Link href='/' className='flex justify-center group'>
              <Image
                priority={true}
                src='/images/logo.svg'
                width={100}
                height={100}
                alt={`${APP_NAME} logo`}
                className='group-hover:scale-110 transition-transform duration-300 drop-shadow-lg'
              />
            </Link>
            <div>
              <CardTitle className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                Chào mừng trở lại
              </CardTitle>
              <CardDescription className='text-gray-600 mt-3 text-lg'>
                Đăng nhập để tiếp tục sử dụng dịch vụ
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='px-12 md:px-16 pb-12'>
            <CredentialsSignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
