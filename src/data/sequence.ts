// The nine-step arrival sequence. SINGLE SOURCE OF TRUTH.
//
// Nothing may duplicate this list. The Почеток во Германија page lists it, the
// landing page previews it, the article layout reads it for the sequence strip
// and the "next step" link, and src/lib/validate-articles.ts checks every
// article's sequenceStep and slug against it.
//
// `published` gates visibility everywhere. An unpublished step is never
// rendered as a link: there is no article behind it yet, and a dead link on a
// site whose product is trust costs more than a missing one.

export type Category = 'документи' | 'пари' | 'работа';

/** Categories are labels on a step, not navigation. */
export const categories: Category[] = ['документи', 'пари', 'работа'];

export interface CategoryMeta {
  /** Sentence-case display name. The Category key itself is lowercase. */
  label: string;
  /**
   * The old category-page URL. Those pages are gone; the slug now only 301s
   * to the Почеток page (public/_redirects) and stays reserved.
   */
  slug: string;
}

export const categoryMeta: Record<Category, CategoryMeta> = {
  документи: { label: 'Документи', slug: 'dokumenti' },
  пари: { label: 'Пари', slug: 'pari' },
  работа: { label: 'Работа', slug: 'rabota' },
};

export interface SequenceStep {
  /** Stable key. Never change one: it is what article frontmatter refers to. */
  id: string;
  /** Latin-script URL segment. Content is Cyrillic, slugs are not. */
  slug: string;
  title: string;
  /** One line, Macedonian. Shown under the title in every listing. */
  description: string;
  category: Category;
  published: boolean;
}

export const sequence: SequenceStep[] = [
  {
    id: 'anmeldung',
    slug: 'anmeldung',
    title: 'Пријава на адреса',
    description: 'Како да се пријавиш на нова адреса и што ти треба за Anmeldung.',
    category: 'документи',
    published: true,
  },
  {
    id: 'steuer-id',
    slug: 'steuer-id',
    title: 'Даночен број',
    description: 'Како доаѓа Steuer-ID и што да правиш ако не пристигне.',
    category: 'документи',
    published: true,
  },
  {
    id: 'bankovna-smetka',
    slug: 'bankovna-smetka',
    title: 'Банкарска сметка',
    description: 'Што ти треба за да отвориш сметка и кои документи се бараат.',
    category: 'пари',
    published: true,
  },
  {
    id: 'krankenkasse',
    slug: 'krankenkasse',
    title: 'Здравствено осигурување',
    description: 'Задолжително осигурување, како се избира каса и кога се пријавуваш.',
    category: 'документи',
    published: true,
  },
  {
    id: 'vozacka-dozvola',
    slug: 'vozacka-dozvola',
    title: 'Возачка дозвола',
    description: 'Замена на македонската возачка дозвола за германска.',
    category: 'документи',
    published: true,
  },
  {
    id: 'anerkennung',
    slug: 'anerkennung',
    title: 'Признавање на диплома',
    description: 'Како се признава образование или занает стекнат во Македонија.',
    category: 'работа',
    published: true,
  },
  {
    id: 'steuerklasse',
    slug: 'steuerklasse',
    title: 'Даночна класа',
    description: 'Што значат Steuerklasse I до VI и кога можеш да ја смениш.',
    category: 'пари',
    published: true,
  },
  {
    id: 'kindergeld',
    slug: 'kindergeld',
    title: 'Детски додаток',
    description: 'Кој има право на Kindergeld и како се поднесува барање.',
    category: 'пари',
    published: true,
  },
  {
    id: 'rundfunkbeitrag',
    slug: 'rundfunkbeitrag',
    title: 'Радиодифузна такса',
    description: 'Кој плаќа Rundfunkbeitrag, колку е и што следува ако не платиш.',
    category: 'пари',
    published: true,
  },
];

/** Total number of steps. Derived - never hardcode 9. */
export const totalSteps = sequence.length;

export function stepNumber(step: SequenceStep): number {
  return sequence.indexOf(step) + 1;
}

export function stepAt(n: number): SequenceStep | undefined {
  return sequence[n - 1];
}

export function stepBySlug(slug: string): SequenceStep | undefined {
  return sequence.find((s) => s.slug === slug);
}

export function publishedSteps(): SequenceStep[] {
  return sequence.filter((s) => s.published);
}

/** The next published step after `n`, or undefined if there is none. */
export function nextPublishedAfter(n: number): SequenceStep | undefined {
  return sequence.slice(n).find((s) => s.published);
}
