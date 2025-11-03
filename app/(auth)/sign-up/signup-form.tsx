'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { signUp } from '@/lib/actions/user.actions';
import { signUpFormSchema } from '@/lib/constants/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTransition } from 'react';

const SignUpForm = () => {
  const [, action] = useActionState(signUp, {
    message: '',
    success: false,
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: signUpDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Họ và tên
                </FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Nhập họ và tên của bạn'
                    autoComplete='name'
                    className={`h-12 px-4 text-base border-2 rounded-xl transition-all duration-200 ${
                      form.formState.errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Nhập email của bạn'
                    autoComplete='email'
                    className={`h-12 px-4 text-base border-2 rounded-xl transition-all duration-200 ${
                      form.formState.errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
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
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Nhập mật khẩu'
                    autoComplete='new-password'
                    className={`h-12 px-4 text-base border-2 rounded-xl transition-all duration-200 ${
                      form.formState.errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Mật khẩu phải có ít nhất 6 ký tự
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Xác nhận mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Nhập lại mật khẩu'
                    autoComplete='new-password'
                    className={`h-12 px-4 text-base border-2 rounded-xl transition-all duration-200 ${
                      form.formState.errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
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
            className='w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]'
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </Button>

          <div className='text-sm text-center text-gray-600 pt-4'>
            Đã có tài khoản?{' '}
            <Link
              target='_self'
              className='text-green-600 hover:text-green-800 font-semibold underline decoration-2 underline-offset-2 hover:decoration-green-800 transition-all duration-200'
              href={`/sign-in?callbackUrl=${callbackUrl}`}
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
