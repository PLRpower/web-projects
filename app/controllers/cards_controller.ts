// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import Deck from '#models/deck'
import Card from '#models/card'

export default class CardsController {
  async renderAll({ view }: HttpContext) {
    const decks = await Deck.query().withCount('cards')
    return view.render('dashboard/decks', { decks: decks })
  }

  async render({ view, params }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('dashboard/deck', { deck: deck })
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()

    const deck = await Deck.create({
      title: data.titre,
      description: data.description,
      bloc: data.bloc,
      promotion: data.promotion,
    })

    const cardData = data.cards[0]
    for (let i = 0; i < cardData.front_text.length; i++) {
      await Card.create({
        deckId: deck.id,
        terme: cardData.front_text[i],
        definition: cardData.back_text[i],
      })
    }

    return response.redirect().toRoute('flashcards')
  }
}
