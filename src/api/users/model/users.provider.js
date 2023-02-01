"use strict";
exports.__esModule = true;
exports.usersProvider = void 0;
var users_model_1 = require("../../../../../../../../../../../src/api/users/model/users.model");
var types_1 = require("../../../../../../../../../../../src/core/types");
exports.usersProvider = [
    {
        provide: types_1.TYPES.UsersModel,
        useFactory: function (connection) {
            return connection.model('users', users_model_1.UserSchema);
        },
        inject: [types_1.TYPES.DatabaseConnection]
    },
];
