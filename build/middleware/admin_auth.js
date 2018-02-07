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
function admin_auth(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.request.url.indexOf('admin_') >= 0) {
            if (ctx.request.method === 'GET') {
                ctx.state.user = yield auth_service_1.AuthService.adminGetuserFromHeaderToken(ctx);
            }
            else {
                yield auth_service_1.AuthService.checkIfAdminUser(ctx.state.user);
            }
            return next();
        }
        else {
            return next();
        }
    });
}
exports.admin_auth = admin_auth;
//# sourceMappingURL=admin_auth.js.map