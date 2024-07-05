import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cctl_answers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('texte', 5000).nullable()
      table.string('correction', 5000).notNullable()
      table.integer('cctl_question_id').unsigned().references('id').inTable('cctl_questions').notNullable().onDelete('CASCADE');

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
