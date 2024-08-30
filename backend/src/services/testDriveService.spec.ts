import {
  checkAvailability,
  scheduleTestDrive,
} from "../services/testDriveService";
import { VehicleRepository } from "../repository/vehicleRepository";
import { IVehicle, IReservation } from "../types";
import { addMinutes, setHours, setMinutes } from "date-fns";

jest.mock("../repository/vehicleRepository");

describe("checkAvailability", () => {
  const mockVehicle: IVehicle = {
    id: "vehicle1",
    type: "car",
    location: "location1",
    availableFromTime: "09:00",
    availableToTime: "17:00",
    availableDays: ["mon", "tue", "wed", "thu", "fri"],
    minimumMinutesBetweenBookings: 30,
  };

  const withinAvailableHours = setMinutes(
    setHours(new Date(), 10),
    0
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return availability result with available: false if no vehicles are found", async () => {
    (VehicleRepository.findVehicles as jest.Mock).mockResolvedValue([]);

    const result = await checkAvailability(
      "location1",
      "car",
      withinAvailableHours,
      60
    );

    if (result.available) {
      throw new Error("Expected no vehicles to be available.");
    } else {
      expect(result.reason).toBe(
        "No vehicles of this type are available at the specified location."
      );
    }
  });

  it("should return availability result with available: true if a vehicle is available", async () => {
    (VehicleRepository.findVehicles as jest.Mock).mockResolvedValue([
      mockVehicle,
    ]);
    (
      VehicleRepository.findConflictingReservations as jest.Mock
    ).mockResolvedValue(
      [] // No conflicting reservations
    );
    (VehicleRepository.findNearbyReservations as jest.Mock).mockResolvedValue(
      [] // No nearby reservations
    );

    const result = await checkAvailability(
      "location1",
      "car",
      withinAvailableHours,
      60
    );

    if (result.available) {
      expect(result.vehicle).toEqual(mockVehicle);
    } else {
      throw new Error("Expected vehicle to be available, but it wasn't.");
    }
  });

  it("should return availability result with available: false if the vehicle is not available on the specified day", async () => {
    const dateOnWeekend = setMinutes(
      setHours(new Date("2024-08-31T10:00:00"), 10), // Saturday at 10:00 AM
      0
    );

    (VehicleRepository.findVehicles as jest.Mock).mockResolvedValue([
      mockVehicle,
    ]);

    const result = await checkAvailability(
      "location1",
      "car",
      dateOnWeekend,
      60
    );

    if (result.available) {
      throw new Error("Expected vehicle to be unavailable on Saturday.");
    } else {
      expect(result.reason).toBe(
        "The vehicle is not available on this day of the week."
      );
    }
  });

  it("should return availability result with available: false if the vehicle is already booked", async () => {
    (VehicleRepository.findVehicles as jest.Mock).mockResolvedValue([
      mockVehicle,
    ]);
    (
      VehicleRepository.findConflictingReservations as jest.Mock
    ).mockResolvedValue([
      {
        id: 1,
        vehicleId: "vehicle1",
        startDateTime: withinAvailableHours,
        endDateTime: addMinutes(withinAvailableHours, 60),
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "1234567890",
      },
    ]);

    const result = await checkAvailability(
      "location1",
      "car",
      withinAvailableHours,
      60
    );

    if (result.available) {
      throw new Error("Expected vehicle to be unavailable due to booking.");
    } else {
      expect(result.reason).toBe(
        "The vehicle is already booked for this time slot."
      );
    }
  });
});

describe("scheduleTestDrive", () => {
  const mockVehicle: IVehicle = {
    id: "vehicle1",
    type: "car",
    location: "location1",
    availableFromTime: "09:00",
    availableToTime: "17:00",
    availableDays: ["mon", "tue", "wed", "thu", "fri"],
    minimumMinutesBetweenBookings: 30,
  };

  const withinAvailableHours = setMinutes(
    setHours(new Date(), 10), // 10:00 AM, within available hours
    0
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if the vehicle is not found", async () => {
    (VehicleRepository.findVehicleById as jest.Mock).mockResolvedValue(null);

    await expect(
      scheduleTestDrive(
        "invalidVehicleId",
        withinAvailableHours,
        60,
        "John Doe",
        "john@example.com",
        "1234567890"
      )
    ).rejects.toThrow("Vehicle not found");
  });

  it("should throw an error if the vehicle is not available", async () => {
    (VehicleRepository.findVehicleById as jest.Mock).mockResolvedValue(
      mockVehicle
    );
    (
      VehicleRepository.findConflictingReservations as jest.Mock
    ).mockResolvedValue([
      {
        id: 1,
        vehicleId: "vehicle1",
        startDateTime: withinAvailableHours,
        endDateTime: addMinutes(withinAvailableHours, 60),
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "1234567890",
      },
    ]);

    await expect(
      scheduleTestDrive(
        "vehicle1",
        withinAvailableHours,
        60,
        "Jane Doe",
        "jane@example.com",
        "0987654321"
      )
    ).rejects.toThrow("The vehicle is already booked for this time slot.");
  });

  it("should create a reservation if the vehicle is available", async () => {
    (VehicleRepository.findVehicleById as jest.Mock).mockResolvedValue(
      mockVehicle
    );
    (
      VehicleRepository.findConflictingReservations as jest.Mock
    ).mockResolvedValue([]);
    (VehicleRepository.findNearbyReservations as jest.Mock).mockResolvedValue(
      []
    );
    (VehicleRepository.createReservation as jest.Mock).mockResolvedValue({
      id: 1,
      vehicleId: "vehicle1",
      startDateTime: withinAvailableHours,
      endDateTime: addMinutes(withinAvailableHours, 60),
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "0987654321",
    });

    const reservation = await scheduleTestDrive(
      "vehicle1",
      withinAvailableHours,
      60,
      "Jane Doe",
      "jane@example.com",
      "0987654321"
    );

    expect(reservation).toEqual({
      id: 1,
      vehicleId: "vehicle1",
      startDateTime: expect.any(Date),
      endDateTime: expect.any(Date),
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "0987654321",
    });
  });
});
