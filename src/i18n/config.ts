// Locale registry.
//
// To add Serbian or Albanian later:
//   1. add the code to `activeLocales`
//   2. add a `ui` block in ui.ts
//   3. drop content into src/content/articles/<code>/
// Nothing about existing /mk/ URLs changes, and the hreflang tags in
// BaseLayout expand on their own.

export const defaultLocale = 'mk' as const;

export const activeLocales = ['mk'] as const;

/** Locales the project is designed for, whether or not they are switched on. */
export const plannedLocales = ['mk', 'sr', 'sq'] as const;

export type Locale = (typeof activeLocales)[number];
export type PlannedLocale = (typeof plannedLocales)[number];

export const localeNames: Record<PlannedLocale, string> = {
  mk: 'Македонски',
  sr: 'Српски',
  sq: 'Shqip',
};

/** BCP 47 tag for <html lang> and hreflang. Drives "locl" glyph selection. */
export const htmlLang: Record<PlannedLocale, string> = {
  mk: 'mk',
  sr: 'sr',
  sq: 'sq',
};

/** Open Graph locale. */
export const ogLocale: Record<PlannedLocale, string> = {
  mk: 'mk_MK',
  sr: 'sr_RS',
  sq: 'sq_AL',
};

/** Intl locale for dates and numbers. */
export const intlLocale: Record<PlannedLocale, string> = {
  mk: 'mk-MK',
  sr: 'sr-RS',
  sq: 'sq-AL',
};

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (activeLocales as readonly string[]).includes(value);
}

/** Locale-prefixed path. Always leading and trailing slash. */
export function localePath(locale: Locale, ...segments: string[]): string {
  const parts = [locale, ...segments.flatMap((s) => s.split('/'))].filter(Boolean);
  return `/${parts.join('/')}/`;
}

/**
 * Strips the locale prefix from a pathname, so the same page can be pointed at
 * in another locale. "/mk/vozacka-dozvola/" -> "vozacka-dozvola"
 */
export function pathWithoutLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && (activeLocales as readonly string[]).includes(parts[0])) {
    parts.shift();
  }
  return parts.join('/');
}
