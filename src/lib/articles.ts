import { getCollection, type CollectionEntry } from 'astro:content';
import { intlLocale, localePath, type Locale } from '../i18n/config';
import { sectionOfArticle } from '../data/sections';
import type { HeroSlide } from '../components/HeroSlider.astro';

/** How many slides HeroSlider shows. Its CSS handles at most 5. */
export const HERO_SLIDES = 5;

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

/**
 * Slides for the featured-news slider (src/components/HeroSlider.astro), up
 * to 5, newest news first. With `placeholders` the list is always filled to
 * 5 with clearly-marked sample slides (the landing page); without, it holds
 * only real articles (the Новости page). Nothing here is invented: the read
 * time is an estimate from the article's own word count at ~200 words/min.
 */
export async function heroSlides(
  locale: Locale,
  { placeholders }: { placeholders: boolean }
): Promise<HeroSlide[]> {
  const news = (await newsArticles(locale)).slice(0, HERO_SLIDES);
  const formatLongDate = new Intl.DateTimeFormat(intlLocale[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format;

  const real: HeroSlide[] = news.map((article) => {
    const wordCount = article.body?.trim().split(/\s+/).length ?? 0;
    return {
      href: localePath(locale, articlePath(article)),
      date: formatLongDate(article.data.date!),
      readTime: `${Math.max(1, Math.round(wordCount / 200))} мин. читање`,
      title: article.data.title,
      description: article.data.description,
      image: article.data.image,
      imageAlt: article.data.imageAlt,
    };
  });
  if (!placeholders) return real;

  return Array.from({ length: HERO_SLIDES }, (_, i) =>
    real[i] ?? {
      href: null,
      date: null,
      readTime: null,
      title: `Наслов на вест ${i + 1}`,
      description: 'Текст-пример за вест што ќе биде пополнета подоцна.',
    }
  );
}
