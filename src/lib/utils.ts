const WORDS_PER_MINUTE = 200;

export const countWords = (text: string): number =>
  text.split(/\s+/).filter(Boolean).length;

export const readingMinutes = (text: string): number =>
  Math.max(1, Math.ceil(countWords(text) / WORDS_PER_MINUTE));

export const calculateReadingTime = (text: string): string =>
  `${readingMinutes(text)} min read`;
