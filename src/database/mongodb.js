"use strict";
exports.__esModule = true;
exports.databaseProviders = void 0;
var mongoose = require("mongoose");
require("dotenv/config");
var types_1 = require("../../../../../../../../../src/core/types");
exports.databaseProviders = [
    {
        provide: types_1.TYPES.DatabaseConnection,
        useFactory: function () {
            return mongoose.connect(process.env.MONGO_URI);
        }
    },
];
