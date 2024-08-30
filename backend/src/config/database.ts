import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Vehicle } from "../models/Vehicle";
import { Reservation } from "../models/Reservation";

let mongod: MongoMemoryServer | null = null;

const initialVehicles = [
  {
    id: "tesla_1001",
    type: "tesla_model3",
    location: "dublin",
    availableFromTime: "08:00:00",
    availableToTime: "18:00:00",
    availableDays: ["mon", "tue", "wed", "thur", "fri"],
    minimumMinutesBetweenBookings: 15,
  },
  {
    id: "tesla_1002",
    type: "tesla_modelx",
    location: "dublin",
    availableFromTime: "10:00:00",
    availableToTime: "20:00:00",
    availableDays: ["mon", "tue", "wed", "thur", "fri", "sat"],
    minimumMinutesBetweenBookings: 15,
  },
  {
    id: "tesla_1003",
    type: "tesla_modely",
    location: "dublin",
    availableFromTime: "10:00:00",
    availableToTime: "16:00:00",
    availableDays: ["fri", "sat", "sun"],
    minimumMinutesBetweenBookings: 15,
  },
  {
    id: "tesla_1004",
    type: "tesla_model3",
    location: "cork",
    availableFromTime: "08:00:00",
    availableToTime: "18:00:00",
    availableDays: ["mon", "tue", "wed", "thur", "fri"],
    minimumMinutesBetweenBookings: 15,
  },
  {
    id: "tesla_1005",
    type: "tesla_modelx",
    location: "cork",
    availableFromTime: "10:00:00",
    availableToTime: "20:00:00",
    availableDays: ["mon", "tue", "wed", "thur", "fri", "sat"],
    minimumMinutesBetweenBookings: 15,
  },
  {
    id: "tesla_1006",
    type: "tesla_modely",
    location: "cork",
    availableFromTime: "10:00:00",
    availableToTime: "16:00:00",
    availableDays: ["fri", "sat", "sun"],
    minimumMinutesBetweenBookings: 15,
  },
];

const initialReservations = [
  {
    id: 18726,
    vehicleId: "tesla_1001",
    startDateTime: "2023-10-18T09:00:00Z",
    endDateTime: "2023-10-18T09:45:00Z",
    customerName: "John Smith",
    customerEmail: "John@Smith.com",
    customerPhone: "+353851234567",
  },
  {
    id: 18727,
    vehicleId: "tesla_1001",
    startDateTime: "2023-10-18T11:30:00Z",
    endDateTime: "2023-10-18T12:15:00Z",
    customerName: "Jill Jones",
    customerEmail: "Jill@Jones.com",
    customerPhone: "+353879876543",
  },
  {
    id: 18728,
    vehicleId: "tesla_1001",
    startDateTime: "2023-10-18T14:45:00Z",
    endDateTime: "2023-10-18T15:30:00Z",
    customerName: "Jack Brown",
    customerEmail: "Jack@Brown.com",
    customerPhone: "+353891234567",
  },
];

async function populateDatabase() {
  try {
    await Vehicle.deleteMany({});
    await Reservation.deleteMany({});

    await Vehicle.insertMany(initialVehicles);
    await Reservation.insertMany(initialReservations);

    console.log("Database populated with initial data");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

export const connectDB = async () => {
  try {
    if (!mongod) {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("MongoDB connected to in-memory instance");

      await populateDatabase();
    } else {
      console.log("MongoDB already connected to in-memory instance");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};
