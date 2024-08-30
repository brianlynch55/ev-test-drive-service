import { Request, Response } from "express";
import * as testDriveService from "../services/testDriveService";

export const checkAvailability = async (req: Request, res: Response) => {
  console.log("Checking availability");
  console.log(req.body);
  try {
    const { location, vehicleType, startDateTime, durationMins } = req.body;
    const availableVehicle = await testDriveService.checkAvailability(
      location,
      vehicleType,
      new Date(startDateTime),
      durationMins
    );
    console.log("Available vehicle:", availableVehicle);
    if (availableVehicle) {
      res.json(availableVehicle);
    } else {
      res.status(204).json({ message: "No available vehicles found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking availability" });
  }
};

export const scheduleTestDrive = async (req: Request, res: Response) => {
  try {
    const {
      vehicleId,
      startDateTime,
      durationMins,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;
    const reservation = await testDriveService.scheduleTestDrive(
      vehicleId,
      new Date(startDateTime),
      durationMins,
      customerName,
      customerEmail,
      customerPhone
    );
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
