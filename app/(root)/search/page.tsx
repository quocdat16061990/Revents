import Pagination from '@/components/shared/pagination';
import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllCategories,
  getAllProducts,
} from '@/lib/actions/product.actions';
import Link from 'next/link';
import Rating from '@/components/shared/product/rating';
import PriceFilter from '@/components/shared/price-filter';
import DepartmentSelect from '@/components/shared/department-select';

const ratings = [4, 3, 2, 1];
const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  const products = await getAllProducts({
    category,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  });

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = await getAllCategories();


  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        <div>
          <div className='text-xl mt-8 mb-2'>Department</div>
          <DepartmentSelect
            categories={categories}
            currentCategory={category}
            query={q}
            price={price}
            rating={rating}
            sort={sort}
            page={page}
          />
        </div>
        <div>
          <div className='text-xl mt-8 mb-2'>Price</div>
          <ul className='space-y-1'>
            <PriceFilter />
          </ul>
        </div>
        <div>
          <div className='text-xl mt-8 mb-2'>Customer Review</div>
          <ul className='space-y-2'>
            <li>
              <Button
                className={`w-full justify-start ${rating === 'all'
                    ? 'bg-primary/10 text-primary  dark:bg-primary/25 dark:text-primary dark:border-gray-400'
                    : ''
                  }`}
                variant={'outline'}
                asChild
              >
                <Link href={getFilterUrl({ r: 'all' })}>Any</Link>
              </Button>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Button
                  className={`w-full justify-start ${r.toString() === rating
                      ? 'bg-primary/10 text-primary dark:bg-primary/25 dark:text-primary dark:border-gray-400'
                      : ''
                    }`}
                  variant={'outline'}
                  asChild
                >
                  <Link href={getFilterUrl({ r: `${r}` })}>
                    <Rating value={r} /> & up
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='md:col-span-4 space-y-4'>
        <div className='flex-between flex-col md:flex-row my-4'>
          <div className='flex items-center'>
            {q !== 'all' && q !== '' && 'Query : ' + q}
            {category !== 'all' && category !== '' && '   Category : ' + category}
            {price !== 'all' && '    Price: ' + price}
            {rating !== 'all' && '    Rating: ' + rating + ' & up'}
            &nbsp;
            {(q !== 'all' && q !== '') ||
              (category !== 'all' && category !== '') ||
              rating !== 'all' ||
              price !== 'all' ? (
              <Button variant={'link'} asChild>
                <Link href='/search'>Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2   ${sort == s && 'font-bold'} `}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products!.data.length === 0 && <div>No product found</div>}
          {products!.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products!.totalPages! > 1 && (
          <Pagination page={page} totalPages={products!.totalPages} />
        )}
      </div>
    </div>
  );
};

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet = category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    const parts: string[] = ['Search'];
    if (isQuerySet) parts.push(q);
    if (isCategorySet) parts.push(`Category ${category}`);
    if (isPriceSet) parts.push(`Price ${price}`);
    if (isRatingSet) parts.push(`Rating ${rating}`);
    return { title: parts.join(' - ') };
  } else {
    return {
      title: 'Search Products',
    };
  }
}


export default SearchPage;


