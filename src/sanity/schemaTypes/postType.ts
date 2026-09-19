import { defineArrayMember, defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description:
            'Describes the image for screen readers and search engines.',
          validation: (rule) =>
            rule.max(125).warning('Keep alt text under 125 characters.'),
        }),
      ],
    }),
    defineField({
      name: 'coverImageUrl',
      title: 'Cover image URL fallback',
      type: 'url',
      description:
        'Optional URL fallback useful during migrations before uploading images into Sanity assets.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share card',
      type: 'image',
      description:
        '1200x630 PNG used when this post is shared on LinkedIn, X or Slack. Falls back to the cover image.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'markdown',
      title: 'Body (Markdown)',
      type: 'text',
      rows: 18,
      validation: (rule) => rule.required().min(20),
      description: 'Primary article content rendered by this blog.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'tag' }],
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      description:
        'Overrides the title shown in search results. Falls back to the post title.',
      validation: (rule) =>
        rule.max(60).warning('Titles over 60 characters get truncated.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
      description:
        'The snippet shown in search results. Falls back to the excerpt.',
      validation: (rule) =>
        rule
          .min(50)
          .warning('Aim for at least 50 characters.')
          .max(160)
          .warning('Descriptions over 160 characters get truncated.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'coverImage',
    },
  },
});
