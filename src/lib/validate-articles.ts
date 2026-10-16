import { getCollection } from 'astro:content';
import { activeLocales } from '../i18n/config';
import { stepAt } from '../data/sequence';
import { newsFolder, reservedSlugs, sectionOfArticle } from '../data/sections';

// Build-time checks that zod cannot express, because they need the article
// BODY or need to agree with src/data/sequence.ts or src/data/sections.ts.
//
// Called from getStaticPaths() in src/pages/[lang]/[...slug].astro, which runs
// on every `astro build` and every dev request. A violation throws, and a
// throw in getStaticPaths fails the build. That is the point: a bad article
// must never reach production.

export async function validateArticles(): Promise<void> {
  const articles = await getCollection('articles');
  const problems: string[] = [];

  for (const article of articles) {
    const { id, body, data } = article;
    const [locale, ...rest] = id.split('/');
    const slug = rest.join('/');
    const isNews = sectionOfArticle(id) === 'novosti';

    if (!(activeLocales as readonly string[]).includes(locale)) {
      problems.push(
        `${id}: "${locale}" is not an active locale. Add it to src/i18n/config.ts or move the file.`
      );
    }

    if (rest.length === 0) {
      problems.push(`${id}: articles live in a locale folder, e.g. src/content/articles/mk/`);
    }

    // Section pages and the old category URLs own these slugs. An article
    // using one would silently shadow or be shadowed by that page.
    if (reservedSlugs.includes(slug)) {
      problems.push(`${id}: "${slug}" is a reserved section slug. Rename the article.`);
    }

    // Only two places an article can live: the locale folder (a guide) or
    // its novosti/ folder (news). Anything deeper is linked from nowhere.
    if (rest.length > 1 && !(isNews && rest.length === 2)) {
      problems.push(
        `${id}: guides live directly in src/content/articles/${locale}/, news in ` +
          `src/content/articles/${locale}/${newsFolder}/. Nothing else is linked.`
      );
    }

    // Affiliate links must be visibly marked. Never in the footer, never hidden.
    if (data.affiliate && !(body ?? '').includes('Werbelink')) {
      problems.push(
        `${id}: affiliate is true but the body never contains "Werbelink". ` +
          `Affiliate links must be marked visibly next to the link.`
      );
    }

    // Guard against the opposite mistake: a marked link with the flag unset
    // would escape this check entirely next time someone edits the file.
    if (!data.affiliate && (body ?? '').includes('Werbelink')) {
      problems.push(`${id}: the body says "Werbelink" but affiliate is false. Set affiliate: true.`);
    }

    if (isNews) {
      // News is dated and stands alone: no place in the nine steps.
      if (data.date === null) {
        problems.push(`${id}: news articles need a "date" (the day the news is about).`);
      }
      if (data.sequenceStep !== null) {
        problems.push(`${id}: news articles cannot have a sequenceStep.`);
      }
      if (data.category !== null) {
        problems.push(`${id}: news articles have no category. Remove the "category" field.`);
      }
    } else if (data.date !== null) {
      problems.push(
        `${id}: "date" is for news only. Guides use "updated". ` +
          `Move the file to ${newsFolder}/ or remove the field.`
      );
    }

    // A step's category lives in src/data/sequence.ts. An article that also
    // declares one would let the two drift apart.
    if (data.sequenceStep !== null && data.category !== null) {
      problems.push(
        `${id}: sequenceStep ${data.sequenceStep} already fixes the category in ` +
          `src/data/sequence.ts. Remove the "category" field.`
      );
    }

    // src/data/sequence.ts is the single source of truth: an article claiming
    // a step must be the article that step points at.
    if (data.sequenceStep !== null) {
      const step = stepAt(data.sequenceStep);
      if (!step) {
        problems.push(`${id}: sequenceStep ${data.sequenceStep} is not in src/data/sequence.ts.`);
      } else if (step.slug !== slug) {
        problems.push(
          `${id}: sequenceStep ${data.sequenceStep} belongs to "${step.slug}" in ` +
            `src/data/sequence.ts, but this file's slug is "${slug}".`
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `\n\nArticle validation failed (${problems.length}):\n\n` +
        problems.map((p) => `  - ${p}`).join('\n') +
        '\n'
    );
  }
}
