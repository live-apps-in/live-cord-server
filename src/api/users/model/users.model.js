"use strict";
exports.__esModule = true;
exports.UserSchema = void 0;
var mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: String,
    email: String
});
