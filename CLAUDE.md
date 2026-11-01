# Чекор — cekor.de

Macedonian-language guide for people living in or moving to Germany. Procedural
articles about German bureaucracy, monetised by affiliate links.
**Trust is the product.** Every rule below exists to protect it; none of them
are style preferences.

The reader is often stressed, on a cheap Android phone, on a slow connection,
and may not be a confident reader.

## Brand

- Site name is **Чекор** — Cyrillic wordmark, rendered in Source Sans 3 as
  **live text**. No logo image files. The only image is `public/favicon.svg`:
  a single Ч in `--paper` on a rounded `--green` tile (rx 7), drawn as a path because
  favicons render with no access to the self-hosted font. Linked as
  `/favicon.svg?v=2`: bump the `v` whenever the icon changes, or browsers keep
  showing the cached old one.
- **Exception: small inline SVG data charts in articles** (`BarCompare.astro`).
  They are markup, not files: no extra request, a few hundred bytes, text in
  the self-hosted font. They may only repeat numbers the article already
  states and sources, never add one, and every bar starts at zero. Still no
  illustrations or decorative raster images: the reader is on a cheap phone
  on a slow connection.
- **Exception: one photo per article** (`image` in the frontmatter, Daniel's
  call). Shown on the article's cards without a credit, and once in the
  article body via `ArticleImage.astro`: under the "На кратко" box, so the
  answer still comes first, with the credit linked to its source directly
  underneath. Lazy-loaded, webp at build time. Only photos that are free to
  use (CC0 / public domain, or the source's own terms with its exact credit
  wording). Never AI-generated images.
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
list.** The Почеток во Германија page lists it in order, the landing page
previews it; `ArticleLayout` reads it for the
strip and the "Следен чекор →" link; `validate-articles.ts` checks every
article's `sequenceStep` against it and fails the build on a mismatch.

`published: false` gates visibility everywhere. An unpublished step is never
rendered as a link — **no dead links anywhere on the site.** It is still named,
in grey plain text, on the Почеток page.

Publishing a step is two edits: flip `published` in `sequence.ts`, and have an
article file whose slug matches.

`categoryMeta` in the same file holds each category's display label. Categories
(Документи, Пари, Работа) are **labels on a step, not navigation** — there are
no category pages. Their old URLs (`/mk/dokumenti/` etc.) 301 to the Почеток
page in `public/_redirects`, so those slugs stay reserved.

**Editing `sequence.ts` from PowerShell 5.1 corrupts it.** `Get-Content -Raw`
piped into `Set-Content`/`Out-File` re-encodes the Cyrillic into mojibake and
the build then fails with a bare `Expected "}" but found "´"`. Edit it with a
real editor, or with node reading and writing `'utf8'` explicitly.

## Sections and navigation

`src/data/sections.ts` is the single source of truth for the top-level
sections, the same way `sequence.ts` is for steps:

| Section | URL | Status |
|---|---|---|
| Почеток во Германија | `/mk/pocetok-vo-germanija/` | the nine steps in order; a "Други водичи →" button (`.btn--secondary`) beside the h1 leads to the sub-page |
| └ Други водичи | `/mk/pocetok-vo-germanija/drugi-vodici/` | every guide with `sequenceStep: null`, as cards. The guides keep their own URLs (`/mk/<slug>/`). Slug in `otherGuidesSlug` in `sections.ts` |
| Новости | `/mk/novosti/`, articles at `/mk/novosti/<slug>/` | news, newest first; "Наскоро." while empty |
| Попусти | `/mk/popusti/` | discounted products, affiliate; "Наскоро." while empty |

The landing page `/mk/` has one block per **published** section: label (h2
link), intro line, a preview of three items and a "Сите … →" link.

The header nav under the wordmark lists the published sections. An unpublished
section is never in the nav, on the landing page, or linked anywhere. No
hamburger. Below 800px the header is two compact rows: wordmark + CTA,
then the three sections on one line (fits down to 320px).

The header is light (`--paper`, slightly see-through, hairline `--rule` at the
foot, a soft shadow fading in on scroll). Wordmark and nav in ink; the only
blue is the filled "Започни тука" CTA and the active section, which gets a
2px `--green` bottom border. Every link carries a
transparent 2px border so marking one active shifts nothing. `BaseLayout` takes
an `activeSection` prop: section pages pass their own, and `ArticleLayout`
derives it from the article's folder via `sectionOfArticle()` — news for
`novosti/`, Почеток for everything else. `aria-current="page"` is set only
when the URL actually matches, so an article page shows the visual hint without
claiming to be the section page.

**Every section slug is reserved** (published or not), plus the old category
slugs. An article using one fails the build.

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
  in the footer. Never hidden. Always through `Werbelink.astro`:
  `<Werbelink href="https://…">Starlink</Werbelink>` renders the link with a
  grey "Werbelink" badge glued to it (no line break between them),
  `rel="sponsored nofollow noopener"`, new tab, https only. Using it puts
  "Werbelink" in the body, so the build then demands `affiliate: true`.
  For a big call to action, add `button`:
  `<Werbelink href="https://…" button>Нарачај Starlink</Werbelink>` renders a
  full-width `.btn--primary`-style button with the badge right beside it.
  An article with an affiliate link also says so in one plain sentence near
  the top.
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

Collection `articles`, defined in `src/content.config.ts`. Guides live in
`src/content/articles/<locale>/<latin-slug>.mdx` (URL `/mk/<slug>/`), news in
`src/content/articles/<locale>/novosti/<latin-slug>.mdx` (URL `/mk/novosti/<slug>/`).
The folder decides the section; there is no `section` field.

| Field | Type | Rule |
|---|---|---|
| `title` | string | required, non-empty |
| `description` | string | required, **max 155** — where Google truncates |
| `summary` | string | required, **max 200** — the "На кратко" answer |
| `sequenceStep` | number \| null | 1–9 or null; default null |
| `sources` | `{ label, url }[]` | **at least one**, every `url` **https** |
| `updated` | date | required, coerced |
| `date` | date | null | **news: required**, the day the news is about. Guides: must be absent |
| `category` | string | null | guides off the sequence only, as a label. Steps and news: absent |
| `affiliate` | boolean | default `false` |
| `related` | string[] | optional, **at most 2**. Article paths as `articlePath()` writes them: `starlink-vo-germanija`, `novosti/kindergeld-2027`. Shown as "Поврзани статии" cards (`RelatedArticles.astro`) under the article, after `NextStep`. Editorial, never computed. Do not repeat the step `NextStep` already links |
| `image` / `imageAlt` | image / string | optional card image in `src/assets/articles/<slug>.jpg`; `imageAlt` required with it |
| `imageCredit` / `imageLicense` / `imageSource` | string / string / https url | who made the image, its licence, the page it came from. All three together. Shown in grey under the image in the article body, linked to the source. Not shown on cards. Use the source's exact credit wording |
| `imageLicenseUrl` | https url | the licence deed. **Required for any licence that asks for attribution** (CC BY, CC BY-SA): those licences oblige us to link the licence next to the credit. The licence name under the image becomes that link. CC0 and public domain do not need it |

Quote any frontmatter value containing `": "` — an unquoted YAML scalar cannot
hold it, and the build fails with a bare "bad indentation" error that does not
name the real cause.

A bad article **fails the build**. Do not weaken these.

In `src/content.config.ts` (zod):

- `description` max 155, `summary` max 200
- `sources` requires at least one entry
- every source `url` must be `https`
- `sequenceStep` is 1–9 or null
- `related` has at most 2 entries

In `src/lib/validate-articles.ts` (needs the body or `sequence.ts`, so it
cannot be zod). Called from `getStaticPaths()` in `[lang]/[...slug].astro`,
which runs on every build:

- `affiliate: true` requires the body to contain "Werbelink"
- the body containing "Werbelink" requires `affiliate: true`
- `sequenceStep` must match the slug that step points at in `sequence.ts`
- the slug must not be a reserved slug (section slugs + `dokumenti`, `pari`, `rabota`)
- news needs `date`, and no `sequenceStep` or `category`; guides may not set `date`
- nothing deeper than `<locale>/<slug>` or `<locale>/novosti/<slug>`
- every `related` entry must be an existing article in the same locale, not
  the article itself, listed once, and not an unpublished step — so a
  related card can never be a dead link
- the locale folder must be an active locale

## Technical rules

- Astro, static output. Plain CSS with custom properties. No frameworks.
- **The site ships zero JavaScript**, with one deliberate exception: the dark
  mode toggle (Daniel's call, 2026-11-01). It works fully with JS disabled
  because there is none — the menu is a `<details>`. Keep it that way for
  everything else; the only other permitted script is the commented
  Cloudflare Web Analytics beacon.
  - `BaseLayout.astro` has an inline anti-flash `<script is:inline>` in
    `<head>` that applies a *stored* theme choice to `data-theme` on `<html>`
    before first paint. If nothing is stored, it leaves the attribute unset
    so the `prefers-color-scheme` block in `global.css` keeps driving the
    default, and the page still tracks a live OS theme change for anyone who
    has never touched the toggle.
  - `ThemeToggle.astro` has the only other script: a click handler that
    flips `data-theme` and writes the choice to `localStorage`.
  - Both `localStorage` calls are wrapped in `try/catch` — Private Browsing
    or blocked storage must never throw, it should just not persist.
  - No other script is added anywhere for any other feature.
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
- No cookies, no third-party requests, no consent banner. The one exception
  is `localStorage`, used only to remember the dark mode choice (see above) —
  nothing else is stored, and it holds no personal data.

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
4. Flip `published: true` in `sequence.ts` so the Почеток page and the landing
   page link it.

News: same, but in `src/content/articles/mk/novosti/`, with `date` and no
`sequenceStep`. It appears on `/mk/novosti/` and the landing page on its own.
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
  data/sections.ts           THE top-level sections + reserved slugs.
  content.config.ts          article schema (zod, fails the build)
  content/articles/mk/       one folder per locale; news in mk/novosti/
  lib/validate-articles.ts   body + sequence checks, fails the build
  lib/articles.ts            news + off-sequence guide lists
  i18n/config.ts             locale registry, hreflang, og + Intl locales
  i18n/ui.ts                 all UI strings, per locale
  layouts/BaseLayout.astro   header, footer, preloads, SEO, analytics stub
  layouts/ArticleLayout.astro
  components/                Callout, BarCompare, HeroSlider, SequenceStrip, SummaryBox, SourceLine, NextStep, RelatedArticles
  pages/[lang]/              every real URL carries a locale prefix
  pages/[lang]/index.astro   landing page, previews per section
  pages/[lang]/pocetok-vo-germanija/index.astro         the nine steps
  pages/[lang]/pocetok-vo-germanija/drugi-vodici.astro  Други водичи sub-page
  pages/[lang]/novosti/index.astro
  pages/[lang]/[...slug].astro   guides and news (+ runs validate-articles)
  pages/404.astro            outside [lang]: a 404 has no locale to assume
  styles/global.css          design tokens, all shared CSS
scripts/sync-fonts.mjs       copies Cyrillic woff2 out of node_modules
public/_redirects            / -> /mk/, old category pages -> Почеток (301)
public/_headers              immutable caching for /fonts/ and /_astro/
```

- `npm run dev` · `npm run build` · `npm run fonts`
- Run `npm run fonts` after a fresh `npm ci`: npm 11 gates install scripts, so
  it is not wired into `postinstall`.

## Design tokens

Defined in `src/styles/global.css`. Light by default, following the reader's
OS `prefers-color-scheme` until they use the header's dark mode toggle, which
sets `data-theme` on `<html>` and overrides it from then on (see the dark
mode toggle entry under "Technical rules" for how the choice persists).
Dark mode reuses every token name at an inverted lightness — same hues, same
roles, just lit for a dark background. **Do not introduce a new colour**:
that rule is about hue, and the dark values must stay recognisably the same
blue/teal/red family, not a new one.

Blue/teal/red palette — the convention informational and government sites
converge on (GOV.UK: primary blue `#1D70B8`, teal `#158187`, red `#D4351C`
on a light neutral backdrop; US CMS.gov: cool blues/grays as a trust-
building, accessible neutral). `--green` / `--green-pale` keep their names
for stability even though the values are blue now, not green — every
component already keys off these names, so renaming them would be pure
churn for a values-only change.

| Token | | Use |
|---|---|---|
| `--ink` | `#1A2733` | body text |
| `--green` | `#1D70B8` | CTA, links, active-nav underline, structure, primary accent |
| `--green-pale` | `#DCE9F2` | callout fills, dividers |
| `--paper` | `#F7F9FB` | page background |
| `--ochre` | `#158187` | "важно" callouts, current sequence step |
| `--alarm` | `#D4351C` | **warnings and deadlines only** |

Spending `--alarm` on anything else spends the colour's credibility.

**Shadow is scoped, radius mostly is not.** `--shadow` / `--shadow-hover` /
`--shadow-rail` exist for index-page cards (`.card`), the hero-scale sequence
rail (`.rail__bar`) and `NextStep` (below) only — a deliberate, subtle lift,
not rakurs.mk's pill buttons or deep drop shadows. `--radius` (4px) is for
`.card` and button-like elements. A card with a photo (`.card--image`: news
and Други водичи) is the exception: even 1px `--green-pale` border all round
instead of the left accent, `--radius-card` (8px), `--shadow`, and on hover a
3px lift with `--shadow-hover` and a `--green` border. Други водичи shows
three across on wide screens (`.card-grid--3up`). The left-accent boxes on article pages —
`Callout` and `SummaryBox` — are softly rounded too, but with their own
larger `--radius-callout` (10px), not `--radius`: big enough to read as a
deliberately shaped block, not a sharp inline aside, but distinct from the
card radius so the two don't look like the same component at different
sizes. `SequenceStrip`, focus outlines, hairline rules and the skip-link are
the components that stay flat and square — none of them are a filled block,
so rounding would have nothing to apply to. Two further exceptions, both
navigation rather than prose: `NextStep` is a "next lesson" card — borrows
`.card`'s `--radius`/`--shadow`, with a hover lift and an arrow that nudges
right. `NextStepPill`, next to the H1, is a compact pill — fully rounded
(`border-radius: 999px`, deliberately not `--radius`), filling solid on
hover rather than lifting, since it is a chip beside the title, not a card
in the flow. Left-border accents are 3px (`--border-accent`).

Single centered column, max 62 characters, mobile first, on article pages.
Index pages (landing, Почеток, Новости, Попусти) use the wider `.wrap--wide`
column with a card grid (`.card-grid` / `.card`) — see "The card grid" above.
One typeface everywhere: Source Sans 3 (400, 400 italic, 600, 700; Cyrillic
and Latin subsets). Body 18px/19px at line-height 1.7. Chosen because its
GSUB has the Macedonian `locl` (MKD) italic forms; Inter, Manrope, Golos,
Onest and IBM Plex Sans do not. Check any replacement font the same way.
Headings are `--ink`, not blue (blue = clickable or structure). h1/h2 bold
700 with slightly tighter tracking (-0.015em / -0.01em) and leading
(1.15 / 1.2); h3/h4 600. h1 is 34px / 40px from 640px, with a
short 48×4px rule above it in the German flag colours, three equal bands
(#000000 / #DD0000 / #FFCE00), not on the landing hero. **The only place the
flag colours may appear** - never in text or larger areas: gold fails
contrast on paper, red is `--alarm`, and a black-red-gold site reads as an
official German state site.

**`.btn` / `.btn--primary`** is the one filled-button pattern on the site (the
"Чекор по чекор во Германија" CTA on Почеток). Solid `--green` fill, `--paper`
text, uses `--radius`/`--shadow`. Reuse it for any future call-to-action
rather than inventing a second button style.

**Animation is scoped, not banned outright.** The featured-news slider
(`HeroSlider.astro`, top of the landing page and of Новости — one shared
component, hidden radios + CSS `:checked`, zero JS, max 5 slides) cross-fades
between slides on click. It also **auto-rotates every 10 seconds** — the one
other thing besides the landing stats that moves on its own, confirmed
directly. Pure CSS: an extra checked "auto" radio drives keyframes; the
first click on an arrow or dot stops it for good; it pauses on hover and
focus, and does not rotate at all under `prefers-reduced-motion`.
On Новости it holds only real articles; below it
"Сите новости" lists every news article as cards, two per row.
The landing page's nine-step master-detail stepper (`.stepper` — hidden
radio inputs + CSS `:checked`, zero JS, same family of no-JS technique as
the nav menu's `<details>`) cross-fades between step panels (200ms
opacity/transform, structural `:nth-of-type` rules only, no content
coupling).

The landing page's 4 stats (`.hero__stats .stat`) are the one place that
animates **on page load**, not just on hover/click — a deliberate,
explicit exception to "animation only follows user interaction",
confirmed directly: each column fades/slides in staggered (0.1s/0.2s/
0.3s/0.4s delay, set per-item via inline `animation-delay`), `.stat__value`
pulses once after settling, and hovering a column lifts it 4px and shifts
its number to `--ochre`. Apart from the slider rotation, nowhere else auto-plays.

The `prefers-reduced-motion` block neutralises every transition/animation
above for anyone with that OS setting on.

## Not built yet

- Real content on the landing page and on Попусти: both currently show
  placeholder cards (`.card--placeholder`, plain non-linking blocks, not
  `<a>` — nothing to send a reader to yet) rather than real featured
  content or real discounts.
- FAQ / HowTo schema markup on articles.
- `za-nas` and `kontakt` are "Наскоро." stubs. `za-nas` carries most of the
  site's trust — who writes the articles, how sourcing works, how affiliate
  links are handled.
- Impressum and Datenschutz are `TODO` stubs. **Both must be generated from
  eRecht24 before launch** (links are in the page comments). Affiliate links
  make the site commercial, so § 5 DDG applies in full.
- The Попусти section (discounted products, affiliate) is published and live
  at `/mk/popusti/`, showing "Наскоро." The first real affiliate link is the
  Starlink referral button in `internet-vo-germanija.mdx` (2026-10-28), so
  Impressum and Datenschutz are now overdue.
- No news articles yet: `/mk/novosti/` shows "Наскоро."
- Open: may news cite news outlets, or only official sources? Until decided,
  the content rules above apply unchanged.
