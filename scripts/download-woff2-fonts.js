/**
 * Download Poppins fonts in WOFF2 format from Google Fonts API
 * WOFF2 is 50-70% smaller than TTF, significantly improving load times
 *
 * Run: node scripts/download-woff2-fonts.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');

// Google Fonts CSS API URL - requesting WOFF2 format
const GOOGLE_FONTS_CSS = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap';

// Font weight to name mapping
const WEIGHT_MAP = {
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black'
};

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        // Request WOFF2 format by using modern user agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...headers
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        if (res.headers['content-type']?.includes('text')) {
          resolve(Buffer.concat(chunks).toString('utf8'));
        } else {
          resolve(Buffer.concat(chunks));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadFonts() {
  console.log('Fetching Google Fonts CSS...');

  try {
    const css = await fetchUrl(GOOGLE_FONTS_CSS);

    // Parse font URLs from CSS
    const fontRegex = /src:\s*url\(([^)]+)\)\s*format\(['"]woff2['"]\);[\s\S]*?font-weight:\s*(\d+);[\s\S]*?font-style:\s*(\w+);/g;

    let match;
    const downloads = [];

    // Alternative regex for Google's CSS format
    const blocks = css.split('@font-face');

    for (const block of blocks) {
      if (!block.includes('woff2')) continue;

      const urlMatch = block.match(/url\(([^)]+)\)\s*format\(['"]woff2['"]\)/);
      const weightMatch = block.match(/font-weight:\s*(\d+)/);
      const styleMatch = block.match(/font-style:\s*(\w+)/);

      if (urlMatch && weightMatch) {
        const url = urlMatch[1];
        const weight = weightMatch[1];
        const style = styleMatch ? styleMatch[1] : 'normal';
        const isItalic = style === 'italic';

        const weightName = WEIGHT_MAP[weight] || weight;
        const filename = isItalic ? `Poppins-${weightName}Italic.woff2` : `Poppins-${weightName}.woff2`;

        downloads.push({ url, filename, weight, style });
      }
    }

    if (downloads.length === 0) {
      console.log('No WOFF2 fonts found in CSS. CSS content:');
      console.log(css.substring(0, 500));
      return;
    }

    console.log(`Found ${downloads.length} font files to download`);

    // Ensure fonts directory exists
    if (!fs.existsSync(FONTS_DIR)) {
      fs.mkdirSync(FONTS_DIR, { recursive: true });
    }

    // Download each font
    for (const { url, filename, weight, style } of downloads) {
      const filepath = path.join(FONTS_DIR, filename);

      console.log(`Downloading ${filename} (weight: ${weight}, style: ${style})...`);

      try {
        const fontData = await fetchUrl(url);
        fs.writeFileSync(filepath, fontData);

        const sizeKB = (fontData.length / 1024).toFixed(1);
        console.log(`  Saved: ${filename} (${sizeKB} KB)`);
      } catch (err) {
        console.error(`  Failed to download ${filename}:`, err.message);
      }
    }

    console.log('\nDone! WOFF2 fonts saved to public/fonts/');
    console.log('\nNext steps:');
    console.log('1. Update src/styles/global.css to use WOFF2 format');
    console.log('2. Update preload links in layouts to reference .woff2 files');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

downloadFonts();
