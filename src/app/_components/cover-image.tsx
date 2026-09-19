import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  title: string;
  src?: string;
  slug?: string;
  alt?: string;
  priority?: boolean;
};

const CoverImage = ({ title, src, slug, alt, priority }: Props) => {
  if (!src) {
    return (
      <div>
        <div className='shadow-sm w-full aspect-[1300/630] bg-neutral-200 dark:bg-slate-800 rounded-sm' />
      </div>
    );
  }

  const image = (
    <Image
      src={src}
      alt={alt || `Cover image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={1300}
      height={630}
      sizes='(max-width: 768px) 100vw, 768px'
      priority={priority}
    />
  );
  return (
    <div>
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
