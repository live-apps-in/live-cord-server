"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.UserModule = void 0;
var decorators_1 = require("@nestjs/common/decorators");
var users_controller_1 = require("../../../../../../../../../../src/api/users/controller/users.controller");
var users_provider_1 = require("../../../../../../../../../../src/api/users/model/users.provider");
var users_repository_1 = require("../../../../../../../../../../src/api/users/repository/users.repository");
var users_service_1 = require("../../../../../../../../../../src/api/users/service/users.service");
var database_module_1 = require("../../../../../../../../../../src/database/database.module");
var UserModule = /** @class */ (function () {
    function UserModule() {
    }
    UserModule = __decorate([
        (0, decorators_1.Module)({
            imports: [database_module_1.DatabaseModule],
            controllers: [users_controller_1.UserController],
            providers: __spreadArray([users_service_1.UserService, users_repository_1.UserRepository], users_provider_1.usersProvider, true)
        })
    ], UserModule);
    return UserModule;
}());
exports.UserModule = UserModule;
