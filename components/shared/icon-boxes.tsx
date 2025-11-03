'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  Headphones,
  Truck,
  CreditCard,
  RotateCcw,
  Award,
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: 'Your payment information is safe and secure',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our support team is available round the clock',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $50',
  },
  {
    icon: CreditCard,
    title: 'Money Back Guarantee',
    description: '30-day money back guarantee on all products',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Hassle-free returns within 30 days',
  },
  {
    icon: Award,
    title: 'Quality Products',
    description: 'Premium quality products guaranteed',
  },
];

export default function IconBoxes() {
  return (
    <section className='py-12 md:py-16'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className='text-center hover:shadow-lg transition-shadow'>
                <CardContent className='flex flex-col items-center justify-center p-6 gap-3'>
                  <div className='rounded-full bg-primary/10 p-4 mb-2'>
                    <Icon className='w-8 h-8 text-primary' />
                  </div>
                  <h3 className='font-semibold text-lg'>{feature.title}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

