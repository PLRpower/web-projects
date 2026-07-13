import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('extname').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
