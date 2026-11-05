import Media from '#models/media';
import Category from '#models/category';
import uploadService from '#services/upload_service';

export default class AdminController {
  async index({ view }) {
    const pendingCount = await Media.query().where('published', false).count('* as total');
    const totalCount = await Media.query().count('* as total');
    const categoriesCount = await Category.query().count('* as total');

    return view.render('pages/admin', {
      stats: {
        pending: pendingCount[0]?.$extras?.total || 0,
        total: totalCount[0]?.$extras?.total || 0,
        categories: categoriesCount[0]?.$extras?.total || 0,
      },
    });
  }

  async publier({ view }) {
    const categories = await Category.all();
    return view.render('pages/admin-publier', { categories: categories });
  }

  async publier_post({ request, response }) {
    const files = request.files('filepond') || request.files('files');
    if (!files || files.length === 0) {
      return response.badRequest({ message: 'Aucun fichier reçu' });
    }

    const categoryId = request.input('category') || null;
    const createdIds = [];

    for (const rawFile of files) {
      const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;
      if (!file || !file.tmpPath) continue;

      const media = await Media.create({
        published: true,
        categoryId: categoryId ? Number(categoryId) : null,
        extname: file.extname || 'jpg',
      });
      const processed = await uploadService.processPhoto(file.tmpPath, media.id, file.extname || 'jpg');
      media.width = processed.width;
      media.height = processed.height;
      await media.save();

      createdIds.push(media.id);
    }

    return response.ok({ status: 'success', count: createdIds.length, ids: createdIds });
  }

  async moderer({ view }) {
    const medias = await Media.query().where('published', false).orderBy('id', 'desc');
    const categories = await Category.all();
    return view.render('pages/admin-moderer', { medias: medias, categories: categories });
  }

  async moderer_post({ request, response }) {
    const images = request.input('selected_images');
    const action = request.input('action');

    if (!images || !Array.isArray(images) || images.length === 0) {
      return response.redirect().back();
    }

    if (action === 'remove') {
      for (const imageId of images) {
        const media = await Media.find(imageId);
        if (media) {
          uploadService.deleteMediaFiles(media.id, media.extname);
          await media.delete();
        }
      }
    } else if (action === 'add') {
      for (const imageId of images) {
        const media = await Media.find(imageId);
        if (media) {
          media.published = true;
          await media.save();
        }
      }
    } else {
      // action is a category id
      for (const imageId of images) {
        const media = await Media.find(imageId);
        if (media) {
          media.categoryId = Number(action);
          media.published = true;
          await media.save();
        }
      }
    }

    return response.redirect().toRoute('admin.moderer');
  }

  async choisir({ view }) {
    const medias = await Media.query().where('published', true).orderBy('id', 'desc');
    return view.render('pages/admin-choisir', { medias: medias });
  }

  async choisir_post({ request, response }) {
    const images = request.input('selected_images') || [];

    // Reset all to not featured on accueil
    await Media.query().update({ accueil: false });

    if (Array.isArray(images) && images.length > 0) {
      await Media.query().whereIn('id', images).update({ accueil: true });
    }

    return response.redirect().toRoute('accueil');
  }

  async supprimer_post({ request, response }) {
    const imageId = request.input('imageId');
    const media = await Media.find(imageId);
    if (media) {
      uploadService.deleteMediaFiles(media.id, media.extname);
      await media.delete();
    }
    return response.redirect().back();
  }
}