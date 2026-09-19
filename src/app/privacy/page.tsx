import type { Metadata } from 'next';
import Header from '@/app/_components/header';
import Container from '@/app/_components/container';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} handles analytics and visitor data.`,
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main>
      <Container>
        <Header />
        <article className='mx-auto max-w-2xl space-y-4 pb-12'>
          <h1 className='text-4xl font-bold leading-tight tracking-tight md:text-5xl'>
            Privacy Policy
          </h1>
          <p>
            This blog only collects minimal analytics required to understand readership trends and
            improve content quality.
          </p>
          <p>
            No sensitive personal data is intentionally collected through this site. If you contact
            me through external platforms, their respective privacy policies apply.
          </p>
          <p>
            If this policy changes, updates will be published on this page with the latest revision
            date.
          </p>
        </article>
      </Container>
    </main>
  );
}
