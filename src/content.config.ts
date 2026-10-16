import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categories } from './data/sequence';

// One folder per locale: src/content/articles/mk/vozacka-dozvola.mdx
// -> id "mk/vozacka-dozvola" -> /mk/vozacka-dozvola/
//
// Everything here is enforced at build time. A schema violation fails
// `astro build` rather than shipping a broken article. The one rule that
// cannot live in zod (affiliate bodies must say "Werbelink", which needs the
// body, not the frontmatter) is in src/lib/validate-articles.ts.
const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(1),

    /** <meta description>. 155 is where Google starts truncating. */
    description: z.string().min(1).max(155, 'description must be 155 characters or fewer'),

    /** The "На кратко" answer. One short answer, before any explanation. */
    summary: z.string().min(1).max(200, 'summary must be 200 characters or fewer'),

    /**
     * Position in the nine-step arrival sequence, or null for a page that is
     * not part of it. Cross-checked against src/data/sequence.ts at build time.
     */
    sequenceStep: z.number().int().min(1).max(9).nullable().default(null),

    /**
     * Category, for an article that is NOT one of the nine steps. A step gets
     * its category from src/data/sequence.ts and must leave this unset, or two
     * places would own the same fact. Checked in src/lib/validate-articles.ts.
     *
     * Not a z.enum: the list of categories lives in sequence.ts and is not
     * duplicated here.
     */
    category: z
      .string()
      .refine((c) => (categories as readonly string[]).includes(c), {
        message: `category must be one of: ${categories.join(', ')}`,
      })
      .nullable()
      .default(null),

    /**
     * Official sources. At least one, always https. Every factual claim about
     * German law, fees, deadlines or procedures has to be traceable to one.
     */
    sources: z
      .array(
        z.object({
          label: z.string().min(1),
          url: z
            .string()
            .url()
            .refine((u) => u.startsWith('https://'), { message: 'source urls must be https' }),
        })
      )
      .min(1, 'every article needs at least one source'),

    updated: z.coerce.date(),

    /**
     * True if the body contains an affiliate link. Enforced: the body must
     * then visibly say "Werbelink".
     */
    affiliate: z.boolean().default(false),
  }),
});

export const collections = { articles };
