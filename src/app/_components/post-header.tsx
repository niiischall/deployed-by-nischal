import CoverImage from './cover-image';
import DateFormatter from './date-formatter';
import { PostTitle } from '@/app/_components/post-title';

type Props = {
  title: string;
  coverImage?: string;
  coverImageAlt?: string;
  date: string;
  showDate?: boolean;
};

export function PostHeader({
  title,
  coverImage,
  coverImageAlt,
  date,
  showDate = true,
}: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className='max-w-2xl mx-auto mb-8 md:mb-16'>
        <CoverImage
          title={title}
          src={coverImage}
          alt={coverImageAlt}
          priority
        />
      </div>
      {showDate ? (
        <div className='max-w-2xl mx-auto'>
          <div className='mb-2 text-lg'>
            <DateFormatter dateString={date} />
          </div>
        </div>
      ) : null}
    </>
  );
}
