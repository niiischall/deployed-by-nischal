import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4 | 5 | 6;
};

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const nodeText = (node: HastNode): string => {
  if (node.type === 'text') return node.value || '';
  return (node.children || []).map(nodeText).join('');
};

const tidyHeadingIds = () => (tree: HastNode) => {
  const seen = new Set<string>();

  for (const node of tree.children || []) {
    if (node.type !== 'element' || !/^h[2-6]$/.test(node.tagName || '')) {
      continue;
    }

    const current = node.properties?.id;
    if (!current) continue;

    const base =
      String(current)
        .replace(/[​-‍︀-️]/g, '')
        .replace(/^-+|-+$/g, '') || 'section';
    let id = base;
    for (let suffix = 2; seen.has(id); suffix += 1) {
      id = `${base}-${suffix}`;
    }

    seen.add(id);
    node.properties!.id = id;
  }
};

const collectToc = (toc: TocItem[]) => () => (tree: HastNode) => {
  for (const node of tree.children || []) {
    if (node.type !== 'element' || !/^h[2-6]$/.test(node.tagName || '')) {
      continue;
    }

    const id = node.properties?.id;
    const text = nodeText(node).trim();
    if (!id || !text) continue;

    toc.push({
      id: String(id),
      text,
      level: Number((node.tagName as string)[1]) as TocItem['level'],
    });
  }
};

export default async function markdownToHtml(markdown: string) {
  const youtubeRegex = /%\[https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)\]/g;
  markdown = markdown.replace(
    youtubeRegex,
    (_, videoId) =>
      `<iframe width="350" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" loading="lazy" frameborder="0" allowfullscreen></iframe>`,
  );

  const imageRegex =
    /!\[([^\]]*)\]\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif|webp|svg))\s+align="(left|right|center)"\)/g;

  markdown = markdown.replace(imageRegex, (_, altText, imageUrl, align) => {
    let style = '';
    if (align === 'left') style = 'style="margin-right: 10px;"';
    if (align === 'right') style = 'style="margin-left: 10px;"';
    if (align === 'center') style = 'style="display: block; margin: 0 auto;"';

    return `<img src="${imageUrl}" alt="${altText}" loading="lazy" ${style} />`;
  });

  const toc: TocItem[] = [];

  const result = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(tidyHeadingIds)
    .use(collectToc(toc))
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: 'heading-anchor',
        ariaLabel: 'Permalink to this section',
      },
      content: { type: 'text', value: '#' },
    })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return { html: result.toString(), toc };
}
