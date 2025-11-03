import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

// Initialize Stripe with the secret API key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Define the POST handler function for the Stripe webhook
export async function POST(req: NextRequest) {
  console.log(`\n🔔 [Stripe Webhook] Received webhook event`);
  
  try {
    // Construct the event using the raw request body, the Stripe signature header, and the webhook secret.
    // This ensures that the request is indeed from Stripe and has not been tampered with.
    const event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log(`📨 [Stripe Webhook] Event type: ${event.type}`);
    console.log(`📨 [Stripe Webhook] Event ID: ${event.id}`);

    // charge.succeeded indicates a successful payment
    if (event.type === 'charge.succeeded') {
      console.log(`✅ [Stripe Webhook] Processing charge.succeeded event`);
      
      // Retrieve the order ID from the payment metadata
      const { object } = event.data;

      console.log(`💳 [Stripe Webhook] Charge details:`, {
        chargeId: object.id,
        amount: object.amount,
        currency: object.currency,
        orderId: object.metadata.orderId,
        email: object.billing_details.email,
      });

      // Update the order status to paid
      await updateOrderToPaid({
        orderId: object.metadata.orderId,
        paymentResult: {
          id: object.id,
          status: 'COMPLETED',
          email_address: object.billing_details.email!,
          pricePaid: (object.amount / 100).toFixed(),
        },
      });

      console.log(`✅ [Stripe Webhook] Order ${object.metadata.orderId} updated successfully\n`);

      return NextResponse.json({
        message: 'updateOrderToPaid was successful',
      });
    }

    console.log(`ℹ️ [Stripe Webhook] Event type ${event.type} is not charge.succeeded, skipping\n`);
    return NextResponse.json({
      message: 'event is not charge.succeeded',
    });
  } catch (error) {
    console.error(`❌ [Stripe Webhook] Error processing webhook:`, error);
    if (error instanceof Error) {
      console.error(`   Error message:`, error.message);
      console.error(`   Error stack:`, error.stack);
    }
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

