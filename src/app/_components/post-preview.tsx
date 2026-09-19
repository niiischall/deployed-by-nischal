'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

import CoverImage from './cover-image';
import DateFormatter from './date-formatter';

type Props = {
  title: string;
  coverImage?: string;
  coverImageAlt?: string;
  date: string;
  excerpt: string;
  slug: string;
};

export function PostPreview({
  title,
  coverImage,
  coverImageAlt,
  date,
  excerpt,
  slug,
}: Props) {
  const handleClick = () => {
    posthog.capture('Post Clicked', {
      post_slug: slug,
      post_title: title,
    });
  };

  return (
    <div>
      <div className='mb-5'>
        <CoverImage
          slug={slug}
          title={title}
          src={coverImage}
          alt={coverImageAlt}
        />
      </div>
      <h3 className='text-3xl mb-3 leading-snug'>
        <Link
          href={`/posts/${slug}`}
          className='hover:underline'
          onClick={handleClick}
        >
          {title}
        </Link>
      </h3>
      <div className='text-lg mb-4'>
        <DateFormatter dateString={date} />
      </div>
      <p className='text-lg leading-relaxed mb-4'>{excerpt}</p>
    </div>
  );
}
