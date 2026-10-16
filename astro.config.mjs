import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static site, deployed to Cloudflare Pages.
//
// i18n: /mk/ is the default AND currently the only active locale, but the
// prefix is always emitted. That is deliberate: adding 'sr' or 'sq' later
// only adds new URLs, it never rewrites one that already exists.
export default defineConfig({
  site: 'https://cekor.de',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'mk',
    locales: ['mk'],
    routing: {
      prefixDefaultLocale: true,
      // Off on purpose. When on, Astro overwrites src/pages/index.astro with
      // its own English page carrying a 2-second meta refresh. / is redirected
      // to /mk/ by a real 301 in public/_redirects instead.
      redirectToDefaultLocale: false,
    },
  },
  // MDX so an article can drop a <Callout> inline. It is a content format,
  // not a UI framework - no client-side runtime is shipped.
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'mk', locales: { mk: 'mk-MK' } },
      filter: (page) => !page.endsWith('/impressum/') && !page.endsWith('/datenschutz/'),
    }),
  ],

  markdown: {
    // No syntax highlighter: nothing on this site is code, and Shiki would
    // add weight for nothing.
    syntaxHighlight: false,
    smartypants: true,
  },

  // No client-side navigation, no speculative fetching: the audience is on
  // metered connections.
  prefetch: false,
  devToolbar: { enabled: false },
});
