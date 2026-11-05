export default class GuestMiddleware {
    redirectTo = '/admin';
    async handle(ctx, next, options = {}) {
        for (let guard of options.guards || [ctx.auth.defaultGuard]) {
            if (await ctx.auth.use(guard).check()) {
                return ctx.response.redirect(this.redirectTo, true);
            }
        }
        return next();
    }
}
//# sourceMappingURL=guest_middleware.js.map