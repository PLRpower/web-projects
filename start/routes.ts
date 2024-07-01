/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UsersController = () => import('#controllers/users_controller')
const PaymentsController = () => import('#controllers/payments_controller')
const CCTLsController = () => import('#controllers/cctls_controller')
import User from '#models/user'

/* Publique */
router.on('/').render('pages/accueil').as('accueil')
router.on('/fonctionnalites/').render('pages/fonctionnalites').as('fonctionnalites')

/* Uniquement visiteurs */
router.on('/inscription').render('pages/inscription').as('inscription').use(middleware.guest())
router.on('/connexion').render('pages/connexion').as('connexion').use(middleware.guest())
router.on('/choix').render('pages/choix').as('choix').use(middleware.guest())

/* Uniquement utilisateurs */
router.on('/dashboard').render('dashboard/dashboard').as('dashboard').use(middleware.auth())
router.get('/utilisateur/:id', [UsersController, 'profile']).as('utilisateur')
router.on('/cctl/ajouter').render('dashboard/ajouter-cctl').as('add.cctl').use(middleware.auth())
router.on('/mon-compte').render('dashboard/compte').as('compte').use(middleware.auth())
router.on('/abonnement').render('abonnement/abonnement').as('abonnement').use(middleware.auth())
router.on('/abonnement/confirmation').render('abonnement/paiement-confirmation').as('abonnement.confirmation').use(middleware.auth())
router.get('/abonnement/annuel', [PaymentsController, 'createPaymentAnnual']).as('abonnement.annuel').use(middleware.auth())
router.get('/abonnement/mensuel', [PaymentsController, 'createPaymentMonthly']).as('abonnement.mensuel').use(middleware.auth())
router.get('/cctl/:id', [CCTLsController, 'render']).as('cctl').use(middleware.auth())
router.get('/cctl/', [CCTLsController, 'renderAll']).as('parcourir-cctl').use(middleware.auth())

/* Post */
router.post('/inscription', [UsersController, 'register']).as('inscription.post')
router.post('/connexion', [UsersController, 'login']).as('connexion.post')
router.post('/deconnexion', [UsersController, 'logout']).as('deconnexion.post')
router.post('/cctl/ajouter', [CCTLsController, 'post']).as('add.cctl.post')
router.post('/choix', [UsersController, 'choix']).as('choix.post')

/* API */
router.post('/api/stripe', [PaymentsController, 'webhook']).as('api.stripe')

/* Google */
router
  .get('/google/redirect', ({ ally }) => {
    return ally.use('google').stateless().redirect()
  })
  .as('google.redirect')

router.get('/google/callback', async ({ ally, auth, response, session }) => {
  const google = ally.use('google')
  if (google.accessDenied()) {
    return 'You have cancelled the login process'
  }
  if (google.stateMisMatch()) {
    return 'We are unable to verify the request. Please try again'
  }
  if (google.hasError()) {
    return google.getError()
  }

  const glUser = await google.user()
  const user = await User.findBy('email', glUser.email)
  if (user) {
    // Connexion
    await auth.use('web').login(user)
    return response.redirect().toRoute('accueil')
  } else {
    // Inscription
    const prenom = glUser.original.given_name
    const nom = glUser.original.family_name
    const email = glUser.email
    const pdp = glUser.avatarUrl

    session.put('infos', { prenom, nom, email, pdp })

    return response.redirect().toRoute('choix')
  }
})
