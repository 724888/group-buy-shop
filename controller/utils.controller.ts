import {AuthService} from "../service/auth.service";

import {UtilsService} from "../service/utils.service";

import {settings} from "../config/config.dev";

import * as createHttpError from "http-errors";

export class UtilsController {
    static async adminUploadImg(ctx, next) {
        if (AuthService.checkIfAdminUser(ctx.state.user)) {
            const files = ctx.request.body.files;
            let data = [];
            for (let key in files) {
                const res = UtilsService.saveFile(files[key]);
                if (res) {
                    data.push(`http://${settings.host}:${settings.port}/${settings.uploadImgPath}/${res}`)
                } else {
                    throw createHttpError(400, '上传失败')
                }
            }
            ctx.body = {
                errno: 0,
                data: data
            }
        }
    }
}