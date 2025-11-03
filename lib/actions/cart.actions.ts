'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { formatError, round2 } from '../utils';
import { addToCartInputSchema, cartItemSchema, insertCartSchema, shippingAddressSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { CartItem, ShippingAddress } from '@/types';
import { convertToPlainObject } from '../utils';
import { auth } from '@/auth';

export const addItemToCart = async (
      data: z.infer<typeof addToCartInputSchema>,
): Promise<{ success: boolean; message: string }> => {
      try {
            // Check for session cart cookie
             const cookieStore = await cookies();
            let sessionCartId = cookieStore.get('sessionCartId')?.value;
            
            if (!sessionCartId) {
                  // Generate new session cart ID
                  sessionCartId = crypto.randomUUID();
                  cookieStore.set({
                        name: 'sessionCartId',
                        value: sessionCartId,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 30, 
                  });
            }
            // Get cart from database (if exists)
            const cart = await getMyCart();
            // Accept loose input, find product by id or slug, then build canonical item
            const parsedInput = addToCartInputSchema.parse(data);
            const product = await prisma.product.findFirst({
                  where: parsedInput.productId
                        ? { id: parsedInput.productId }
                        : { slug: parsedInput.slug as string },
            });
            if (!product) throw new Error('Product not found');
            const canonicalItem = cartItemSchema.parse({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  image: product.images[0],
                  price: Number(product.price),
                  qty: parsedInput.qty ?? 1,
            });
            if (!cart) {
                  // Create new cart object
                  const newCart = insertCartSchema.parse({
                        //   userId: userId,
                        items: [canonicalItem],
                        sessionCartId: sessionCartId,
                        ...calcPrice([canonicalItem]),
                  });
                  // Add to database
                  await prisma.cart.create({
                        data: newCart,
                  });

                  // Revalidate product page
                  revalidatePath(`/product/${product.slug}`);

                  return {
                        success: true,
                        message: 'Item added to cart successfully',
                  };
            } else {
                  // Check for existing item in cart
                  const existItem = (cart.items as CartItem[]).find(
                        (x) => x.productId === canonicalItem.productId
                  );
                  // If not enough stock, throw error
                  if (existItem) {
                        if (product.stock < existItem.qty + 1) {
                              throw new Error('Not enough stock');
                        }

                        // Increase quantity of existing item
                        (cart.items as CartItem[]).find(
                              (x) => x.productId === canonicalItem.productId
                        )!.qty = existItem.qty + 1;
                  } else {
                        // If stock, add item to cart
                        if (product.stock < 1) throw new Error('Not enough stock');
                        cart.items.push(canonicalItem);
                  }

                  // Save to database
                  await prisma.cart.update({
                        where: { id: cart.id },
                        data: {
                              items: cart.items,
                              ...calcPrice(cart.items as CartItem[]),
                        },
                  });

                  revalidatePath(`/product/${product.slug}`);

                  return {
                        success: true,
                        message: `${product.name} ${existItem ? 'updated in' : 'added to'
                              } cart successfully`,
                  };
            }

      } catch (error) {
            console.log("error",error)
            return { success: false, message: formatError(error) };
      }
};

//  Get user cart from database
export async function getMyCart() {
      // Check for session cart cookie
      const sessionCartId = (await cookies()).get('sessionCartId')?.value;
      if (!sessionCartId) return undefined;

      // Get user cart from database
      const cart = await prisma.cart.findFirst({
            where: { sessionCartId },
      });

      if (!cart) return undefined;

      // Convert Decimal values to strings for compatibility with AddToCart component
      return convertToPlainObject({
            ...cart,
            items: cart.items as CartItem[],
            itemsPrice: cart.itemsPrice.toString(),
            totalPrice: cart.totalPrice.toString(),
            shippingPrice: cart.shippingPrice.toString(),
            taxPrice: cart.taxPrice.toString(),
      });
}

const calcPrice = (items: z.infer<typeof cartItemSchema>[]) => {
      const itemsPrice = round2(
            items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
      ),
            shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
            taxPrice = round2(0.15 * itemsPrice),
            totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
      return {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice: shippingPrice.toFixed(2),
            taxPrice: taxPrice.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
      };
};

export async function removeItemFromCart(productId: string) {
      try {
            // Get session cart id
            const sessionCartId = (await cookies()).get('sessionCartId')?.value;
            if (!sessionCartId) throw new Error('Cart Session not found');

            // Get product
            const product = await prisma.product.findFirst({
                  where: { id: productId },
            });
            if (!product) throw new Error('Product not found');

            // Get user cart
            const cart = await getMyCart();
            if (!cart) throw new Error('Cart not found');

            // Check if cart has item
            const exist = (cart.items as CartItem[]).find(
                  (x) => x.productId === productId
            );
            if (!exist) throw new Error('Item not found');

            // Check if cart has only one item
            if (exist.qty === 1) {
                  // Remove item from cart
                  cart.items = (cart.items as CartItem[]).filter(
                        (x) => x.productId !== exist.productId
                  );
            } else {
                  // Decrease quantity of existing item
                  (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
                        exist.qty - 1;
            }

            // Update cart in database
            await prisma.cart.update({
                  where: { id: cart.id },
                  data: {
                        items: cart.items,
                        ...calcPrice(cart.items as CartItem[]),
                  },
            });

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`);

            return {
                  success: true,
                  message: `${product.name}  ${(cart.items as CartItem[]).find((x) => x.productId === productId)
                              ? 'updated in'
                              : 'removed from'
                        } cart successfully`,
            };
      } catch (error) {
            return { success: false, message: formatError(error) };
      }
};

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