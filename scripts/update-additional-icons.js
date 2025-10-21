/**
 * Script para actualizar iconos adicionales usando los SVG disponibles
 * Segunda fase: Reemplazar emojis y iconos genéricos restantes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Mapeo adicional de servicios específicos a iconos SVG
const additionalMappings = {
  // Web Development - Tools (reemplazar emojis por SVG)
  'TypeScript': { oldIcon: '🔷', newIcon: '/icons/typescript-official-svgrepo-com.svg' },
  'PostgreSQL': { oldIcon: '🗄️', newIcon: '/icons/postgresql-logo-svgrepo-com.svg' },
  'AWS / Vercel': { oldIcon: '☁️', newIcon: '/icons/aws-svgrepo-com.svg' },
  'GraphQL': { oldIcon: '🔺', newIcon: '/icons/graphql-svgrepo-com.svg' },

  // SEO - Servicios que aún usan seo.webp genérico
  'Technical SEO Audit': { oldIcon: '/icons/seo.webp', newIcon: '/icons/system-search-svgrepo-com.svg' },
  'Keyword Research': { oldIcon: '/icons/seo.webp', newIcon: '/icons/tags-discount-seo-svgrepo-com.svg' },
  'On-Page Optimization': { oldIcon: '/icons/seo.webp', newIcon: '/icons/website-seo-promotion-svgrepo-com.svg' },
  'Content Strategy': { oldIcon: '/icons/seo.webp', newIcon: '/icons/case-ppt-svgrepo-com.svg' },
  'Link Building': { oldIcon: '/icons/seo.webp', newIcon: '/icons/planet-space-svgrepo-com.svg' },
  'Competitor Analysis': { oldIcon: '/icons/seo.webp', newIcon: '/icons/data-graphics-analysis-svgrepo-com.svg' },
  'E-commerce SEO': { oldIcon: '/icons/seo.webp', newIcon: '/icons/ecommerce-website-commerce-and-shopping-2-svgrepo-com.svg' },

  // Branding - Servicios que usan diseno-grafico.webp genérico
  'Packaging Design': { oldIcon: '/icons/diseno-grafico.webp', newIcon: '/icons/balloon-business-svgrepo-com.svg' },
  'Marketing Collateral': { oldIcon: '/icons/diseno-grafico.webp', newIcon: '/icons/horn-marketing-trumpet-svgrepo-com.svg' },
  'Brand Collateral': { oldIcon: '/icons/diseno-grafico.webp', newIcon: '/icons/case-ppt-svgrepo-com.svg' },
  'Style Guides': { oldIcon: '/icons/diseno-grafico.webp', newIcon: '/icons/case-ppt-svgrepo-com.svg' },

  // Promotional Products
  'Event Giveaways': { oldIcon: '/icons/camiseta.webp', newIcon: '/icons/christmas-sales-shopping-svgrepo-com.svg' },
  'Business Cards': { oldIcon: '/icons/camiseta.webp', newIcon: '/icons/case-ppt-svgrepo-com.svg' },
  'Stickers & Decals': { oldIcon: '/icons/camiseta.webp', newIcon: '/icons/discount-label-svgrepo-com.svg' },
  'Promotional Pens': { oldIcon: '/icons/camiseta.webp', newIcon: '/icons/creativity-svgrepo-com.svg' },
  'Vinyl Cutting & Decals': { oldIcon: '/icons/camiseta.webp', newIcon: '/icons/discount-label-svgrepo-com.svg' },
  'Packaging & Labels': { oldIcon: '/icons/camiseta.webp', newIcon: '/icons/balloon-business-svgrepo-com.svg' },

  // Animation - Servicios que usan animacion.webp genérico
  '2D Motion Graphics': { oldIcon: '/icons/animacion.webp', newIcon: '/icons/creativity-svgrepo-com.svg' },
  'Product Visualization': { oldIcon: '/icons/animacion.webp', newIcon: '/icons/balloon-business-svgrepo-com.svg' },
  'Social Media Animations': { oldIcon: '/icons/animacion.webp', newIcon: '/icons/redes-sociales.webp' },

  // 3D Rendering
  'Interior Design': { oldIcon: '/icons/modelo-3d.webp', newIcon: '/icons/computer-monitor-svgrepo-com.svg' },
  'Architectural Visualization': { oldIcon: '/icons/modelo-3d.webp', newIcon: '/icons/computer-monitor-svgrepo-com.svg' },
};

// Función para actualizar iconos basándose en nombre del servicio/tool
function updateIconsByName(filePath) {
  console.log(`\n📝 Procesando: ${path.basename(filePath)}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  let changes = 0;

  // Para cada mapeo, buscar y reemplazar
  for (const [itemName, iconData] of Object.entries(additionalMappings)) {
    const { oldIcon, newIcon } = iconData;

    // Pattern para encontrar por name (para tools section)
    const namePattern = new RegExp(
      `(name:\\s*"${itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",[\\s\\S]*?icon:\\s*")([^"]+)(")`
    , 'g');

    // Pattern para encontrar por title (para services section)
    const titlePattern = new RegExp(
      `(title:\\s*"${itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",[\\s\\S]*?icon:\\s*")([^"]+)(")`
    , 'g');

    let newContent = content;

    // Intentar ambos patterns
    [namePattern, titlePattern].forEach(pattern => {
      newContent = newContent.replace(pattern, (match, before, currentIcon, after) => {
        if (currentIcon === oldIcon) {
          console.log(`  ✅ ${itemName}`);
          console.log(`     ${oldIcon} → ${newIcon}`);
          changes++;
          updated = true;
          return before + newIcon + after;
        }
        return match;
      });
    });

    content = newContent;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\n✨ ${changes} iconos actualizados en ${path.basename(filePath)}`);
  } else {
    console.log(`  ⏭️  No se encontraron coincidencias para actualizar`);
  }

  return changes;
}

// Main
const configsDir = path.join(projectRoot, 'src', 'configs', 'services');
const files = fs.readdirSync(configsDir)
  .filter(file => file.endsWith('.config.ts'))
  .map(file => path.join(configsDir, file));

console.log('🎨 Actualizando iconos adicionales con SVG específicos...\n');
console.log(`📁 Procesando ${files.length} archivos de configuración\n`);
console.log('🔄 Reemplazando:');
console.log('   - Emojis → Iconos SVG profesionales');
console.log('   - Iconos genéricos → Iconos específicos');
console.log('');

let totalChanges = 0;

files.forEach(file => {
  totalChanges += updateIconsByName(file);
});

console.log('\n' + '='.repeat(60));
console.log(`\n🎉 ¡Completado! Total de cambios adicionales: ${totalChanges}`);
console.log('\n💡 Mejoras aplicadas:');
console.log('   ✅ Emojis reemplazados por SVG profesionales');
console.log('   ✅ Iconos genéricos reemplazados por específicos');
console.log('   ✅ Mejor consistencia visual en todo el sitio');
console.log('   ✅ Escalabilidad perfecta en cualquier resolución');
console.log('\n📊 Iconos SVG ahora utilizados:');
console.log('   - TypeScript, PostgreSQL, AWS, GraphQL');
console.log('   - Christmas sales, Discount labels');
console.log('   - System search, Data analytics');
console.log('\n' + '='.repeat(60));
