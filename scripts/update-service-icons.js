/**
 * Script para actualizar los iconos de los servicios con iconos SVG más específicos
 * Los nuevos iconos SVG proporcionan mejor variedad visual
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Mapeo de servicios específicos a iconos SVG apropiados
const iconMappings = {
  // Web Development
  'Custom Website Development': '/icons/website-program-svgrepo-com.svg',
  'Responsive Web Design': '/icons/responsive-svgrepo-com.svg',
  'SEO-Optimized Development': '/icons/website-seo-promotion-svgrepo-com.svg',
  'E-commerce Solutions': '/icons/ecommerce-website-commerce-and-shopping-2-svgrepo-com.svg',
  'Web Applications': '/icons/platform-program-svgrepo-com.svg',
  'Progressive Web Apps (PWA)': '/icons/mobile-phone-app-svgrepo-com.svg',
  'Website Maintenance & Support': '/icons/support-svgrepo-com.svg',
  'API Development & Integration': '/icons/graphql-svgrepo-com.svg',
  'Website Migration & Redesign': '/icons/web-browsing-svgrepo-com.svg',

  // SEO
  'Keyword Research & Strategy': '/icons/system-search-svgrepo-com.svg',
  'On-Page SEO': '/icons/tags-discount-seo-svgrepo-com.svg',
  'Technical SEO': '/icons/cpu-processor-hardware-chip-microchip-svgrepo-com.svg',
  'Content Marketing': '/icons/case-ppt-svgrepo-com.svg',
  'Link Building': '/icons/planet-space-svgrepo-com.svg',
  'Local SEO': '/icons/map-service-ocean-svgrepo-com.svg',
  'SEO Audits': '/icons/data-graphics-analysis-svgrepo-com.svg',
  'E-commerce SEO': '/icons/ecommerce-website-commerce-and-shopping-2-svgrepo-com.svg',
  'SEO Reporting & Analytics': '/icons/financial-report-svgrepo-com.svg',

  // Social Media
  'Social Media Strategy': '/icons/target-focus-svgrepo-com.svg',
  'Content Creation': '/icons/creativity-svgrepo-com.svg',
  'Community Management': '/icons/talk-talk-svgrepo-com.svg',
  'Paid Social Advertising': '/icons/horn-marketing-trumpet-svgrepo-com.svg',
  'Influencer Marketing': '/icons/balloon-business-svgrepo-com.svg',
  'Social Media Analytics': '/icons/data-graphics-analysis-svgrepo-com.svg',
  'Platform Management': '/icons/operating-system-svgrepo-com.svg',
  'Social Listening': '/icons/response-monitoring-svgrepo-com.svg',
  'Viral Campaigns': '/icons/earth-planet-svgrepo-com.svg',

  // UX/UI Design
  'User Research & Analysis': '/icons/brainstorming-svgrepo-com.svg',
  'Information Architecture': '/icons/the-upper-and-lower-levels-of-the-company-employees-boss-structure-management-svgrepo-com.svg',
  'Wireframing': '/icons/computer-monitor-svgrepo-com.svg',
  'Interactive Prototyping': '/icons/untact-app-mobile-svgrepo-com.svg',
  'UI Design': '/icons/interfaz-de-usuario.webp',
  'Design Systems': '/icons/platform-program-svgrepo-com.svg',
  'Usability Testing': '/icons/system-search-svgrepo-com.svg',
  'Mobile App Design': '/icons/mobile-phone-app-svgrepo-com.svg',
  'Web Application Design': '/icons/web-browsing-svgrepo-com.svg',

  // Video Production
  'Corporate Videos': '/icons/case-ppt-svgrepo-com.svg',
  'Social Media Content': '/icons/redes-sociales.webp',
  'Commercial Advertising': '/icons/horn-marketing-trumpet-svgrepo-com.svg',
  'Product Demos': '/icons/balloon-business-svgrepo-com.svg',
  'Event Coverage': '/icons/earth-planet-svgrepo-com.svg',
  'Explainer Videos': '/icons/light-bulb-idea-people-svgrepo-com.svg',
  'YouTube Content': '/icons/edicion-de-video.webp',
  'Motion Graphics': '/icons/animacion.webp',
  'Color Grading': '/icons/creativity-svgrepo-com.svg',

  // Branding
  'Brand Strategy': '/icons/target-focus-svgrepo-com.svg',
  'Logo Design': '/icons/creativity-svgrepo-com.svg',
  'Brand Identity': '/icons/diseno-grafico.webp',
  'Brand Guidelines': '/icons/case-ppt-svgrepo-com.svg',
  'Rebranding': '/icons/brainstorming-svgrepo-com.svg',
  'Packaging Design': '/icons/balloon-business-svgrepo-com.svg',
  'Marketing Collateral': '/icons/horn-marketing-trumpet-svgrepo-com.svg',
  'Social Media Branding': '/icons/redes-sociales.webp',
  'Brand Consultation': '/icons/collaboration-svgrepo-com.svg',

  // 3D Rendering
  'Architectural Visualization': '/icons/modelo-3d.webp',
  'Product Rendering': '/icons/balloon-business-svgrepo-com.svg',
  'Interior Design': '/icons/computer-monitor-svgrepo-com.svg',
  'Exterior Visualization': '/icons/earth-planet-svgrepo-com.svg',
  '360° Virtual Tours': '/icons/planet-space-svgrepo-com.svg',
  'Photorealistic Rendering': '/icons/modelo-3d.webp',

  // Animation
  '2D Animation': '/icons/animacion.webp',
  '3D Animation': '/icons/modelo-3d.webp',
  'Motion Graphics': '/icons/animacion.webp',
  'Character Animation': '/icons/animacion.webp',
  'Explainer Videos': '/icons/light-bulb-idea-people-svgrepo-com.svg',
  'Logo Animation': '/icons/creativity-svgrepo-com.svg',
  'Product Animation': '/icons/balloon-business-svgrepo-com.svg',
  'Whiteboard Animation': '/icons/case-ppt-svgrepo-com.svg',
  'Social Media Animation': '/icons/redes-sociales.webp',

  // Promotional Products
  'Custom T-Shirts': '/icons/camiseta.webp',
  'Promotional Bags': '/icons/camiseta.webp',
  'Corporate Gifts': '/icons/balloon-business-svgrepo-com.svg',
  'Branded Merchandise': '/icons/diseno-grafico.webp',
  'Event Giveaways': '/icons/christmas-sales-shopping-svgrepo-com.svg',
  'Business Cards': '/icons/case-ppt-svgrepo-com.svg',
  'Stickers & Decals': '/icons/discount-label-svgrepo-com.svg',
  'Promotional Pens': '/icons/creativity-svgrepo-com.svg',
  'Custom Mugs': '/icons/camiseta.webp',
};

// Función para actualizar los iconos en un archivo de configuración
function updateIconsInFile(filePath) {
  console.log(`\n📝 Procesando: ${path.basename(filePath)}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  let changes = 0;

  // Para cada mapeo, buscar y reemplazar
  for (const [serviceName, iconPath] of Object.entries(iconMappings)) {
    // Pattern para encontrar el servicio y su icon
    const pattern = new RegExp(
      `(title:\\s*"${serviceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",[\\s\\S]*?icon:\\s*")([^"]+)(")`
    , 'g');

    const newContent = content.replace(pattern, (match, before, oldIcon, after) => {
      if (oldIcon !== iconPath) {
        console.log(`  ✅ ${serviceName}`);
        console.log(`     ${oldIcon} → ${iconPath}`);
        changes++;
        updated = true;
        return before + iconPath + after;
      }
      return match;
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

console.log('🎨 Actualizando iconos de servicios con nuevos SVG...\n');
console.log(`📁 Procesando ${files.length} archivos de configuración\n`);

let totalChanges = 0;

files.forEach(file => {
  totalChanges += updateIconsInFile(file);
});

console.log('\n' + '='.repeat(60));
console.log(`\n🎉 ¡Completado! Total de cambios: ${totalChanges}`);
console.log('\n💡 Los nuevos iconos SVG proporcionan:');
console.log('   - Mejor claridad visual');
console.log('   - Iconos específicos para cada servicio');
console.log('   - Tamaño de archivo más pequeño');
console.log('   - Escalabilidad perfecta en cualquier resolución');
console.log('\n' + '='.repeat(60));
