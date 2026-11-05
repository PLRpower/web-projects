import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'media';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('extname').notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1716634130379_create_media_table.js.map