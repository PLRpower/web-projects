import Category from '#models/category';
import uploadService from '#services/upload_service';

export default class CategoriesController {
  async creer({ view }) {
    return view.render('pages/admin-categorie');
  }

  async creer_post({ response, request }) {
    const title = request.input('title');
    const description = request.input('description');

    const category = await Category.create({
      title: title,
      description: description,
    });
    await category.save();

    const file = request.file('thumbnail');
    if (file && file.tmpPath) {
      await uploadService.processCategoryThumbnail(file.tmpPath, category.id);
    }

    return response.redirect().toRoute('admin.modifier.cat');
  }

  async modifier({ view, params }) {
    const categorie = await Category.findOrFail(params.id);
    return view.render('pages/admin-modifier', { categorie: categorie });
  }

  async modifier_post({ request, params, response }) {
    const categorie = await Category.findOrFail(params.id);
    categorie.title = request.input('title');
    categorie.description = request.input('description');
    await categorie.save();

    const file = request.file('thumbnail');
    if (file && file.tmpPath) {
      await uploadService.processCategoryThumbnail(file.tmpPath, categorie.id);
    }

    return response.redirect().toRoute('admin.modifier.cat');
  }

  async modifier_cat({ view }) {
    const categories = await Category.query().orderBy('id', 'desc');
    return view.render('pages/admin-modifier-cat', { categories: categories });
  }

  async supprimer_post({ params, response }) {
    const category = await Category.findOrFail(params.id);
    const relatedMedias = await category.related('medias').query();

    for (const media of relatedMedias) {
      uploadService.deleteMediaFiles(media.id, media.extname);
      await media.delete();
    }

    uploadService.deleteCategoryFile(category.id);
    await category.delete();

    return response.redirect().toRoute('admin.modifier.cat');
  }
}