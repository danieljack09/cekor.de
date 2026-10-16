// Copies the Cyrillic woff2 subsets out of @fontsource into public/fonts/
// under stable, unhashed names.
//
// Why not just `import '@fontsource/literata/cyrillic-400.css'`? Because those
// @font-face rules point at content-hashed bundle URLs, which you cannot write
// a <link rel="preload"> for. Fonts have to be preloaded to avoid a late swap,
// so the @font-face rules live in src/styles/global.css and reference these
// fixed /fonts/*.woff2 paths.
//
// Run via `npm run fonts` after changing the wanted list below.

import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'fonts');

// [fontsource package id, subset, weight, style]
const wanted = [
  ['literata', 'cyrillic', 400, 'normal'],
  ['literata', 'cyrillic', 400, 'italic'],
  ['literata', 'cyrillic', 700, 'normal'],
  ['ibm-plex-sans', 'cyrillic', 400, 'normal'],
  ['ibm-plex-sans', 'cyrillic', 600, 'normal'],
];

await mkdir(outDir, { recursive: true });

const missing = [];
let copied = 0;

for (const [id, subset, weight, style] of wanted) {
  const name = `${id}-${subset}-${weight}-${style}.woff2`;
  const from = path.join(root, 'node_modules', '@fontsource', id, 'files', name);

  if (!existsSync(from)) {
    missing.push({ id, name, dir: path.dirname(from) });
    continue;
  }

  await copyFile(from, path.join(outDir, name));
  copied += 1;
}

if (missing.length > 0) {
  console.error('\nsync-fonts: could not find these font files:\n');
  for (const { id, name, dir } of missing) {
    console.error(`  ${id}: ${name}`);
    try {
      const available = (await readdir(dir))
        .filter((f) => f.includes('cyrillic') && f.endsWith('.woff2'))
        .join('\n    ');
      console.error(`    available cyrillic files:\n    ${available || '(none)'}`);
    } catch {
      console.error(`    ${dir} does not exist - is @fontsource/${id} installed?`);
    }
  }
  console.error(
    '\nFix the `wanted` list in scripts/sync-fonts.mjs and the @font-face ' +
      'rules in src/styles/global.css to match, then re-run.\n'
  );
  process.exit(1);
}

console.log(`sync-fonts: copied ${copied} woff2 file(s) to public/fonts/`);
