import Media from '#models/media';
import Category from '#models/category';
import uploadService from '#services/upload_service';
import fs from 'node:fs';
import { DateTime } from 'luxon';
import { ZipArchive } from 'archiver';

export default class MediaController {
  async afficher({ view, request, response, auth }) {
    // Cloudflare Edge Cache headers (public vs authenticated)
    if (auth && auth.isAuthenticated) {
      response.header('Cache-Control', 'private, no-cache, no-store');
    } else {
      response.header('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
      response.header('CDN-Cache-Control', 'max-age=300, stale-while-revalidate=86400');
      response.header('Vary', 'Accept, Accept-Encoding');
    }

    const page = Number(request.input('page', 1));
    const limit = 24;

    const paginatedMedias = await Media.query()
      .where('accueil', true)
      .where('published', true)
      .orderBy('id', 'desc')
      .paginate(page, limit);

    const categories = await Category.all();

    const formatMedia = (m) => {
      const w = m.width || 1080;
      const h = m.height || 720;
      return {
        id: m.id,
        extname: m.extname,
        width: w,
        height: h,
        ratio: Number((w / h).toFixed(3)),
        isPortrait: w < h,
      };
    };

    if (request.header('accept')?.includes('application/json') || request.input('json')) {
      return response.json({
        data: paginatedMedias.all().map(formatMedia),
        meta: paginatedMedias.getMeta(),
      });
    }

    return view.render('pages/accueil', {
      medias: paginatedMedias.all().map(formatMedia),
      pagination: paginatedMedias.getMeta(),
      categories: categories,
    });
  }

  async categorie({ view, params, request, response, auth }) {
    // Cloudflare Edge Cache headers (public vs authenticated)
    if (auth && auth.isAuthenticated) {
      response.header('Cache-Control', 'private, no-cache, no-store');
    } else {
      response.header('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
      response.header('CDN-Cache-Control', 'max-age=300, stale-while-revalidate=86400');
      response.header('Vary', 'Accept, Accept-Encoding');
    }

    const categorie = await Category.findOrFail(params.id);
    const page = Number(request.input('page', 1));
    const limit = 24;

    const paginatedMedias = await categorie
      .related('medias')
      .query()
      .where('published', true)
      .orderBy('id', 'desc')
      .paginate(page, limit);

    const formatMedia = (m) => {
      const w = m.width || 1080;
      const h = m.height || 720;
      return {
        id: m.id,
        extname: m.extname,
        width: w,
        height: h,
        ratio: Number((w / h).toFixed(3)),
        isPortrait: w < h,
      };
    };

    if (request.header('accept')?.includes('application/json') || request.input('json')) {
      return response.json({
        data: paginatedMedias.all().map(formatMedia),
        meta: paginatedMedias.getMeta(),
      });
    }

    return view.render('pages/categorie', {
      categorie: categorie,
      medias: paginatedMedias.all().map(formatMedia),
      pagination: paginatedMedias.getMeta(),
    });
  }

  async publier({ request, response }) {
    const files = request.files('filepond') || request.files('files');
    if (!files || files.length === 0) {
      return response.badRequest({ message: 'Aucun fichier reçu' });
    }

    const createdMedias = [];
    for (const rawFile of files) {
      const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;
      if (!file || !file.tmpPath) continue;

      const media = await Media.create({
        extname: file.extname || 'jpg',
        published: false,
        accueil: false,
      });

      const processed = await uploadService.processPhoto(file.tmpPath, media.id, file.extname || 'jpg');
      media.width = processed.width;
      media.height = processed.height;
      await media.save();

      createdMedias.push(media.id);
    }

    return response.ok({
      status: 'success',
      count: createdMedias.length,
      ids: createdMedias,
    });
  }

  async telechargerSelection({ request, response }) {
    let ids = request.input('ids');
    if (!ids) {
      return response.badRequest('Aucune photo sélectionnée');
    }

    let idList = [];
    if (Array.isArray(ids)) {
      idList = ids.map(Number).filter((n) => Number.isInteger(n) && n > 0);
    } else if (typeof ids === 'string') {
      idList = ids
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0);
    }

    if (idList.length === 0) {
      return response.badRequest('Liste de photos invalide');
    }

    // Maximum 200 photos per zip
    if (idList.length > 200) {
      idList = idList.slice(0, 200);
    }

    const medias = await Media.query().whereIn('id', idList).where('published', true);

    if (medias.length === 0) {
      return response.notFound('Aucune photo trouvée');
    }

    const categoryTitle = request.input('title');
    const safeTitle = categoryTitle
      ? categoryTitle
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : 'photos';

    const dateStr = DateTime.now().toFormat('yyyy-MM-dd');
    const zipFileName = `cesi-drop-${safeTitle}-${dateStr}.zip`;

    // Fast ZIP packing without recompression (photos already compressed WebP/JPEG, saves RPi CPU)
    const archive = new ZipArchive({ zlib: { level: 0 } });

    archive.on('error', (err) => {
      console.error('Erreur génération ZIP:', err);
    });

    response.header('Content-Type', 'application/zip');
    response.header('Content-Disposition', `attachment; filename="${zipFileName}"`);

    response.stream(archive);

    for (const media of medias) {
      let filePath = uploadService.getFilePath(`${media.id}_original.${media.extname}`);
      let fileName = `cesi-drop-${media.id}.${media.extname}`;

      if (!fs.existsSync(filePath)) {
        filePath = uploadService.getFilePath(`${media.id}.webp`);
        fileName = `cesi-drop-${media.id}.webp`;
      }

      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: fileName });
      }
    }

    await archive.finalize();
  }

  async signaler({ request, response }) {
    const mediaId = request.input('mediaId') || request.input('imageId');
    const motif = request.input('motif', 'Droit à l\'image (demande de retrait)');
    const details = request.input('details', 'Non précisé');
    const contact = request.input('contact', 'Non renseigné');

    if (!mediaId) {
      return response.badRequest({ message: 'Identifiant de la photo manquant.' });
    }

    const webhookUrl =
      process.env.DISCORD_REPORT_WEBHOOK ||
      'https://discord.com/api/webhooks/1567943103200108605/j12N0HN3mZewfWFIQkes9H8MQyhbT61s7SsAmLPjLS9-Z3CSBjcwuxAqfp0MfCjLfYqE';

    const baseUrl = request.completeUrl().split('/signaler')[0];
    const photoUrl = `${baseUrl}/uploads/${mediaId}.webp`;
    const galleryUrl = `${baseUrl}/#photo=${mediaId}`;

    const embed = {
      title: `Signalement reçu — Photo #${mediaId}`,
      color: 0xe02424,
      fields: [
        { name: 'Identifiant', value: `Photo #${mediaId}`, inline: true },
        { name: 'Motif', value: String(motif), inline: true },
        { name: 'Contact fourni', value: String(contact || 'Aucun contact laissé'), inline: false },
        { name: 'Précisions / Message', value: String(details || 'Aucune précision'), inline: false },
        { name: 'Voir la photo sur le site', value: `[Ouvrir la photo dans la galerie](${galleryUrl})`, inline: false },
      ],
      image: {
        url: photoUrl,
      },
      timestamp: new Date().toISOString(),
      footer: {
        text: 'CESI Drop • Modération des signalements',
      },
    };

    try {
      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Nouveau signalement déposé pour la **Photo #${mediaId}** : ${motif}`,
          embeds: [embed],
        }),
      });

      if (!webhookRes.ok) {
        console.error('Erreur webhook Discord status:', webhookRes.status);
      }
    } catch (e) {
      console.error('Erreur lors de l\'envoi du webhook Discord:', e);
    }

    return response.json({
      success: true,
      message: 'Votre signalement a été transmis avec succès à l\'équipe de modération.',
    });
  }
}