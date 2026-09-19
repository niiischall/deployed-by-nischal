import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/_components/header';
import Container from '@/app/_components/container';

export const metadata: Metadata = {
  title: 'Page not found',
};

const linkClassName =
  'underline underline-offset-4 hover:text-sky-700 dark:hover:text-sky-400';

export default function NotFound() {
  return (
    <main>
      <Container>
        <Header />
        <div className='mx-auto max-w-2xl space-y-4 pb-24'>
          <h1 className='text-4xl font-bold leading-tight tracking-tight md:text-5xl'>
            Page not found
          </h1>
          <p className='text-lg'>
            That page has moved or never existed. Nothing is broken on your end.
          </p>
          <p className='text-lg'>
            Head back to{' '}
            <Link href='/' className={linkClassName}>
              all writeups
            </Link>
            , subscribe via{' '}
            <Link href='/feed.xml' className={linkClassName}>
              RSS
            </Link>
            , or{' '}
            <Link href='/contact' className={linkClassName}>
              get in touch
            </Link>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
