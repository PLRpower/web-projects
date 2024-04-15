import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cctls'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('titre', 127).notNullable()
      table.string('promotion', 254).notNullable()
      table.date('date').nullable()
      table.string('duree', 127).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
