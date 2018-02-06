import {AuthService} from "../service/auth.service";

export async function admin_auth(ctx, next) {
    if (ctx.request.url.indexOf('admin_') >= 0) {
        if (ctx.request.method === 'GET') {
            ctx.state.user = AuthService.adminGetuserFromHeaderToken(ctx)
        } else {
            await AuthService.checkIfAdminUser(ctx.state.user)
        }
        return next()
    } else {
        return next()
    }
}