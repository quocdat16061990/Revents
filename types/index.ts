import { z } from 'zod';
import {
      cartItemSchema,
      insertCartSchema,
      insertProductSchema,
      shippingAddressSchema,
      insertOrderItemSchema,
      insertOrderSchema,
      paymentResultSchema,
      insertReviewSchema,
} from '@/lib/validators';

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
  paymentResult?: PaymentResult;
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type Product = Omit<z.infer<typeof insertProductSchema>, 'price'> & {
  id: string;
  rating: number;
  numReviews: number;
  createdAt: Date;
  price: number;
};

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
