import { cn } from '@/lib/utils';

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <span className={cn('text-lg font-bold text-blue-600', className)}>
      {formatPrice(value)}
    </span>
  );
};

export default ProductPrice;