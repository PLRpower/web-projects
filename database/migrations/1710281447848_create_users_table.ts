import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('prenom', 127).notNullable()
      table.string('nom', 127).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('campus', 127).notNullable()
      table.string('promotion', 254).notNullable()
      table.string('password')
      table.boolean('social').defaultTo(false)
      table.string('pdp')
      table.string('stripe_id').unique()
      table.string('stripe_status')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
