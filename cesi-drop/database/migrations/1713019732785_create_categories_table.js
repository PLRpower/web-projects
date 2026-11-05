import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'categories';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('title').notNullable();
            table.string('description').nullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1713019732785_create_categories_table.js.map