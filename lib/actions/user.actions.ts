'use server';

import { signIn, signOut } from '@/auth';
import { signInFormSchema, signUpFormSchema } from '../constants/validator';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import { shippingAddressSchema, paymentMethodSchema, updateUserSchema } from '../validators';
import { z } from 'zod';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '@/lib/generated/prisma';
import { revalidatePath } from 'next/cache';



// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    const user = signInFormSchema.parse({
      email: email,
      password: password,
    });

    const callbackUrl = formData.get('callbackUrl') as string || '/';

    await signIn('credentials', { ...user, callbackUrl });

    return { success: true, message: 'Đăng nhập thành công' };
  } catch (error) {
    if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }

    return { success: false, message: 'Email hoặc mật khẩu không đúng' };
  }
}

// Register a new user
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: 'USER',
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: '/' });
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id! },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get user by id
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    return user ?? null;
  } catch (error) {
    return null;
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id! },
    });
    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  query: string;
  limit?: number;
  page: number;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== 'all'
      ? {
        user: {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        },
      }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  })
}
  
