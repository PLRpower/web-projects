// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async creer({}: HttpContext) {
    const user = await User.create({
      fullName: 'admin',
      email: 'admin@admin.com',
      password: '#LeCULdeL0uuis!',
    })
    await user.save()
  }

  async connecter({ auth, response, request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return response.redirect().toRoute('admin')
  }
}
