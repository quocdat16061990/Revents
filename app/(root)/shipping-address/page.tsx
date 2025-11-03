import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import ShippingAddressForm from './shipping-address-form';
import { prisma } from '@/db/prisma';


export const metadata: Metadata = {
      title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
      const cart = await getMyCart();

      if (!cart || cart.items.length === 0) redirect('/cart');

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) throw new Error('User ID not found');

      const currentUser = await prisma.user.findFirst({ where: { id: userId } });
      const address = (currentUser?.address as ShippingAddress) || null;

      return (
            <>
                  <h1 className='py-4 h2-bold'>Shipping Address</h1>
                  <ShippingAddressForm address={address} />
            </>
      );
};

export default ShippingAddressPage;