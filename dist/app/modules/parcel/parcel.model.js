"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcels = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.IParcelStatus),
        required: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    note: {
        type: String,
    },
}, { _id: false, timestamps: true });
const parcelSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
    },
    receiver: {
        name: {
            type: String,
            required: true,
        }, email: String, phone: {
            type: String,
            required: true
        }, address: { type: String, required: true }, city: String, postalCode: String
    },
    fee: {
        type: Number,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.IParcelStatus),
        default: parcel_interface_1.IParcelStatus.requested,
    },
    trackingCode: {
        type: String,
        required: true,
        unique: true,
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    },
    statusLog: {
        type: [statusLogSchema],
        default: [],
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    dispatchedAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    }
}, {
    timestamps: true,
});
exports.Parcels = (0, mongoose_1.model)("Parcels", parcelSchema);
