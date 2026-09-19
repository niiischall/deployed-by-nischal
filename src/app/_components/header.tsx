import Link from 'next/link';
import { ThemeSwitcher } from './theme-switcher';
import Logo from './logo';

const Header = () => {
  return (
    <header className='relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-5'>
      <div className='mx-auto mb-20 mt-8 flex max-w-5xl items-center justify-between gap-4'>
        <nav aria-label='Primary'>
          <Link
            href='/'
            aria-label='deployed by nischal - home'
            className='inline-block'
          >
            <Logo />
          </Link>
        </nav>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
