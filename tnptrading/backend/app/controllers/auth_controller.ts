import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/user'

export default class AuthController {
  async register({response, request, auth}: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    await auth.use('web').login(user)
    return response.status(201)
  }

  async login({ response, request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return response.status(200)
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.status(200)
  }

  async authenticated({ response, auth }: HttpContext) {
    console.log(auth)
    if (auth.isAuthenticated) {
      return response.status(200).json({ authenticated: true })
    }
    return response.status(200).json({ authenticated: false })
  }
}
