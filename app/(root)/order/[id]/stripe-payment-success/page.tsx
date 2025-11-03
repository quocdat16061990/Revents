import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';
import { getOrderById, updateOrderToPaid } from '@/lib/actions/order.actions';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const metadata: Metadata = {
  title: 'Stripe Payment Success',
};

const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  //  Get the order id and payment intent id from the URL
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);
  if (!order) notFound();

  // Retrieve the payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Check if the payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  // Check if the payment intent is successful
  const isSuccess = paymentIntent.status === 'succeeded';

  if (!isSuccess) return redirect(`/order/${id}`);

  // Fallback: Update order if not already paid (useful for local testing without webhook)
  // This is idempotent - if webhook already updated it, this will skip (order.isPaid check)
  if (!order.isPaid && isSuccess) {
    console.log(`🔄 [Stripe Success Page] Fallback: Checking if order ${id} needs manual update`);
    try {
      const charge = await stripe.charges.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });

      if (charge.data.length > 0) {
        console.log(`🔄 [Stripe Success Page] Fallback: Updating order ${id} manually (webhook may not have fired yet)`);
        
        await updateOrderToPaid({
          orderId: order.id,
          paymentResult: {
            id: charge.data[0].id,
            status: 'COMPLETED',
            email_address: charge.data[0].billing_details.email || '',
            pricePaid: (charge.data[0].amount / 100).toFixed(),
          },
        });
        
        revalidatePath(`/order/${id}`);
        console.log(`✅ [Stripe Success Page] Order ${id} updated via fallback`);
      }
    } catch (error) {
      console.error(`❌ [Stripe Success Page] Error updating order via fallback:`, error);
      // Don't throw - webhook will handle it in production
      // If this fails, webhook will retry automatically
    }
  }

  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <div className='flex flex-col gap-6 items-center '>
        <h1 className='h1-bold'>Thanks for your purchase</h1>
        <div>We are now processing your order.</div>
        <Button asChild>
          <Link href={`/order/${id}`}>View order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;

