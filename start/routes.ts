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

/* Publique */
router.on('/').render('pages/accueil').as('accueil')
router.on('/fonctionnalites/').render('pages/fonctionnalites').as('fonctionnalites')

/* Uniquement visiteurs */
router.on('/inscription').render('pages/inscription').as('inscription').use(middleware.guest())
router.on('/connexion').render('pages/connexion').as('connexion').use(middleware.guest())

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

/* API */
router.post('/api/stripe', [PaymentsController, 'webhook']).as('api.stripe');
