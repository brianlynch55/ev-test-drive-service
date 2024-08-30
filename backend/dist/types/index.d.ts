export interface IVehicle {
    id: string;
    type: string;
    location: string;
    availableFromTime: string;
    availableToTime: string;
    availableDays: string[];
    minimumMinutesBetweenBookings: number;
}
export interface IReservation {
    id: number;
    vehicleId: string;
    startDateTime: Date;
    endDateTime: Date;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}
