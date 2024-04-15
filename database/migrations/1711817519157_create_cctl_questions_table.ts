import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cctl_questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('numero').notNullable()
      table.string('type', 127).notNullable()
      table.string('texte', 5000).notNullable()
      table.string('correction', 5000).nullable()
      table.integer('cctl_id').unsigned().references('id').inTable('cctls').notNullable();

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
