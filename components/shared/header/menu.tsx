import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import ModeToggle from './mode-toggle';
import UserProfile from '../user-profile';
import CartCount from './cart-count';
import Search from './search';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const Menu = ({ user }: { user: User | null }) => {
  return (
    <>
      <div className='flex justify-end gap-3'>
        <nav className='md:flex hidden w-full max-w-xs gap-1'>
          <ModeToggle />
          <Button asChild variant='ghost'>
            <Link href='/cart' className='relative'>
              <ShoppingCart />
              Cart
              <CartCount />
            </Link>
          </Button>
          {user ? <UserProfile showDetails={false} /> : <>
            <Button asChild variant='outline'>
              <Link href='/sign-in'>
                <UserIcon />
                Sign In
              </Link>
            </Button>
            <Button asChild>
              <Link href='/sign-up'>
                Sign Up
              </Link>
            </Button>
          </>}

        </nav>
        <nav className='md:hidden'>
          <Sheet>
            <SheetTrigger className='align-middle'>
              <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className='flex flex-col items-start'>
              <SheetTitle>Menu</SheetTitle>
              <div className='mt-10'>
                <Search />
              </div>
              <ModeToggle />
              <Button asChild variant='ghost'>
                <Link href='/cart' className='relative'>
                  <ShoppingCart />
                  Cart
                  <CartCount />
                </Link>
              </Button>
              {user ? (
                <UserProfile showDetails={false} />
              ) : (
                <>
                  <Button asChild variant='outline'>
                    <Link href='/sign-in'>
                      <UserIcon />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href='/sign-up'>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
};

export default Menu;
