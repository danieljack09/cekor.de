import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/config';
import { sectionOfArticle } from '../data/sections';

type Article = CollectionEntry<'articles'>;

/** URL path segments after the locale: "anmeldung", "novosti/x". */
export function articlePath(article: Article): string {
  return article.id.split('/').slice(1).join('/');
}

/** News in one locale, newest first. */
export async function newsArticles(locale: Locale): Promise<Article[]> {
  return (await getCollection('articles'))
    .filter((a) => a.id.startsWith(`${locale}/`) && sectionOfArticle(a.id) === 'novosti')
    .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));
}

/**
 * Guides in one locale that are NOT one of the nine steps, newest first.
 * The steps themselves are listed from src/data/sequence.ts.
 */
export async function otherGuides(locale: Locale): Promise<Article[]> {
  return (await getCollection('articles'))
    .filter(
      (a) =>
        a.id.startsWith(`${locale}/`) &&
        sectionOfArticle(a.id) === 'pocetok' &&
        a.data.sequenceStep === null
    )
    .sort((a, b) => b.data.updated.getTime() - a.data.updated.getTime());
}
