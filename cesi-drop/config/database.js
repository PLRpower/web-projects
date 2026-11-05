import env from '#start/env';
import app from '@adonisjs/core/services/app';
import { defineConfig } from '@adonisjs/lucid';

const dbConfig = defineConfig({
    connection: env.get('DB_CONNECTION') || 'sqlite',
    connections: {
        sqlite: {
            client: 'better-sqlite3',
            connection: {
                filename: app.tmpPath('db.sqlite3'),
            },
            useNullAsDefault: true,
            pool: {
                afterCreate: (conn, done) => {
                    try {
                        conn.pragma('journal_mode = WAL');
                        conn.pragma('synchronous = NORMAL');
                        conn.pragma('busy_timeout = 5000');
                        conn.pragma('temp_store = MEMORY');
                        conn.pragma('cache_size = -20000');
                        conn.pragma('foreign_keys = ON');
                        done(null, conn);
                    } catch (err) {
                        done(err, conn);
                    }
                },
            },
            migrations: {
                naturalSort: true,
                paths: ['database/migrations'],
            },
        },
        mysql: {
            client: 'mysql2',
            connection: {
                host: env.get('DB_HOST') || '127.0.0.1',
                port: env.get('DB_PORT') || 3306,
                user: env.get('DB_USER') || 'root',
                password: env.get('DB_PASSWORD') || '',
                database: env.get('DB_DATABASE') || 'cesi_drop',
            },
            migrations: {
                naturalSort: true,
                paths: ['database/migrations'],
            },
        },
    },
});
export default dbConfig;