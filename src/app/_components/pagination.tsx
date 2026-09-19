import Link from 'next/link';

type Props = {
  currentPage: number;
  totalPages: number;
};

const buildPageHref = (page: number) => (page > 1 ? `/?page=${page}` : '/');

const getLinkClassName = (isActive: boolean) =>
  `rounded-md border px-3 py-1 text-sm transition-colors ${
    isActive
      ? 'border-black bg-black text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
      : 'border-neutral-300 text-neutral-700 hover:border-neutral-500 hover:text-black dark:border-slate-500 dark:text-slate-200 dark:hover:border-slate-300 dark:hover:text-white'
  }`;

export const Pagination = ({ currentPage, totalPages }: Props) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className='mb-16 flex flex-wrap items-center gap-2'
      aria-label='Posts pagination'
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageHref(currentPage - 1)}
          className={getLinkClassName(false)}
        >
          Previous
        </Link>
      ) : null}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildPageHref(page)}
          className={getLinkClassName(page === currentPage)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={buildPageHref(currentPage + 1)}
          className={getLinkClassName(false)}
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
};
