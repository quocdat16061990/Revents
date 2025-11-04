'use client';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signInDefaultValues } from '@/lib/constants';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInFormSchema } from '@/lib/constants/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useTransition } from 'react';

const CredentialsSignInForm = () => {
  const [, action] = useActionState(signInWithCredentials, {
    message: '',
    success: false,
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: signInDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('callbackUrl', callbackUrl);
    
    startTransition(async () => {
      await action(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className='space-y-5'>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Nhập email của bạn'
                    autoComplete='email'
                    className={`h-12 px-4 text-base border-2 rounded-xl transition-all duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      form.formState.errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-800'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Nhập mật khẩu'
                    autoComplete='current-password'
                    className={`h-12 px-4 text-base border-2 rounded-xl transition-all duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      form.formState.errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-800'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className='w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]'
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          <div className='text-sm text-center text-gray-600 dark:text-gray-300 pt-4'>
            Chưa có tài khoản?{' '}
            <Link
              target='_self'
              className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-800 dark:hover:decoration-blue-300 transition-all duration-200'
              href={`/sign-up?callbackUrl=${callbackUrl}`}
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CredentialsSignInForm;
