"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../service/auth.service");
const utils_service_1 = require("../service/utils.service");
const config_dev_1 = require("../config/config.dev");
const createHttpError = require("http-errors");
class UtilsController {
    static adminUploadImg(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.AuthService.checkIfAdminUser(ctx.state.user)) {
                const files = ctx.request.body.files;
                let data = [];
                for (let key in files) {
                    const res = utils_service_1.UtilsService.saveFile(files[key]);
                    if (res) {
                        data.push(`http://${config_dev_1.settings.host}:${config_dev_1.settings.port}/${config_dev_1.settings.uploadImgPath}/${res}`);
                    }
                    else {
                        throw createHttpError(400, '上传失败');
                    }
                }
                ctx.body = {
                    errno: 0,
                    data: data
                };
            }
        });
    }
}
exports.UtilsController = UtilsController;
//# sourceMappingURL=utils.controller.js.map