/*
  Rasterizes assets/og-image.svg to assets/og-image.png at 1200x630 —
  the size LinkedIn, Facebook, X and iMessage expect for link previews.

  Run:  npx --yes -p sharp node tools/make-og.js

  Re-run whenever you change the SVG. Then push, and re-scrape the URL in
  LinkedIn's Post Inspector so it picks up the new image instead of a
  cached one: https://www.linkedin.com/post-inspector/
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'assets', 'og-image.svg');
const out = path.join(root, 'assets', 'og-image.png');

if (!fs.existsSync(src)) {
  console.error('Missing ' + src);
  process.exit(1);
}

sharp(fs.readFileSync(src), { density: 144 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9, palette: true })
  .toFile(out)
  .then(info => {
    const kb = (info.size / 1024).toFixed(1);
    console.log(`Wrote assets/og-image.png — ${info.width}x${info.height}, ${kb} KB`);
    if (info.size > 300 * 1024) {
      console.warn('Over 300 KB. Some scrapers skip large images.');
    }
  })
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
