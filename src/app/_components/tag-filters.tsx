'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

import { PostTag } from '@/interfaces/post';

type Props = {
  tags: PostTag[];
  activeTag: string | null;
};

const getLinkClassName = (isActive: boolean) =>
  `rounded-full border px-3 py-1 text-sm transition-colors ${
    isActive
      ? 'border-black bg-black text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
      : 'border-neutral-300 text-neutral-700 hover:border-neutral-500 hover:text-black dark:border-slate-500 dark:text-slate-200 dark:hover:border-slate-300 dark:hover:text-white'
  }`;

export const TagFilters = ({ tags, activeTag }: Props) => {
  const activeTitle = tags.find((tag) => tag.slug === activeTag)?.title ?? null;

  const trackFilterSelect = (tag: PostTag | null) => {
    posthog.capture('Tag Filter Clicked', {
      selected_tag: tag?.title ?? 'all',
      previous_tag: activeTitle ?? 'all',
      selected_all_tags: tag === null,
      was_already_active: activeTag === (tag?.slug ?? null),
    });
  };

  if (!tags.length) {
    return null;
  }

  return (
    <section className='mb-10'>
      <h2 className='mb-4 text-xl font-semibold tracking-tight'>
        Filter by tag
      </h2>
      <div className='flex flex-wrap gap-2'>
        <Link
          href='/'
          onClick={() => trackFilterSelect(null)}
          className={getLinkClassName(!activeTag)}
          aria-current={!activeTag ? 'page' : undefined}
        >
          All
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            onClick={() => trackFilterSelect(tag)}
            className={getLinkClassName(activeTag === tag.slug)}
            aria-current={activeTag === tag.slug ? 'page' : undefined}
          >
            {tag.title}
          </Link>
        ))}
      </div>
    </section>
  );
};
