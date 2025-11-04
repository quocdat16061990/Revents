import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import CategoriesDrawer from './categories-drawer';
import AuthSection from './auth-section';
import Search from './search';


const Header = () => {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 sticky top-0 z-[9999]">
      <div className="wrapper flex-between py-4">
        <div className="flex-start">
          <CategoriesDrawer />
          <Link href="/" className="flex-start group">
            <Image
              priority={true}
              src="/images/logo.svg"
              width={48}
              height={48}
              alt={`${APP_NAME} logo`}
              className="group-hover:scale-110 transition-transform duration-300 ml-4"
            />
            <span className="hidden lg:block font-bold text-2xl ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='hidden md:block'>
          <Search />
        </div>
        <div className="flex items-center gap-6">
          <AuthSection />
        </div>
      </div>
    </header>
  );
};

export default Header;
