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
exports.calculateFeeByDistance = exports.calculateDistance = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const calculateDistance = (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = env_1.envVars.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    const response = yield axios_1.default.get(url);
    const data = response.data;
    if (data.status !== "OK") {
        throw new Error(data.error_message);
    }
    const distanceInMeters = data.rows[0].elements[0].distance.value;
    if (!distanceInMeters) {
        throw new AppError_1.default(400, "Invalid address");
    }
    const distanceInKm = distanceInMeters / 1000;
    return distanceInKm;
});
exports.calculateDistance = calculateDistance;
const calculateFeeByDistance = (distance) => {
    if (distance <= 5)
        return 80;
    if (distance <= 20)
        return 150;
    if (distance <= 50)
        return 300;
    if (distance <= 100)
        return 500;
    return 800;
};
exports.calculateFeeByDistance = calculateFeeByDistance;
