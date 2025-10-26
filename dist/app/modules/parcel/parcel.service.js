"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const user_model_1 = require("../user/user.model");
const parcel_interface_1 = require("./parcel.interface");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const parcel_model_1 = require("./parcel.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const createParcel = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.Users.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found");
    }
    if (isUserExist.role !== "sender") {
        throw new AppError_1.default(401, "Unauthorized");
    }
    payload.sender = decodedToken.userId;
    const parcel = yield parcel_model_1.Parcels.create(Object.assign(Object.assign({}, payload), { sender: decodedToken.userId }));
    return parcel;
});
const getAllParcels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcels.find(), query);
    const parcels = yield queryBuilder.paginate().fields().filter().sort();
    const [data, meta] = yield Promise.all([
        parcels.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSenderParcels = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_model_1.Parcels.find({ sender: decodedToken.userId });
    return result;
});
const getReceiverParcels = (emailOrPhone) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_model_1.Parcels.find({ $or: [{ "receiver.email": emailOrPhone }, { "receiver.phone": emailOrPhone }] }).populate("sender").sort({ createdAt: -1 });
    return result;
});
const confirmDelivery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isPacelExist = yield parcel_model_1.Parcels.findById(id);
    if (!isPacelExist) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    const result = yield parcel_model_1.Parcels.findByIdAndUpdate(id, { status: parcel_interface_1.IParcelStatus.delivered }, { new: true, runValidators: true });
    return result;
});
const cancelParcel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcels.findById(id);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (!parcel.status || !["requested", "approved"].includes(parcel.status)) {
        throw new AppError_1.default(400, "Parcel cannot be cancelled");
    }
    parcel.status = parcel_interface_1.IParcelStatus.cancelled;
    parcel.statusLog = parcel.statusLog || [];
    parcel.statusLog.push({
        status: parcel_interface_1.IParcelStatus.cancelled,
        updatedBy: parcel.sender,
        note: "Parcel cancelled by sender",
    });
    yield parcel.save();
    return parcel;
});
const getParcelById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcels.findById(id);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    const result = yield parcel.populate("sender");
    return result;
});
const updateStatus = (id, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isParcelExist = yield parcel_model_1.Parcels.findById(id);
    if (!isParcelExist) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    isParcelExist.status = payload.status;
    (_a = isParcelExist.statusLog) === null || _a === void 0 ? void 0 : _a.push({
        status: payload.status,
        updatedBy: decodedToken.userId,
        note: payload.note
    });
    if (isParcelExist.status === "dispatched") {
        isParcelExist.dispatchedAt = new Date();
    }
    if (isParcelExist.status === "delivered") {
        isParcelExist.deliveredAt = new Date();
    }
    yield isParcelExist.save();
    return isParcelExist;
});
const blockParcel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcels.findById(id);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    const result = yield parcel_model_1.Parcels.findByIdAndUpdate(id, { isBlocked: true }, { new: true, runValidators: true });
    return result;
});
const assignDeliveryPerson = (id, decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcel = yield parcel_model_1.Parcels.findById(id);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    parcel.assignedTo = payload.assignedTo;
    parcel.status = parcel_interface_1.IParcelStatus.dispatched;
    (_a = parcel.statusLog) === null || _a === void 0 ? void 0 : _a.push({
        status: parcel_interface_1.IParcelStatus.dispatched,
        updatedBy: decodedToken.userId,
        note: "Parcel assigned to delivery person"
    });
    yield parcel.save();
    return parcel;
});
const trackParcel = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcels.findOne({ trackingCode: trackingId }).select("trackingId status receiver statusLogs type weight fee createdAt deliveredAt isBlocked");
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (parcel.isBlocked) {
        throw new AppError_1.default(403, "This parcel has been blocked by the admin");
    }
    return parcel;
});
exports.ParcelService = {
    createParcel,
    getAllParcels,
    getSenderParcels,
    getReceiverParcels,
    confirmDelivery,
    getParcelById,
    updateStatus,
    blockParcel,
    assignDeliveryPerson,
    cancelParcel,
    trackParcel
};
