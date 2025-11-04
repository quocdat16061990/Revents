import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpForm from './signup-form';

export const metadata: Metadata = {
  title: 'Đăng ký',
};

const SignUp = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

  const { callbackUrl } = searchParams;

  const session = await auth();

  if (session?.user) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8'>
      <div className='w-full max-w-4xl mx-auto pt-12'>
        <Card className='shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden'>
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
              <CardTitle className='text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent'>
                Tạo tài khoản mới
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-300 mt-3 text-lg'>
                Điền thông tin để tạo tài khoản của bạn
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='px-12 md:px-16 pb-12'>
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
