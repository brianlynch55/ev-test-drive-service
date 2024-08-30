"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleTestDrive = exports.checkAvailability = void 0;
const Reservation_1 = require("../models/Reservation");
const Vehicle_1 = require("../models/Vehicle");
const dateUtils_1 = require("../utils/dateUtils");
const date_fns_1 = require("date-fns");
const checkAvailability = async (location, vehicleType, startDateTime, durationMins) => {
    const vehicles = await Vehicle_1.Vehicle.find({ location, type: vehicleType });
    for (const vehicle of vehicles) {
        if (await isVehicleAvailable(vehicle, startDateTime, durationMins)) {
            return vehicle;
        }
    }
    return null;
};
exports.checkAvailability = checkAvailability;
const scheduleTestDrive = async (vehicleId, startDateTime, durationMins, customerName, customerEmail, customerPhone) => {
    const vehicle = await Vehicle_1.Vehicle.findOne({ id: vehicleId });
    if (!vehicle) {
        throw new Error("Vehicle not found");
    }
    if (!isVehicleAvailable(vehicle, startDateTime, durationMins)) {
        throw new Error("Vehicle is not available for the requested time");
    }
    const endDateTime = (0, date_fns_1.addMinutes)(startDateTime, durationMins);
    const newReservation = new Reservation_1.Reservation({
        id: Date.now(),
        vehicleId,
        startDateTime,
        endDateTime,
        customerName,
        customerEmail,
        customerPhone,
    });
    await newReservation.save();
    return newReservation;
};
exports.scheduleTestDrive = scheduleTestDrive;
const isVehicleAvailable = async (vehicle, startDateTime, durationMins) => {
    const dayOfWeek = (0, dateUtils_1.formatDate)(startDateTime).toLowerCase().slice(0, 3);
    if (!vehicle.availableDays.includes(dayOfWeek)) {
        return false;
    }
    if (!(0, dateUtils_1.isTimeWithinRange)(startDateTime, vehicle.availableFromTime, vehicle.availableToTime)) {
        return false;
    }
    const endDateTime = (0, date_fns_1.addMinutes)(startDateTime, durationMins);
    const reservations = await Reservation_1.Reservation.find({
        vehicleId: vehicle.id,
        $or: [
            {
                startDateTime: { $lt: endDateTime },
                endDateTime: { $gt: startDateTime },
            },
            { startDateTime: { $gte: startDateTime, $lt: endDateTime } },
        ],
    });
    if (reservations.length > 0) {
        return false;
    }
    return true;
};
//# sourceMappingURL=testDriveService.js.map