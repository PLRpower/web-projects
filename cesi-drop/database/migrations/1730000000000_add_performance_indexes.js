import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('media', (table) => {
      table.index(['accueil', 'published', 'id'], 'idx_media_accueil_published_id');
      table.index(['category_id', 'published', 'id'], 'idx_media_category_published_id');
      table.index(['published', 'id'], 'idx_media_published_id');
    });
  }

  async down() {
    this.schema.alterTable('media', (table) => {
      table.dropIndex(['accueil', 'published', 'id'], 'idx_media_accueil_published_id');
      table.dropIndex(['category_id', 'published', 'id'], 'idx_media_category_published_id');
      table.dropIndex(['published', 'id'], 'idx_media_published_id');
    });
  }
}
