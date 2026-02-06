#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const INPUT_GLOBS = [join(root, 'packages/intl/src/messages/**/*.ts')];

const IGNORE_GLOBS = ['**/node_modules/**', '**/dist/**', '**/build/**'];

const TMP_OUT = resolve(root, 'packages/intl/.cache/intl-extracted.en.json');

const EN_OUT = resolve(root, 'packages/intl/src/locales/en.json');

const OTHER_LOCALES = [
  resolve(root, 'packages/intl/src/locales/pl.json'),
  resolve(root, 'packages/intl/src/locales/uk.json'),
];

function readJson(path) {
  if (!existsSync(path)) {
    console.warn('[intl-extract] readJson missing', path);
    return {};
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function ensureCacheDir() {
  mkdirSync(resolve(root, 'packages/intl/.cache'), { recursive: true });
}

function runExtract() {
  ensureCacheDir();

  const args = [
    'extract',
    ...INPUT_GLOBS,
    '--ignore',
    IGNORE_GLOBS.join(','),
    '--format',
    'simple',
    '--out-file',
    TMP_OUT,
  ];

  try {
    execFileSync('yarn', ['workspace', '@avoo/intl', 'exec', 'formatjs', ...args], {
      stdio: 'inherit',
      cwd: root,
      shell: true,
    });
    console.log('[intl-extract] formatjs finished');
  } catch (err) {
    console.error('[intl-extract] formatjs failed', err);
    throw err;
  }
}

function mergeSourceLocale() {
  const extracted = readJson(TMP_OUT);
  if (Object.keys(extracted).length === 0) {
    console.warn(
      '⚠️ No messages were extracted. Check INPUT_GLOBS and that messages use defineMessages/defineMessage.',
    );
  }
  const currentEn = readJson(EN_OUT);

  const merged = { ...extracted, ...currentEn };

  writeJson(EN_OUT, merged);
  return Object.keys(extracted);
}

function syncOtherLocales(keys, extracted) {
  for (const localePath of OTHER_LOCALES) {
    const current = readJson(localePath);
    let changed = false;

    for (const id of keys) {
      if (!(id in current)) {
        current[id] = extracted[id] ?? '';
        changed = true;
      } else if (current[id] === '' && extracted[id]) {
        current[id] = extracted[id];
        changed = true;
      }
    }

    if (changed) writeJson(localePath, current);
  }
}

try {
  runExtract();
  const keys = mergeSourceLocale();
  const extracted = readJson(TMP_OUT);
  syncOtherLocales(keys, extracted);
  rmSync(TMP_OUT, { force: true });
  rmSync(resolve(root, '.cache/intl-extracted.en.json'), { force: true });
  console.log('✅ intl extract done');
} catch (e) {
  console.error('❌ intl extract failed', e);
  rmSync(TMP_OUT, { force: true });
  rmSync(resolve(root, '.cache/intl-extracted.en.json'), { force: true });
  process.exit(1);
}
