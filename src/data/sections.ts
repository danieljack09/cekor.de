// The top-level sections of the site. SINGLE SOURCE OF TRUTH.
//
// The header nav, the landing page and validate-articles.ts all read this
// list. Nothing may duplicate it.
//
// `published` gates visibility everywhere. An unpublished section is never in
// the nav, never on the landing page, never linked - there is no page behind it.

import { categoryMeta } from './sequence';

export type SectionId = 'pocetok' | 'novosti' | 'popusti';

export interface Section {
  id: SectionId;
  /** Latin-script URL segment. */
  slug: string;
  /** Sentence-case display name. */
  label: string;
  /** One line, Macedonian. Shown under the h1 and on the landing page. */
  intro: string;
  published: boolean;
}

export const sections: Section[] = [
  {
    id: 'pocetok',
    slug: 'pocetok-vo-germanija',
    label: 'Почеток во Германија',
    intro: 'Деветте чекори по пристигнување, по ред: од пријава на адреса до радиодифузна такса.',
    published: true,
  },
  {
    id: 'novosti',
    slug: 'novosti',
    label: 'Новости',
    intro: 'Промени во Германија што се важни за тебе како странец.',
    published: true,
  },
  {
    // Discounted products. Live as a page, empty for now: no affiliate
    // content yet, so no Werbelink component needed until the first link
    // goes in.
    id: 'popusti',
    slug: 'popusti',
    label: 'Попусти',
    intro: 'Попусти и понуди корисни за живот во Германија.',
    published: true,
  },
];

export function sectionById(id: SectionId): Section {
  return sections.find((s) => s.id === id)!;
}

export function publishedSections(): Section[] {
  return sections.filter((s) => s.published);
}

/**
 * Slugs no article may use. Every section slug (published or not - an
 * unpublished one will be a page one day), plus the old category slugs, which
 * now 301 to the Почеток page in public/_redirects.
 */
export const reservedSlugs: string[] = [
  ...sections.map((s) => s.slug),
  ...Object.values(categoryMeta).map((m) => m.slug),
];

/**
 * Sub-page of Почеток во Германија that lists the guides outside the nine
 * steps: /<locale>/pocetok-vo-germanija/drugi-vodici/. The guides themselves
 * keep their own URLs (/<locale>/<slug>/).
 */
export const otherGuidesSlug = 'drugi-vodici';

/** News articles live in src/content/articles/<locale>/novosti/. */
export const newsFolder = 'novosti';

/** The section an article belongs to, from its collection id. */
export function sectionOfArticle(id: string): SectionId {
  const [, folder] = id.split('/');
  return folder === newsFolder && id.split('/').length > 2 ? 'novosti' : 'pocetok';
}
