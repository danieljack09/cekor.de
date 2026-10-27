// UI strings, per locale. Only `mk` is filled in; `sr` / `sq` fall back to it
// until someone translates them.
//
// Sentence case throughout. No ALL CAPS labels anywhere - capitalised Cyrillic
// drops the letter-shape cues a stressed reader leans on, and the uppercase
// forms of г д п т are identical in Macedonian and Russian, so "locl" does
// nothing on a capitalised label.

import { defaultLocale, type Locale } from './config';

const ui = {
  mk: {
    // The wordmark. Live text in Source Sans 3, never an image.
    'site.name': 'Чекор',
    'site.tagline': 'Германија, чекор по чекор',
    'site.description':
      'Германија, чекор по чекор. Водич на македонски за живот и работа во Германија, со линкови до официјални извори.',

    'nav.sections': 'Делови на сајтот',
    'nav.cta': 'Започни тука',

    'article.summary': 'На кратко',
    'article.checked': 'Последна проверка',
    'article.sources': 'Извори',
    'article.image': 'Слика',
    'article.step': 'Чекор {n} од {total}',
    'article.progress': 'Позиција во деветте чекори',
    'article.next': 'Следен чекор',
    'article.done': 'Готово',
    'article.sequenceDone': 'Готово — го помина целиот процес.',
    'article.backToSequence': 'Назад кон Почеток во Германија',

    'callout.важно': 'Важно',
    'callout.внимание': 'Внимание',

    'home.empty': 'Наскоро.',
    'home.emptyNote':
      'Упатствата сè уште се пишуваат. Ниедно не е објавено додека не биде проверено со официјален извор.',

    // Почеток во Германија: guides that are not one of the nine steps.
    'pocetok.other': 'Други водичи',
    'pocetok.otherIntro': 'Водичи за теми надвор од деветте чекори: работа, документи и пари.',
    'pocetok.otherCount': 'Водичи: {n}',
    'pocetok.all': 'Сите чекори',
    'pocetok.intro':
      'Преселбата во Германија значи да се помине низ неколку службени чекори, по одреден ред. Првиот е пријавата на адреса (Anmeldung) — без неа не можеш да отвориш банкарска сметка, да се осигураш или да добиеш даночен број. Оваа страница те води низ сите девет чекори, еден по еден, со линк до официјален извор за секој.',
    'pocetok.showAll': 'Прикажи ги сите чекори',
    'pocetok.hideAll': 'Скриј ги чекорите',


    'novosti.all': 'Сите новости',
    'novosti.emptyNote': 'Првите новости се пишуваат. Секоја ќе има линк до официјален извор.',

    'popusti.emptyNote': 'Попустите се подготвуваат. Секој Werbelink ќе биде јасно означен.',

    'page.zaNas': 'За нас',
    'page.kontakt': 'Контакт',

    'footer.impressum': 'Impressum',
    'footer.datenschutz': 'Datenschutz',
    'footer.kontakt': 'Контакт',
    'footer.note': 'Информативна содржина. Не е правен, даночен или осигурителен совет.',

    'skip.content': 'Оди на содржината',

    'error.404.title': 'Страницата не постои',
    'error.404.body': 'Линкот е погрешен или страницата е преместена.',
    'error.404.home': 'Врати се на почетната',
  },
} as const;

export type UiKey = keyof (typeof ui)['mk'];

/**
 * Look up a UI string, with {placeholder} interpolation.
 *   t('mk', 'article.step', { n: 3, total: 9 })  ->  'Чекор 3 од 9'
 */
export function t(
  locale: Locale,
  key: UiKey,
  vars: Record<string, string | number> = {}
): string {
  const table = (ui as Record<string, Record<string, string>>)[locale] ?? ui[defaultLocale];
  const raw = table[key] ?? ui[defaultLocale][key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, name: string) =>
    name in vars ? String(vars[name]) : `{${name}}`
  );
}

/** Curried form, for templates that translate more than one string. */
export function useTranslations(locale: Locale) {
  return (key: UiKey, vars?: Record<string, string | number>) => t(locale, key, vars);
}
