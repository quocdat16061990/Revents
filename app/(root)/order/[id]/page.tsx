import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { auth } from '@/auth';
import { shippingAddressSchema } from '@/lib/validators';
import Stripe from 'stripe';

export const metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const session = await auth();
  const params = await props.params;

  const { id } = params;

  const order = await getOrderById(id);
  if (!order) notFound();

  let client_secret = null;

  // Check if using Stripe and not paid
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Initialize Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create a new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  let shippingAddress;
  try {
    shippingAddress = shippingAddressSchema.parse(order.shippingAddress);
  } catch {
    notFound();
  }

  const preparedOrder = {
    ...order,
    itemsPrice: order.itemsPrice?.toString(),
    shippingPrice: order.shippingPrice?.toString(),
    taxPrice: order.taxPrice?.toString(),
    totalPrice: order.totalPrice?.toString(),
    shippingAddress,
    orderItems: order.orderItems?.map((item: any) => ({
      ...item,
      price: item.price?.toString(),
    })) || [],
  };

  return (
    <OrderDetailsTable
      order={preparedOrder}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      stripeClientSecret={client_secret}
      isAdmin={session?.user.role === 'ADMIN' || false}
    />
  );
};

export default OrderDetailsPage;
