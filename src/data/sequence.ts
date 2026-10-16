// The nine-step arrival sequence. SINGLE SOURCE OF TRUTH.
//
// Nothing may duplicate this list. The homepage groups it by category, the
// category pages list it, the article layout reads it for the sequence strip
// and the "next step" link, and src/lib/validate-articles.ts checks every
// article's sequenceStep and slug against it.
//
// `published` gates visibility everywhere. An unpublished step is never
// rendered as a link: there is no article behind it yet, and a dead link on a
// site whose product is trust costs more than a missing one.

export type Category = 'документи' | 'пари' | 'работа';

/** Display order in the header nav, on the homepage, everywhere. */
export const categories: Category[] = ['документи', 'пари', 'работа'];

export interface CategoryMeta {
  /** Sentence-case display name. The Category key itself is lowercase. */
  label: string;
  /** Latin-script URL segment, like article slugs. */
  slug: string;
  /** One line, Macedonian. Shown under the h1 on the category page. */
  intro: string;
}

export const categoryMeta: Record<Category, CategoryMeta> = {
  документи: {
    label: 'Документи',
    slug: 'dokumenti',
    intro: 'Пријави, дозволи и потврди што ти требаат за да живееш легално во Германија.',
  },
  пари: {
    label: 'Пари',
    slug: 'pari',
    intro: 'Сметки, даноци, додатоци и пренос на пари дома.',
  },
  работа: {
    label: 'Работа',
    slug: 'rabota',
    intro: 'Признавање на образование и што е потребно за да работиш во својата професија.',
  },
};

/**
 * Category slugs are reserved: an article may never use one, or it would
 * collide with a category page. Enforced in src/lib/validate-articles.ts.
 */
export const reservedSlugs: string[] = Object.values(categoryMeta).map((m) => m.slug);

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => categoryMeta[c].slug === slug);
}

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

/** Published steps in a category, in sequence order. */
export function byCategory(category: Category): SequenceStep[] {
  return sequence.filter((s) => s.category === category && s.published);
}

/**
 * Steps in a category that are NOT published yet, in sequence order.
 * The homepage prints these as plain grey text so a visitor can see what the
 * site will cover. Never rendered as a link - there is no article behind one.
 */
export function upcomingByCategory(category: Category): SequenceStep[] {
  return sequence.filter((s) => s.category === category && !s.published);
}

/** The category an article belongs to, by its sequence position. */
export function categoryOfStep(step: number): Category | undefined {
  return stepAt(step)?.category;
}

/** The next published step after `n`, or undefined if there is none. */
export function nextPublishedAfter(n: number): SequenceStep | undefined {
  return sequence.slice(n).find((s) => s.published);
}
