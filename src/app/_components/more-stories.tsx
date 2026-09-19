import { Post } from '@/interfaces/post';
import { PostPreview } from './post-preview';

type Props = {
  posts: Post[];
  filters?: React.ReactNode;
};

export function MoreStories({ posts, filters }: Props) {
  return (
    <section id='earlier-deployments'>
      <h2 className='mb-24 text-5xl font-bold tracking-tighter leading-tight'>
        earlier deployments
      </h2>
      {filters ? <div className='-mt-16 mb-10'>{filters}</div> : null}
      {posts.length ? (
        <div className='grid grid-cols-1 gap-y-20 mb-32'>
          {posts.map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              coverImage={post.coverImage.url}
              coverImageAlt={post.coverImage.alt}
              date={post.publishedAt}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          ))}
        </div>
      ) : (
        <p className='mb-32 text-lg text-neutral-600 dark:text-slate-300'>
          No earlier deployments found for this tag.
        </p>
      )}
    </section>
  );
}
