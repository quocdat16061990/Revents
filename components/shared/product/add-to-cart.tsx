'use client';

import { Cart, CartItem } from '@/types';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Plus, Minus } from 'lucide-react';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { dispatchCartUpdate } from '@/lib/utils/cart-events';

const AddToCart = ({
      cart,
      item,
}: {
      cart?: Cart;
      item: Omit<CartItem, 'cartId'>;
}) => {
      const [isPending, startTransition] = useTransition();
      const router = useRouter();

      const handleAddToCart = async () => {
            startTransition(async () => {
                  const res = await addItemToCart(item);
                  if (!res.success) {
                        toast.error(res.message || "Something went wrong!!!!");
                        return;
                  }
                  dispatchCartUpdate();
                  toast(`${item.name} added to the cart`, {
                        action: {
                              label: 'Go to cart',
                              onClick: () => router.push('/cart'),
                        },
                  });
            });
      };
      // Remove item from cart
      const handleRemoveFromCart = async () => {
            startTransition(async () => {
                  const res = await removeItemFromCart(item.productId);
                  dispatchCartUpdate();
                  toast(res.message);
            });
      };

      const existItem = cart && cart.items.find((x) => x.productId === item.productId);

      return existItem ? (
            <div>
                  <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
                        <Minus className='w-4 h-4' />
                  </Button>
                  <span className='px-2'>{existItem.qty}</span>
                  <Button type='button' variant='outline' onClick={handleAddToCart}>
                        <Plus className='w-4 h-4' />
                  </Button>
            </div>
      ) : (
            <Button className='w-full' type='button' onClick={handleAddToCart}>
                  <Plus className='w-4 h-4' />
                  Add to cart
            </Button>
      );
};

export default AddToCart;