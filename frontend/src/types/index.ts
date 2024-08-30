export interface Vehicle {
    id: string;
    type: string;
    location: string;
    availableFromTime: string;
    availableToTime: string;
    availableDays: string[];
    minimumMinutesBetweenBookings: number;
  }
  
  export interface Reservation {
    id: number;
    vehicleId: string;
    startDateTime: string;
    endDateTime: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }

  export interface AvailabilityRequest {
    location: string;
    vehicleType: string;
    startDateTime: string;
    durationMins: number;
  }
  
  export interface BookingRequest {
    vehicleId: string;
    startDateTime: string;
    durationMins: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }

  export interface AvailabilityResponse {
    available: boolean;
    vehicle?: Vehicle;
    reason?: string;
  }