'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price') || 'all';
  
  // Parse min and max from price param (format: "min-max" or "all")
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    if (priceParam !== 'all' && priceParam.includes('-')) {
      const [min, max] = priceParam.split('-');
      setMinPrice(min);
      setMaxPrice(max);
    } else {
      setMinPrice('');
      setMaxPrice('');
    }
  }, [priceParam]);

  const updateUrl = useCallback((min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (min && max) {
      params.set('price', `${min}-${max}`);
    } else if (min || max) {
      // If only one value is set, still update URL
      const priceValue = min ? `${min}-${max || '9999'}` : `0-${max}`;
      params.set('price', priceValue);
    } else {
      params.delete('price');
    }
    
    // Reset to page 1 when filter changes
    params.set('page', '1');
    
    router.push(`/search?${params.toString()}`);
  }, [searchParams, router]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);
    updateUrl(value, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);
    updateUrl(minPrice, value);
  };

  return (
    <li className='flex gap-2'>
      <Input
        placeholder='Min'
        type="number"
        min={0}
        max={1000}
        value={minPrice}
        onChange={handleMinChange}
      />
      <Input
        placeholder='Max'
        type="number"
        min={0}
        max={1000}
        value={maxPrice}
        onChange={handleMaxChange}
      />
    </li>
  );
}

