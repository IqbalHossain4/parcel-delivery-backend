"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProvider = new mongoose_1.Schema({
    provider: {
        type: String,
        required: true,
    },
    providerId: {
        type: String,
        required: true,
    },
}, { versionKey: false, _id: false });
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.receiver,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    picture: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(user_interface_1.Status),
        default: user_interface_1.Status.isActive,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    auths: [authProvider],
    parcels: { type: mongoose_1.Schema.Types.ObjectId, ref: "Parcels" },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Users = (0, mongoose_1.model)("Users", userSchema);
