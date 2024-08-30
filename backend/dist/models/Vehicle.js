"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const VehicleSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    availableFromTime: { type: String, required: true },
    availableToTime: { type: String, required: true },
    availableDays: { type: [String], required: true },
    minimumMinutesBetweenBookings: { type: Number, required: true },
});
exports.Vehicle = mongoose_1.default.model('Vehicle', VehicleSchema);
//# sourceMappingURL=Vehicle.js.map