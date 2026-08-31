import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'public/us/index.html',
  'public/us/home.css',
  'public/us/find-pitches.html',
  'public/us/find-pitches.js',
  'public/us/find-pitches.css',
  'public/uk/index.html',
  'public/uk/home.css',
  'public/shared/findpitches-shell.css'
];

await Promise.all(required.map(file => access(path.join(root, file))));

const [sourceUk, builtUk, sourceMiddleware] = await Promise.all([
  readFile(path.join(root, 'src/uk/index.html')),
  readFile(path.join(root, 'public/uk/index.html')),
  readFile(path.join(root, 'functions/_middleware.js'), 'utf8')
]);
assert.deepEqual(builtUk, sourceUk, 'UK source must copy byte-for-byte into public/uk/index.html');
assert.match(sourceMiddleware, /UK_PREVIEW_PATHS/);
assert.match(sourceMiddleware, /\/preview\/uk/);

const topLevel = await readdir(root);
for (const excluded of ['acquisition', 'customer-data', 'ops']) {
  assert.equal(topLevel.includes(excluded), false, `legacy ${excluded}/ directory must not be migrated`);
}

console.log(`Verified ${required.length} static build outputs and clean platform boundaries.`);
