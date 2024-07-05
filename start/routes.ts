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
const CardsController = () => import('#controllers/cards_controller')
import User from '#models/user'

/* Publique */
router.on('/').render('pages/accueil').as('accueil')
router.on('/fonctionnalites/').render('pages/fonctionnalites').as('fonctionnalites')

/* Uniquement visiteurs */
router.on('/inscription').render('pages/inscription').as('inscription').use(middleware.guest())
router.on('/connexion').render('pages/connexion').as('connexion').use(middleware.guest())
router.on('/choix').render('pages/choix').as('choix').use(middleware.guest())

/* Uniquement utilisateurs */
router
  .group(() => {
    router.on('/').render('dashboard/dashboard').as('dashboard').use(middleware.auth())
    router.get('/utilisateur/:id', [UsersController, 'profile']).as('utilisateur')
    router.on('/mon-compte').render('dashboard/compte').as('compte').use(middleware.auth())
    router.on('/auto-prosit').render('dashboard/autoprosit').as('autoprosit').use(middleware.auth())
    router.on('/diagramme').render('dashboard/diagramme').as('diagramme').use(middleware.auth())
    router
      .group(() => {
        router.get('/', [CCTLsController, 'renderAll']).as('cctls').use(middleware.auth())
        router.on('/ajouter').render('dashboard/ajouter-cctl').as('add.cctl').use(middleware.auth())
        router.get('/:id', [CCTLsController, 'render']).as('cctl').use(middleware.auth())
      })
      .prefix('/cctl')
    router
      .group(() => {
        router.on('/').render('abonnement/abonnement').as('abonnement').use(middleware.auth())
        router.on('/confirmation').render('abonnement/paiement-confirmation').as('abonnement.confirmation').use(middleware.auth())
        router.get('/annuel', [PaymentsController, 'createPaymentAnnual']).as('abonnement.annuel').use(middleware.auth())
        router.get('/mensuel', [PaymentsController, 'createPaymentMonthly']).as('abonnement.mensuel').use(middleware.auth())
      })
      .prefix('/abonnement')
    router
      .group(() => {
        router.get('/', [CardsController, 'renderAll']).as('flashcards').use(middleware.auth())
        router.on('/ajouter').render('dashboard/ajouter-deck').as('add.flashcard').use(middleware.auth())
        router.get('/:id', [CardsController, 'render']).as('flashcard').use(middleware.auth())
      })
      .prefix('/flashcards')
  })
  .prefix('/dashboard')

/* Post */
router.post('/inscription', [UsersController, 'register']).as('inscription.post')
router.post('/connexion', [UsersController, 'login']).as('connexion.post')
router.post('/deconnexion', [UsersController, 'logout']).as('deconnexion.post')
router.post('/cctl/ajouter', [CCTLsController, 'post']).as('add.cctl.post')
router.post('/choix', [UsersController, 'choix']).as('choix.post')
router.post('/flashcards/ajouter', [CardsController, 'store']).as('flashcard.post')

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
