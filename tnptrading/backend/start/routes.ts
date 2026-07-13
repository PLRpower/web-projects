/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const NumbersController = () => import('#controllers/numbers_controller')
const HomeController = () => import('#controllers/home_controller')
const TestimonialsController = () => import('#controllers/testimonials_controller')
const FaqController = () => import('#controllers/faq_controller')

router.get('/home', [HomeController, 'index'])

router.post('/number/edit/:id', [NumbersController, 'edit'])

router.post('/testimonial/add', [TestimonialsController, 'add'])
router.post('/testimonial/edit/:id', [TestimonialsController, 'edit'])
router.post('/testimonial/delete/:id', [TestimonialsController, 'delete'])

router.post('/question/add', [FaqController, 'add'])
router.post('/question/edit/:id', [FaqController, 'edit'])
router.post('/question/delete/:id', [FaqController, 'delete'])

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout'])

router.get('/authenticated', [AuthController, 'authenticated'])

router.post('/email-fashion-night', [HomeController, 'emailFashionNight'])
router.post('/description-fashion-night', [HomeController, 'descriptionFashionNight'])
