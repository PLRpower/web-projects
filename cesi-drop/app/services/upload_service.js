import app from '@adonisjs/core/services/app';
import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';

// Raspberry Pi 4 CPU & RAM safeguards:
// 1. Limit libvips concurrency to 2 threads to prevent 100% CPU lock and thermal throttling
sharp.concurrency(2);
// 2. Bound memory cache to prevent memory spikes on low-RAM hosts
sharp.cache({ memory: 64, files: 20, items: 100 });

class UploadService {
  getUploadsDir(...subpaths) {
    let baseDir = process.env.UPLOADS_PATH;
    if (!baseDir) {
      if (fs.existsSync(app.makePath('../uploads'))) {
        baseDir = app.makePath('../uploads');
      } else {
        baseDir = app.makePath('uploads');
      }
    }
    const targetDir = path.resolve(baseDir, ...subpaths);
    if (!fs.existsSync(targetDir) && subpaths.length > 0) {
      try {
        fs.mkdirSync(targetDir, { recursive: true });
      } catch (e) {}
    }
    return targetDir;
  }

  getFilePath(filename) {
    return path.join(this.getUploadsDir(), filename);
  }

  getCategoryFilePath(filename) {
    return path.join(this.getUploadsDir('categories'), filename);
  }

  /**
   * Process uploaded photo:
   * 1. Creates optimized WebP thumbnail/display version (1600px max, q82)
   * 2. Creates optimized original version for downloads (3840px 4K max, q88-90)
   * Result: crystal clear 4K downloads, fast loading gallery, 80-90% less disk space.
   */
  async processPhoto(tmpPath, mediaId, extname) {
    const webpPath = this.getFilePath(`${mediaId}.webp`);
    const originalPath = this.getFilePath(`${mediaId}_original.${extname}`);

    // 1. WebP version for web gallery & lightbox
    await sharp(tmpPath)
      .rotate()
      .resize(1600, 1600, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toFile(webpPath);

    // 2. High fidelity original version for download (optimized 4K)
    const ext = (extname || 'jpg').toLowerCase();
    if (ext === 'png') {
      await sharp(tmpPath)
        .rotate()
        .resize(3840, 3840, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .png({ quality: 90, compressionLevel: 8 })
        .toFile(originalPath);
    } else if (ext === 'webp') {
      await sharp(tmpPath)
        .rotate()
        .resize(3840, 3840, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .webp({ quality: 90, effort: 4 })
        .toFile(originalPath);
    } else {
      // Default to JPEG high quality 4K (fast encoding for ARM/Pi 4)
      await sharp(tmpPath)
        .rotate()
        .resize(3840, 3840, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .jpeg({ quality: 86, mozjpeg: false })
        .toFile(originalPath);
    }

    const meta = await sharp(webpPath).metadata();

    return {
      webpPath,
      originalPath,
      width: meta.width || 1080,
      height: meta.height || 720,
    };
  }

  /**
   * Process category thumbnail (600x900 cover)
   */
  async processCategoryThumbnail(tmpPath, categoryId) {
    const outputPath = this.getCategoryFilePath(`${categoryId}.webp`);
    await sharp(tmpPath)
      .rotate()
      .resize({
        width: 600,
        height: 900,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
    return outputPath;
  }

  /**
   * Apply Studio CESI watermark in the bottom-right corner and return a JPEG buffer
   */
  async applyWatermark(filePath) {
    const baseImage = sharp(filePath).rotate().flatten({ background: '#ffffff' });
    const { data: baseBuffer, info } = await baseImage.toBuffer({ resolveWithObject: true });

    const watermarkPath = app.makePath('public/studio-cesi-logo.png');
    if (!fs.existsSync(watermarkPath)) {
      return sharp(baseBuffer).jpeg({ quality: 90 }).toBuffer();
    }

    const imgWidth = info.width || 1600;
    const imgHeight = info.height || 1080;

    // Proportional watermark width (~14% of photo width, clamped between 90px and 340px)
    const targetWmWidth = Math.round(Math.min(Math.max(imgWidth * 0.14, 90), 340));
    const padX = Math.round(targetWmWidth * 0.12);
    const padY = Math.round(targetWmWidth * 0.08);

    const { data: logoBuffer, info: logoInfo } = await sharp(watermarkPath)
      .trim()
      .resize({ width: targetWmWidth, withoutEnlargement: true })
      .png()
      .toBuffer({ resolveWithObject: true });

    const badgeWidth = logoInfo.width + padX * 2;
    const badgeHeight = logoInfo.height + padY * 2;
    const radius = Math.round(Math.min(badgeWidth, badgeHeight) * 0.16);

    const badgeSvg = Buffer.from(
      `<svg width="${badgeWidth}" height="${badgeHeight}" xmlns="http://www.w3.org/2000/svg">` +
        `<rect x="0" y="0" width="${badgeWidth}" height="${badgeHeight}" rx="${radius}" ry="${radius}" fill="rgba(255,255,255,0.85)"/>` +
      `</svg>`
    );

    const watermarkBadge = await sharp(badgeSvg)
      .composite([{ input: logoBuffer, left: padX, top: padY }])
      .png()
      .toBuffer();

    const margin = Math.round(Math.min(imgWidth, imgHeight) * 0.025);
    const left = Math.max(0, imgWidth - badgeWidth - margin);
    const top = Math.max(0, imgHeight - badgeHeight - margin);

    return sharp(baseBuffer)
      .composite([{ input: watermarkBadge, left, top }])
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  deleteMediaFiles(mediaId, extname) {
    const webpPath = this.getFilePath(`${mediaId}.webp`);
    const origPath = this.getFilePath(`${mediaId}_original.${extname}`);
    if (fs.existsSync(webpPath)) {
      try { fs.unlinkSync(webpPath); } catch (e) {}
    }
    if (fs.existsSync(origPath)) {
      try { fs.unlinkSync(origPath); } catch (e) {}
    }
  }

  deleteCategoryFile(categoryId) {
    const catPath = this.getCategoryFilePath(`${categoryId}.webp`);
    if (fs.existsSync(catPath)) {
      try { fs.unlinkSync(catPath); } catch (e) {}
    }
  }
}

export default new UploadService();
