import { Env } from '@adonisjs/core/env';

export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test']),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.string(),
    SESSION_DRIVER: Env.schema.enum(['cookie', 'memory']),
    DB_CONNECTION: Env.schema.enum.optional(['sqlite', 'mysql']),
    DB_HOST: Env.schema.string.optional({ format: 'host' }),
    DB_PORT: Env.schema.number.optional(),
    DB_USER: Env.schema.string.optional(),
    DB_PASSWORD: Env.schema.string.optional(),
    DB_DATABASE: Env.schema.string.optional(),
    UPLOADS_PATH: Env.schema.string.optional(),
});