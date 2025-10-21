/**
 * Update Image References Script
 * Replaces .png with .webp in all service config files
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const CONFIG_DIR = 'src/configs/services';

async function updateFile(filePath) {
  const content = await readFile(filePath, 'utf-8');

  // Replace .png with .webp in icon paths
  const updated = content
    .replace(/icon: "\/icons\/([^"]+)\.png"/g, 'icon: "/icons/$1.webp"')
    .replace(/icon: "\/photos\/([^"]+)\.png"/g, 'icon: "/photos/$1.webp"');

  if (content !== updated) {
    await writeFile(filePath, updated, 'utf-8');
    return true;
  }

  return false;
}

async function main() {
  console.log('🔄 Updating image references in service configs...\n');

  const files = await readdir(CONFIG_DIR);
  let updated = 0;

  for (const file of files) {
    if (file.endsWith('.config.ts')) {
      const filePath = join(CONFIG_DIR, file);
      const wasUpdated = await updateFile(filePath);

      if (wasUpdated) {
        console.log(`✅ Updated: ${file}`);
        updated++;
      } else {
        console.log(`⏭️  Skipped: ${file} (no changes needed)`);
      }
    }
  }

  console.log(`\n✨ Done! ${updated} file(s) updated.`);
}

main().catch(console.error);
