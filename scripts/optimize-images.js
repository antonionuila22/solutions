/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format with compression
 * Reduces image size by ~70-80%
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const QUALITY = 80; // WebP quality (80 is good balance)
const DIRS_TO_OPTIMIZE = ['public/photos', 'public/icons'];

async function optimizeImage(inputPath, outputPath) {
  try {
    const info = await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const inputStats = await stat(inputPath);
    const savings = ((1 - info.size / inputStats.size) * 100).toFixed(1);

    console.log(`✅ ${inputPath}`);
    console.log(`   → ${outputPath} (${savings}% smaller)`);

    return { original: inputStats.size, optimized: info.size };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function processDirectory(dir) {
  console.log(`\n📁 Processing ${dir}...`);

  const files = await readdir(dir);
  let totalOriginal = 0;
  let totalOptimized = 0;
  let count = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();

    // Only process PNG and JPG images
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const inputPath = join(dir, file);
      const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

      const result = await optimizeImage(inputPath, outputPath);

      if (result) {
        totalOriginal += result.original;
        totalOptimized += result.optimized;
        count++;
      }
    }
  }

  return { totalOriginal, totalOptimized, count };
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  let grandTotalOriginal = 0;
  let grandTotalOptimized = 0;
  let grandTotalCount = 0;

  for (const dir of DIRS_TO_OPTIMIZE) {
    const { totalOriginal, totalOptimized, count } = await processDirectory(dir);
    grandTotalOriginal += totalOriginal;
    grandTotalOptimized += totalOptimized;
    grandTotalCount += count;

    if (count > 0) {
      const savings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
      console.log(`\n   📊 ${count} images: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalOptimized / 1024 / 1024).toFixed(1)}MB (${savings}% saved)`);
    }
  }

  if (grandTotalCount > 0) {
    const totalSavings = ((1 - grandTotalOptimized / grandTotalOriginal) * 100).toFixed(1);
    console.log(`\n✨ TOTAL: ${grandTotalCount} images optimized`);
    console.log(`📉 Size reduced: ${(grandTotalOriginal / 1024 / 1024).toFixed(1)}MB → ${(grandTotalOptimized / 1024 / 1024).toFixed(1)}MB`);
    console.log(`💾 Space saved: ${((grandTotalOriginal - grandTotalOptimized) / 1024 / 1024).toFixed(1)}MB (${totalSavings}%)`);
  } else {
    console.log('\n⚠️  No images found to optimize');
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
