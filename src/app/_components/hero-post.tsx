'use client';
import CoverImage from '@/app/_components/cover-image';
import Link from 'next/link';
import DateFormatter from './date-formatter';
import posthog from 'posthog-js';

type Props = {
  title: string;
  coverImage?: string;
  coverImageAlt?: string;
  date: string;
  excerpt: string;
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  coverImageAlt,
  date,
  excerpt,
  slug,
}: Props) {
  const handleClick = () => {
    posthog.capture('Hero Post Clicked', {
      post_slug: slug,
      post_title: title,
    });
  };

  return (
    <section>
      <div className='mb-8 md:mb-16'>
        <CoverImage
          title={title}
          src={coverImage}
          alt={coverImageAlt}
          slug={slug}
          priority
        />
      </div>
      <div className='mb-20'>
        <div>
          <h2 className='mb-4 text-3xl leading-tight'>
            <Link
              href={`/posts/${slug}`}
              className='hover:underline'
              onClick={handleClick}
            >
              {title}
            </Link>
          </h2>
          <div className='mb-4 md:mb-0 text-lg'>
            <DateFormatter dateString={date} />
          </div>
        </div>
        <div>
          <p className='text-lg leading-relaxed'>{excerpt}</p>
        </div>
      </div>
    </section>
  );
}
