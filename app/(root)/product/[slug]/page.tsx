import { notFound } from 'next/navigation';
import { prisma } from '@/db/prisma';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AddToCart from '@/components/shared/product/add-to-cart';
import { getMyCart } from '@/lib/actions/cart.actions';
import { round2 } from '@/lib/utils';
import { auth } from '@/auth';
import ReviewList from './review-list';
import Rating from '@/components/shared/product/rating';


interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return null;
  }

  return product;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const session = await auth();
  const userId = session?.user?.id;

  if (!product) {
    notFound();
  }

  const cart = await getMyCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <section>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 cursor-pointer hover-opacity">
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang chủ
            </Link>

            {/* Product Content */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.images[0] || '/placeholder-product.svg'}
                      alt={product.name}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>

                  {/* Thumbnail Images */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer hover-scale">
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            width={150}
                            height={150}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Brand & Title */}
                  <div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {product.brand}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">
                      {product.name}
                    </h1>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {renderStars(Math.round(Number(product.rating)))}
                    </div>
                    <span className="text-sm text-gray-600">
                      <Rating value={Number(product.rating)} />
                      <p>{product.numReviews} reviews</p>
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-4xl font-bold text-blue-600">
                    {formatPrice(Number(product.price))}
                  </div>

                  {/* Description */}
                  <div className="text-gray-700 leading-relaxed text-lg">
                    {product.description}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-lg font-medium">
                      {product.stock > 0 ? `${product.stock} sản phẩm có sẵn` : 'Hết hàng'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: round2(Number(product.price)),
                        qty: 1,
                        image: product.images![0],
                      }}
                    />

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 py-3 cursor-pointer hover-lift">
                        <Heart className="h-4 w-4 mr-2" />
                        Yêu thích
                      </Button>
                      <Button variant="outline" className="flex-1 py-3 cursor-pointer hover-lift">
                        <Share2 className="h-4 w-4 mr-2" />
                        Chia sẻ
                      </Button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Danh mục:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thương hiệu:</span>
                        <span className="font-medium">{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số lượng:</span>
                        <span className="font-medium">{product.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>
      <section className='mt-10'>
        <h2 className='h2-bold  mb-5'>Customer Reviews</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={userId || ''}
        />
      </section>
    </>

  );
}
