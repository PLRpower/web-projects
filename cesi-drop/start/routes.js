import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import uploadService from '#services/upload_service';
import fs from 'node:fs';

const MediaController = () => import('#controllers/media_controller');
const AuthController = () => import('#controllers/auth_controller');
const AdminController = () => import('#controllers/admin_controller');
const CategoriesController = () => import('#controllers/categories_controller');

// Public routes
router.get('/', [MediaController, 'afficher']).as('accueil');
router.on('/publier').render('pages/publier').as('publier');
router.get('/categorie/:id', [MediaController, 'categorie']).as('categorie');
router.post('/publier/post', [MediaController, 'publier']).as('publier.post');
router.get('/telecharger-selection', [MediaController, 'telechargerSelection']).as('media.telechargerSelection');
router.post('/telecharger-selection', [MediaController, 'telechargerSelection']);
router.post('/signaler', [MediaController, 'signaler']).as('media.signaler');

// Legal & Compliance routes (RGPD, CGU, Mentions Légales) - Edge cached 7 days
const legalCache = ({ response }, next) => {
  response.header('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  response.header('CDN-Cache-Control', 'max-age=604800');
  return next();
};
router.on('/mentions-legales').render('pages/mentions-legales').as('mentionsLegales').use(legalCache);
router.on('/confidentialite').render('pages/confidentialite').as('confidentialite').use(legalCache);
router.get('/rgpd', ({ response }) => response.redirect().toRoute('confidentialite'));
router.get('/cookies', ({ response }) => response.redirect().toPath('/confidentialite#cookies')).as('cookies');
router.on('/cgu').render('pages/cgu').as('cgu').use(legalCache);

// Auth routes
router.on('/connexion').render('pages/protected').as('connexion').use(middleware.guest());
router.get('/protege', ({ response }) => response.redirect().toRoute('connexion'));
router.post('/protege/post', [AuthController, 'connecter']).as('protege.post');
router.get('/logout', async ({ auth, response }) => {
  await auth.use('web').logout();
  return response.redirect().toRoute('accueil');
}).as('logout');

// Admin protected routes
router.get('/admin', [AdminController, 'index']).as('admin').use(middleware.auth());
router.get('/admin/moderer', [AdminController, 'moderer']).as('admin.moderer').use(middleware.auth());
router.post('/admin/moderer', [AdminController, 'moderer_post']).as('admin.moderer.post').use(middleware.auth());
router.get('/admin/publier', [AdminController, 'publier']).as('admin.publier').use(middleware.auth());
router.post('/admin/publier/post', [AdminController, 'publier_post']).as('admin.publier.post').use(middleware.auth());
router.get('/admin/categorie', [CategoriesController, 'creer']).as('admin.categorie').use(middleware.auth());
router.post('/admin/categorie/post', [CategoriesController, 'creer_post']).as('category.post').use(middleware.auth());
router.get('/admin/choisir', [AdminController, 'choisir']).as('admin.choisir').use(middleware.auth());
router.post('/admin/choisir', [AdminController, 'choisir_post']).as('admin.choisir.post').use(middleware.auth());
router.post('/admin/supprimer', [AdminController, 'supprimer_post']).as('admin.supprimer').use(middleware.auth());
router.get('/admin/modifier', [CategoriesController, 'modifier_cat']).as('admin.modifier.cat').use(middleware.auth());
router.get('/admin/modifier/:id', [CategoriesController, 'modifier']).as('admin.modifier').use(middleware.auth());
router.post('/admin/modifier/:id', [CategoriesController, 'modifier_post']).as('admin.modifier.post').use(middleware.auth());
router.post('/admin/supprimer-cat/:id', [CategoriesController, 'supprimer_post']).as('admin.supprimer.cat').use(middleware.auth());

// Serving uploads with long-term immutable caching (CDN / Cloudflare / Browser friendly)
router.get('/uploads/:filename', async ({ response, params }) => {
  const filePath = uploadService.getFilePath(params.filename);
  if (!fs.existsSync(filePath)) {
    return response.notFound('Fichier introuvable');
  }
  response.header('Cache-Control', 'public, max-age=31536000, immutable');
  response.header('CDN-Cache-Control', 'max-age=31536000');
  return response.download(filePath, true);
});

router.get('/uploads/categories/:filename', async ({ response, params }) => {
  const filePath = uploadService.getCategoryFilePath(params.filename);
  if (!fs.existsSync(filePath)) {
    return response.notFound('Fichier introuvable');
  }
  response.header('Cache-Control', 'public, max-age=31536000, immutable');
  response.header('CDN-Cache-Control', 'max-age=31536000');
  return response.download(filePath, true);
});

// Social shortcuts
router.get('/discord', async ({ response }) => {
  response.redirect().toPath('https://discord.gg/xUJ3AYv3xb');
});
router.get('/instagram', async ({ response }) => {
  response.redirect().toPath('https://www.instagram.com/studio.cesi/');
});