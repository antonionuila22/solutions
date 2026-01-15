import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'og');

const svgFiles = [
  'wordpress-450',
  'website-1500'
];

async function convertSvgToPng() {
  for (const file of svgFiles) {
    const svgPath = join(publicDir, `${file}.svg`);
    const pngPath = join(publicDir, `${file}.png`);

    try {
      const svgBuffer = readFileSync(svgPath);

      await sharp(svgBuffer, { density: 150 })
        .resize(1200, 630)
        .png({ quality: 90 })
        .toFile(pngPath);

      console.log(`✓ Converted ${file}.svg → ${file}.png`);
    } catch (error) {
      console.error(`✗ Error converting ${file}: ${error.message}`);
    }
  }
}

convertSvgToPng();
