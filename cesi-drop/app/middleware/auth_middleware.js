export default class AuthMiddleware {
    redirectTo = '/connexion';
    async handle(ctx, next, options = {}) {
        await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo });
        return next();
    }
}
//# sourceMappingURL=auth_middleware.js.map