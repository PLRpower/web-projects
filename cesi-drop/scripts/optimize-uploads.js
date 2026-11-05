import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Script d'optimisation des photos originales existantes.
 * Permet de convertir les fichiers originaux bruts (15-25 Mo chacun)
 * en versions 4K Ultra HD optimisées (1-2 Mo chacune, qualité 88).
 * 
 * Usage :
 *   node scripts/optimize-uploads.js            # Mode simulation (affiche les gains potentiels sans toucher aux fichiers)
 *   node scripts/optimize-uploads.js --apply    # Applique réellement l'optimisation
 */

const isApply = process.argv.includes('--apply');
const uploadsDir = fs.existsSync(path.resolve('uploads'))
  ? path.resolve('uploads')
  : path.resolve('../uploads');

console.log('='.repeat(60));
console.log(`📁 Dossier d'uploads cible : ${uploadsDir}`);
console.log(`⚙️  Mode : ${isApply ? '🚀 APPLICATION RÉELLE' : '🔍 SIMULATION (--apply pour exécuter)'}`);
console.log('='.repeat(60));

if (!fs.existsSync(uploadsDir)) {
  console.error(`❌ Le dossier ${uploadsDir} n'existe pas.`);
  process.exit(1);
}

async function run() {
  const allFiles = fs.readdirSync(uploadsDir);
  const originalFiles = allFiles.filter(f => f.includes('_original.'));

  console.log(`📊 Trouvé ${originalFiles.length} fichiers originaux à analyser.\n`);

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;
  let processedCount = 0;
  let skippedCount = 0;

  for (const filename of originalFiles) {
    const filePath = path.join(uploadsDir, filename);
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;
    totalOriginalBytes += originalSize;

    // Si le fichier pèse moins de 1.5 Mo, il est déjà assez compact
    if (originalSize < 1.5 * 1024 * 1024) {
      totalOptimizedBytes += originalSize;
      skippedCount++;
      continue;
    }

    try {
      // Test de compression en mémoire pour mesurer la taille
      const tempPath = path.join(uploadsDir, `temp_${filename}`);
      
      const ext = path.extname(filename).toLowerCase();
      let pipeline = sharp(filePath).rotate().resize(3840, 3840, {
        fit: 'inside',
        withoutEnlargement: true,
      });

      if (ext === '.png') {
        await pipeline.png({ quality: 90, compressionLevel: 8 }).toFile(tempPath);
      } else if (ext === '.webp') {
        await pipeline.webp({ quality: 90, effort: 4 }).toFile(tempPath);
      } else {
        await pipeline.jpeg({ quality: 88, mozjpeg: true }).toFile(tempPath);
      }

      const newSize = fs.statSync(tempPath).size;

      if (newSize < originalSize) {
        totalOptimizedBytes += newSize;
        processedCount++;

        if (isApply) {
          // Remplacer l'original par la version optimisée
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);
        } else {
          // En mode simulation, supprimer le fichier temporaire
          fs.unlinkSync(tempPath);
        }
      } else {
        totalOptimizedBytes += originalSize;
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }

      if ((processedCount + skippedCount) % 25 === 0 || processedCount <= 5) {
        const pctGain = ((1 - totalOptimizedBytes / totalOriginalBytes) * 100).toFixed(1);
        console.log(`[${processedCount + skippedCount}/${originalFiles.length}] Traité: ${(originalSize / 1024 / 1024).toFixed(1)} Mo -> ${(newSize / 1024 / 1024).toFixed(1)} Mo (Gain cumulé: ${pctGain}%)`);
      }
    } catch (err) {
      console.warn(`⚠️ Impossible de traiter ${filename}:`, err.message);
      totalOptimizedBytes += originalSize;
    }
  }

  const origGB = (totalOriginalBytes / 1024 / 1024 / 1024).toFixed(2);
  const newGB = (totalOptimizedBytes / 1024 / 1024 / 1024).toFixed(2);
  const gainGB = ((totalOriginalBytes - totalOptimizedBytes) / 1024 / 1024 / 1024).toFixed(2);
  const gainPct = ((1 - totalOptimizedBytes / totalOriginalBytes) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('🎉 BILAN DE L\'OPTIMISATION :');
  console.log(`   Poids initial       : ${origGB} Go`);
  console.log(`   Poids estimé/final  : ${newGB} Go`);
  console.log(`   Espace libéré       : ${gainGB} Go (-${gainPct}%)`);
  console.log('='.repeat(60));

  if (!isApply) {
    console.log('\n💡 Pour appliquer réellement ces compressions, lancez :');
    console.log('   node scripts/optimize-uploads.js --apply\n');
  }
}

run().catch(console.error);
