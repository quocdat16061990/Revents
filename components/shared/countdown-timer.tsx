'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate?: Date;
  days?: number;
}

export default function CountdownTimer({
  targetDate,
  days = 5,
}: CountdownTimerProps) {
  const target = useMemo(() => {
    if (targetDate) {
      return targetDate;
    }
    // Set target to X days from now
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [targetDate, days]);

  const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(target)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return null;
  }

  return (
    <section className='py-8 md:py-12 bg-primary/5'>
      <div className='container mx-auto px-4'>
        <Card className='border-primary/20'>
          <CardContent className='p-6 md:p-8'>
            <div className='text-center mb-6'>
              <h2 className='text-2xl md:text-3xl font-bold mb-2'>
                Limited Time Offer!
              </h2>
              <p className='text-muted-foreground'>
                Don't miss out on our special deals. Offer ends in:
              </p>
            </div>
            <div className='grid grid-cols-4 gap-4 max-w-2xl mx-auto'>
              <div className='flex flex-col items-center'>
                <div className='bg-primary text-primary-foreground rounded-lg p-4 md:p-6 w-full text-center mb-2'>
                  <div className='text-3xl md:text-4xl font-bold'>
                    {formatNumber(timeLeft.days)}
                  </div>
                </div>
                <div className='text-sm text-muted-foreground uppercase tracking-wide'>
                  Days
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <div className='bg-primary text-primary-foreground rounded-lg p-4 md:p-6 w-full text-center mb-2'>
                  <div className='text-3xl md:text-4xl font-bold'>
                    {formatNumber(timeLeft.hours)}
                  </div>
                </div>
                <div className='text-sm text-muted-foreground uppercase tracking-wide'>
                  Hours
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <div className='bg-primary text-primary-foreground rounded-lg p-4 md:p-6 w-full text-center mb-2'>
                  <div className='text-3xl md:text-4xl font-bold'>
                    {formatNumber(timeLeft.minutes)}
                  </div>
                </div>
                <div className='text-sm text-muted-foreground uppercase tracking-wide'>
                  Minutes
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <div className='bg-primary text-primary-foreground rounded-lg p-4 md:p-6 w-full text-center mb-2'>
                  <div className='text-3xl md:text-4xl font-bold'>
                    {formatNumber(timeLeft.seconds)}
                  </div>
                </div>
                <div className='text-sm text-muted-foreground uppercase tracking-wide'>
                  Seconds
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

