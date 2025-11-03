import { Button } from '@/components/ui/button';
import ProductList from '@/components/shared/product/product-list';
import { prisma } from '@/db/prisma';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';
import {ProductCarousel} from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBoxes from '@/components/shared/icon-boxes';
import CountdownTimer from '@/components/shared/countdown-timer';


const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
  await delay(2000);
  const featuredProductsRaw = await getFeaturedProducts();
  const featuredProducts = featuredProductsRaw.map(p => ({
    ...p,
    rating: Number(p.rating),
    price: Number(p.price),
  }));
  
  // Lấy sản phẩm từ database
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <IconBoxes />
      <CountdownTimer days={5} />
      <ProductList title='Newest Arrivals' data={products} />
      <ViewAllProductsButton />
    </div>
  );
};

export default HomePage;
