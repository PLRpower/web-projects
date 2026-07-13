/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import app from '@adonisjs/core/services/app'

const MediaController = () => import('#controllers/media_controller')
const AuthController = () => import('#controllers/auth_controller')
const AdminController = () => import('#controllers/admin_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const CategoriesController = () => import('#controllers/categories_controller')

// ---------------- Routes publiques

router.get('/', [MediaController, 'afficher']).as('accueil')
router.on('/publier').render('pages/publier').as('publier')
router.get('/categorie/:id', [MediaController, 'categorie']).as('categorie')

router.post('/publier/post', [MediaController, 'publier']).as('publier.post')
router.post('/protege/post', [AuthController, 'connecter']).as('protege.post')

// ---------------- Routes admin

router.on('/connexion').render('pages/protected').as('connexion').use(middleware.guest())

router.get('/admin', [AdminController, 'index']).as('admin').use(middleware.auth())
router
  .get('/admin/moderer', [AdminController, 'moderer'])
  .as('admin.moderer')
  .use(middleware.auth())
router
  .get('/admin/publier', [AdminController, 'publier'])
  .as('admin.publier')
  .use(middleware.auth())
router
  .get('/admin/categorie', [CategoriesController, 'creer'])
  .as('admin.categorie')
  .use(middleware.auth())
router
  .get('/admin/choisir', [AdminController, 'choisir'])
  .as('admin.choisir')
  .use(middleware.auth())

router
  .post('/admin/moderer', [AdminController, 'moderer_post'])
  .as('admin.moderer.post')
  .use(middleware.auth())
router
  .post('/admin/publier/post', [AdminController, 'publier_post'])
  .as('admin.publier.post')
  .use(middleware.auth())
router
  .post('/admin/categorie/post', [CategoriesController, 'creer_post'])
  .as('category.post')
  .use(middleware.auth())
router
  .post('/admin/choisir', [AdminController, 'choisir_post'])
  .as('admin.choisir.post')
  .use(middleware.auth())
router
  .post('/admin/supprimer', [AdminController, 'supprimer_post'])
  .as('admin.supprimer')
  .use(middleware.auth())
router
  .get('/admin/modifier', [CategoriesController, 'modifier_cat'])
  .as('admin.modifier.cat')
  .use(middleware.auth())
router
  .get('/admin/modifier/:id', [CategoriesController, 'modifier'])
  .as('admin.modifier')
  .use(middleware.auth())
router
  .post('/admin/modifier/:id', [CategoriesController, 'modifier_post'])
  .as('admin.modifier.post')
  .use(middleware.auth())
router
  .post('/admin/supprimer-cat/:id', [CategoriesController, 'supprimer_post'])
  .as('admin.supprimer.cat')
  .use(middleware.auth())

// ---------------- Routes des fichiers

router.get('uploads/:filename', async ({ response, params }) => {
  response.download(app.makePath('uploads', params.filename))
})

router.get('uploads/categories/:filename', async ({ response, params }) => {
  response.download(app.makePath('uploads/categories', params.filename))
})

// router.get('/creer', [AuthController, 'creer'])

router.get('/discord', async ({ response }) => {
  response.redirect().toPath('https://discord.gg/xUJ3AYv3xb')
})

router.get('/instagram', async ({ response }) => {
  response.redirect().toPath('https://www.instagram.com/studio.cesi/')
})
