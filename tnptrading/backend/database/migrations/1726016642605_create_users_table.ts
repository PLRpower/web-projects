import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('phone', 20).notNullable()
      table.datetime('birth_date').notNullable()
      table.string('billing_name').nullable()
      table.string('billing_address').notNullable()
      table.string('billing_postal_code', 10).notNullable()
      table.string('billing_city').notNullable()
      table.string('billing_country').notNullable()
      table.string('vat_number').nullable()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
