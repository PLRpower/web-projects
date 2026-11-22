import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('media', (table) => {
      table.integer('likes').unsigned().notNullable().defaultTo(0);
      table.string('photographer', 100).nullable();
    });
  }

  async down() {
    this.schema.alterTable('media', (table) => {
      table.dropColumn('likes');
      table.dropColumn('photographer');
    });
  }
}
