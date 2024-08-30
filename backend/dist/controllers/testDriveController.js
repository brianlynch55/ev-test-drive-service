"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleTestDrive = exports.checkAvailability = void 0;
const testDriveService = __importStar(require("../services/testDriveService"));
const checkAvailability = async (req, res) => {
    try {
        const { location, vehicleType, startDateTime, durationMins } = req.body;
        const availableVehicle = await testDriveService.checkAvailability(location, vehicleType, new Date(startDateTime), durationMins);
        if (availableVehicle) {
            res.json(availableVehicle);
        }
        else {
            res.status(404).json({ message: "No available vehicles found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error checking availability" });
    }
};
exports.checkAvailability = checkAvailability;
const scheduleTestDrive = async (req, res) => {
    try {
        const { vehicleId, startDateTime, durationMins, customerName, customerEmail, customerPhone, } = req.body;
        const reservation = await testDriveService.scheduleTestDrive(vehicleId, new Date(startDateTime), durationMins, customerName, customerEmail, customerPhone);
        res.status(201).json(reservation);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.scheduleTestDrive = scheduleTestDrive;
//# sourceMappingURL=testDriveController.js.map