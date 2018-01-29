export async function badrequest(ctx, next) {
    return next()
        .catch((err) => {
            if (err.status === 400) {
                ctx.status = 400;
                ctx.body = {
                    status: 0,
                    errcode: 1001,
                    errmsg: err.message
                }
            } else {
                throw err
            }
        })
}