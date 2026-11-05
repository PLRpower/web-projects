import router from '@adonisjs/core/services/router';
import server from '@adonisjs/core/services/server';

server.errorHandler(() => import('#exceptions/handler'));
server.use([
    () => import('#middleware/container_bindings_middleware'),
    () => import('@adonisjs/static/static_middleware'),
]);

router.use([
    // Strip session cookies from /uploads/* responses so Cloudflare can cache images permanently
    async () => ({
        default: class StripUploadsCookieMiddleware {
            async handle(ctx, next) {
                const response = await next();
                if (ctx.request.url().startsWith('/uploads/')) {
                    ctx.response.removeHeader('set-cookie');
                }
                return response;
            }
        }
    }),
    () => import('@adonisjs/core/bodyparser_middleware'),
    () => import('@adonisjs/session/session_middleware'),
    () => import('@adonisjs/shield/shield_middleware'),
    () => import('@adonisjs/auth/initialize_auth_middleware'),
]);

export const middleware = router.named({
    guest: () => import('#middleware/guest_middleware'),
    auth: () => import('#middleware/auth_middleware'),
});
//# sourceMappingURL=kernel.js.map