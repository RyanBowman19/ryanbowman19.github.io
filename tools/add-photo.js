/*
  Optimizes a portrait for the About section.

  1. Save your photo anywhere as assets/ryan-original.<jpg|png|webp>
  2. Run:  npx --yes -p sharp node tools/add-photo.js
  3. It writes assets/ryan.webp (600x600) and assets/ryan.jpg (fallback)

  Crops square from the centre. If your head sits off-centre in the
  original, crop it square yourself first — Photos app on Windows does
  this fine — then re-run.
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'assets');

const candidates = fs.existsSync(assets)
  ? fs.readdirSync(assets).filter(f => /^ryan-original\.(jpe?g|png|webp)$/i.test(f))
  : [];

if (!candidates.length) {
  console.error('No source photo found.');
  console.error('Save your photo as: assets/ryan-original.jpg  (or .png / .webp)');
  process.exit(1);
}

const src = path.join(assets, candidates[0]);
const MAX = 600;

(async () => {
  const meta = await sharp(src).metadata();
  console.log(`Source: ${candidates[0]} — ${meta.width}x${meta.height}`);

  // Never upscale. Enlarging a small photo just adds bytes and blur —
  // better to serve it at its real size and let CSS size the box.
  const SIZE = Math.min(MAX, meta.width, meta.height);
  if (SIZE < MAX) {
    console.log(`Keeping native ${SIZE}px rather than upscaling to ${MAX}px.`);
  }

  const base = sharp(src)
    .rotate()                                   // honour EXIF orientation
    .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' });

  const webp = await base.clone().webp({ quality: 82 }).toFile(path.join(assets, 'ryan.webp'));
  const jpg  = await base.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(assets, 'ryan.jpg'));

  console.log(`Wrote assets/ryan.webp — ${(webp.size / 1024).toFixed(1)} KB`);
  console.log(`Wrote assets/ryan.jpg  — ${(jpg.size / 1024).toFixed(1)} KB`);
  console.log('');
  console.log('Now swap the placeholder in index.html. Replace the whole');
  console.log('<div class="portrait-fallback"> block and the .portrait-note line with:');
  console.log('');
  console.log('  <picture>');
  console.log('    <source srcset="assets/ryan.webp" type="image/webp">');
  console.log(`    <img src="assets/ryan.jpg" width="${SIZE}" height="${SIZE}"`);
  console.log('         alt="Ryan Bowman" loading="lazy" decoding="async">');
  console.log('  </picture>');
})().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
