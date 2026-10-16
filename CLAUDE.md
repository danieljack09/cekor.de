# Чекор — cekor.de

Macedonian-language guide for people living in or moving to Germany. Procedural
articles about German bureaucracy, monetised by affiliate links.
**Trust is the product.** Every rule below exists to protect it; none of them
are style preferences.

The reader is often stressed, on a cheap Android phone, on a slow connection,
and may not be a confident reader.

## Brand

- Site name is **Чекор** — Cyrillic wordmark, rendered in IBM Plex Sans as
  **live text**. No logo image files. The only image is `public/favicon.svg`:
  a single Ч in `--paper` on a `--green` square, drawn as a path because
  favicons render with no access to the self-hosted font.
- Tagline: **Германија, чекор по чекор**. Under the wordmark on the homepage
  and in the homepage `<meta description>` — **not on every page**.
- `<title>` pattern `{Article title} — Чекор`, homepage
  `Чекор — Германија, чекор по чекор`. Composed in `BaseLayout.astro` from the
  `title` prop, which is the page title *without* the suffix. Pass no `title`
  for the homepage pattern. Never hand-write the suffix in a page.
- **The sequence strip is a brand element, not decoration.** Nine thin bars:
  green for steps behind the reader, **ochre** for the current one, pale for
  ahead. Renders only when `sequenceStep` is set.

## The sequence is the single source of truth

`src/data/sequence.ts` holds the nine steps. **Nothing may duplicate that
list.** The homepage groups it by category; `ArticleLayout` reads it for the
strip and the "Следен чекор →" link; `validate-articles.ts` checks every
article's `sequenceStep` against it and fails the build on a mismatch.

`published: false` gates visibility everywhere. An unpublished step is never
rendered as a link — **no dead links anywhere on the site.** When a category has
nothing published it shows the "Наскоро." empty state, on the homepage and on
its own page.

Publishing a step is two edits: flip `published` in `sequence.ts`, and have an
article file whose slug matches.

`categoryMeta` in the same file holds each category's display label, URL slug
and intro line. The three **category slugs are reserved** — an article using one
fails the build, since it would collide with a category page.

**Editing `sequence.ts` from PowerShell 5.1 corrupts it.** `Get-Content -Raw`
piped into `Set-Content`/`Out-File` re-encodes the Cyrillic into mojibake and
the build then fails with a bare `Expected "}" but found "´"`. Edit it with a
real editor, or with node reading and writing `'utf8'` explicitly.

## Category navigation

Three links in the green header under the wordmark: Документи, Пари, Работа.
**Always all three**, even when a category has nothing published — they are the
shape of the site, not a list of what happens to exist. No hamburger; three
items fit on a 360px screen, and the row wraps if a label grows.

The active category gets a 2px `--ochre` bottom border. Every link carries a
transparent 2px border so marking one active shifts nothing. `BaseLayout` takes
an `activeCategory` prop: category pages pass their own, and `ArticleLayout`
derives it from the article's `sequenceStep` via `categoryOfStep()`. `aria-current="page"`
is set only when the URL actually matches, so an article page shows the visual
hint without claiming to be the category page.

Category pages are one route, `src/pages/[lang]/[category].astro`, whose
`getStaticPaths` emits only the three category slugs — so it cannot swallow an
article URL.

## Content rules

- Articles are written in Macedonian.
- German administrative terms stay in German — Anmeldung, Anerkennung,
  Steuerklasse — and are explained once, on first use.
- **Every factual claim about German law, fees, deadlines or procedures must
  link to an official source**: a `.de` government site, a Ministerium, a
  Landratsamt, or anerkennung-in-deutschland.de.
- If a fact cannot be sourced, **cut it**. Never hedge, never guess, never
  write "usually" to cover a gap.
- Every article opens with the "На кратко" box: the answer in under 200
  characters, before any explanation.
- Affiliate links are marked visibly with "Werbelink" next to the link. Never
  in the footer. Never hidden.
- **Never publish anything that reads as legal, tax or insurance advice.**
  Describe procedures and point to official sources.

## Style rules

- Sentence case everywhere. **No ALL CAPS labels.** Capitalised Cyrillic drops
  the letter-shape cues a stressed reader leans on, and the uppercase forms of
  г д п т are identical in Macedonian and Russian — so `locl` does nothing on a
  capitalised label.
- Plain language. Short sentences.
- No marketing tone. No exclamation marks.

## Content schema and validation

Collection `articles`, defined in `src/content.config.ts`. Files live in
`src/content/articles/<locale>/<latin-slug>.mdx`.

| Field | Type | Rule |
|---|---|---|
| `title` | string | required, non-empty |
| `description` | string | required, **max 155** — where Google truncates |
| `summary` | string | required, **max 200** — the "На кратко" answer |
| `sequenceStep` | number \| null | 1–9 or null; default null |
| `sources` | `{ label, url }[]` | **at least one**, every `url` **https** |
| `updated` | date | required, coerced |
| `affiliate` | boolean | default `false` |

Quote any frontmatter value containing `": "` — an unquoted YAML scalar cannot
hold it, and the build fails with a bare "bad indentation" error that does not
name the real cause.

A bad article **fails the build**. Do not weaken these.

In `src/content.config.ts` (zod):

- `description` max 155, `summary` max 200
- `sources` requires at least one entry
- every source `url` must be `https`
- `sequenceStep` is 1–9 or null

In `src/lib/validate-articles.ts` (needs the body or `sequence.ts`, so it
cannot be zod). Called from `getStaticPaths()` in `[lang]/[...slug].astro`,
which runs on every build:

- `affiliate: true` requires the body to contain "Werbelink"
- the body containing "Werbelink" requires `affiliate: true`
- `sequenceStep` must match the slug that step points at in `sequence.ts`
- the slug must not be a reserved category slug (`dokumenti`, `pari`, `rabota`)
- the locale folder must be an active locale

## Technical rules

- Astro, static output. Plain CSS with custom properties. No frameworks.
- **The site ships zero JavaScript.** It works fully with JS disabled because
  there is none — the menu is a `<details>`. Keep it that way; the only
  permitted script is the commented Cloudflare Web Analytics beacon.
- Cyrillic content, Latin slugs (`/mk/vozacka-dozvola/`).
- **`lang="mk"` on `<html>` and `font-feature-settings: 'locl'` on `body` must
  never be removed.** Without them the Cyrillic italics of г д п т fall back to
  the Russian glyph forms and the site looks foreign to its own readers.
- MDX is enabled so an article can place a `<Callout>` inline. It is a content
  format, not a UI framework — no client runtime ships.
- Fonts are self-hosted from `public/fonts/`. Never the Google Fonts CDN.
- `/` redirects to `/mk/` via a real 301 in `public/_redirects`. Leave
  `routing.redirectToDefaultLocale: false` — with it on, Astro overwrites
  `src/pages/index.astro` with its own English **2-second** `meta refresh`
  page. Astro still requires that file to exist, so do not delete it.
- hreflang is emitted for **active** locales only, plus `x-default`. Adding a
  locale to `activeLocales` expands it automatically.
- No cookies, no local storage, no third-party requests, no consent banner.

### New locale (/sr/, /sq/)

1. Add the code to `activeLocales` in `src/i18n/config.ts`
2. Add a `ui` block in `src/i18n/ui.ts`
3. Add content under `src/content/articles/<code>/`

No route changes, and no existing `/mk/` URL moves.

## Workflow for a new article

1. Create the file in `src/content/articles/mk/`, Latin slug **matching the
   slug in `sequence.ts`**.
2. Frontmatter: `title`, `description` (≤155), `summary` (≤200),
   `sequenceStep`, `sources` (≥1, https), `updated`, `affiliate`.
   Quote any value containing `": "` or YAML will reject it.
3. Write the body. Use `<Callout variant="важно">` / `variant="внимание"`.
4. Flip `published: true` in `sequence.ts` so the homepage links it.
5. `npm run build` — validation failures are build failures.

**Do not invent facts.** If current German rules are needed, say so and ask —
Daniel will supply or verify them. An unsourced article is worse than no
article.

## Where things are

Repo root is `C:\Users\Daniel\cekor.de` — *not* under `Documents`. Windows
Controlled Folder Access protects `Documents` and silently blocks file creation
there, including by node and npm.

```
src/
  data/sequence.ts           THE nine steps + categoryMeta. Single source of truth.
  content.config.ts          article schema (zod, fails the build)
  content/articles/mk/       one folder per locale
  lib/validate-articles.ts   body + sequence checks, fails the build
  i18n/config.ts             locale registry, hreflang, og + Intl locales
  i18n/ui.ts                 all UI strings, per locale
  layouts/BaseLayout.astro   header, footer, preloads, SEO, analytics stub
  layouts/ArticleLayout.astro
  components/                Callout, SequenceStrip, SummaryBox, SourceLine, NextStep
  pages/[lang]/              every real URL carries a locale prefix
  pages/[lang]/[category].astro  the three category pages
  pages/[lang]/[...slug].astro   articles (+ runs validate-articles)
  pages/404.astro            outside [lang]: a 404 has no locale to assume
  styles/global.css          design tokens, all shared CSS
scripts/sync-fonts.mjs       copies Cyrillic woff2 out of node_modules
public/_redirects            / -> /mk/ (301)
public/_headers              immutable caching for /fonts/ and /_astro/
```

- `npm run dev` · `npm run build` · `npm run fonts`
- Run `npm run fonts` after a fresh `npm ci`: npm 11 gates install scripts, so
  it is not wired into `postinstall`.

## Design tokens

Defined in `src/styles/global.css`. Light mode only. **Do not introduce a new
colour.**

| Token | | Use |
|---|---|---|
| `--ink` | `#16211C` | body text |
| `--green` | `#1E4D3B` | header, structure, primary accent |
| `--green-pale` | `#DDE7E0` | callout fills, dividers |
| `--paper` | `#F4F6F3` | page background |
| `--ochre` | `#A8701A` | "важно" callouts, current sequence step |
| `--alarm` | `#8E2B20` | **warnings and deadlines only** |

Spending `--alarm` on anything else spends the colour's credibility.

**No rounded corners anywhere.** `global.css` sets `border-radius: 0` on `*`,
so an element with a single-sided border accent cannot round its corners by
accident. Left-border accents are 3px (`--border-accent`).

Single centered column, max 62 characters, mobile first. No sidebar, no cards,
no grid. Body Literata 17px/18px at line-height 1.75; headings, nav and tables
IBM Plex Sans.

**No animation at all.** The `prefers-reduced-motion` block stays as a guard
against a future addition, but there is currently nothing to disable.

## Not built yet

- FAQ / HowTo schema markup on articles.
- Affiliate link component with the visible "Werbelink" marker. Worth building
  *before* the first affiliate link goes in, not after.
- `za-nas` and `kontakt` are "Наскоро." stubs. `za-nas` carries most of the
  site's trust — who writes the articles, how sourcing works, how affiliate
  links are handled.
- Impressum and Datenschutz are `TODO` stubs. **Both must be generated from
  eRecht24 before launch** (links are in the page comments). Affiliate links
  make the site commercial, so § 5 DDG applies in full.
- All nine steps are `published: false`, so the homepage shows "Наскоро." The
  one placeholder article is reachable only by direct URL, by design.
