export async function unauth(ctx, next) {
    return next()
        .catch((err) => {
            if (err.status === 401) {
                ctx.status = 401;
                ctx.body = {
                    status: 0,
                    errcode: 1000,
                    errmsg: '认证失败，请重新认证获取token'
                }
            } else {
                throw err
            }
        })
}