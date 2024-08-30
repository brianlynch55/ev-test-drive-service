import { useState, ChangeEvent, FormEvent } from "react";
import { useTestDrive } from "../hooks/useTestDrive";
import { VehicleSelector } from "./VehicleSelector";
import { AvailabilityRequest, BookingRequest, Vehicle } from "../types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VEHICLE_TYPES = ["tesla_model3", "tesla_modelx", "tesla_modely"];
const LOCATIONS = ["dublin", "cork"];

export function TestDriveForm() {
  const {
    loading,
    error,
    availableVehicle,
    reservation,
    checkAvailability,
    scheduleTestDrive,
  } = useTestDrive();

  const [availabilityData, setAvailabilityData] = useState<AvailabilityRequest>({
    location: LOCATIONS[0],
    vehicleType: VEHICLE_TYPES[0],
    startDateTime: "",
    durationMins: 45,
  });
  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const handleAvailabilityInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAvailabilityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckAvailability = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await checkAvailability(availabilityData);
      if (result.available) {
        toast.success("Vehicle is available for the selected time!");
      } else {
        toast.warning(result.reason);
      }
    } catch (error) {
      toast.error("Error checking availability. Please try again.");
    }
  };

  const handleScheduleTestDrive = async (e: FormEvent) => {
    e.preventDefault();
    if (!availableVehicle) return;

    const request: BookingRequest = {
      vehicleId: availableVehicle.id,
      startDateTime: availabilityData.startDateTime,
      durationMins: availabilityData.durationMins,
      ...bookingData,
    };
    try {
      const result = await scheduleTestDrive(request);
      if (result) {
        toast.success("Test drive scheduled successfully!");
        setAvailabilityData({
          location: LOCATIONS[0],
          vehicleType: VEHICLE_TYPES[0],
          startDateTime: "",
          durationMins: 45,
        });
        setBookingData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
        });
      } else {
        toast.error(
          "Unable to schedule test drive. The slot may have been taken. Please try again."
        );
      }
    } catch (error) {
      toast.error("Error scheduling test drive. Please try again.");
    }
  };

  const renderAvailabilityForm = () => (
    <form onSubmit={handleCheckAvailability}>
      <div className="form-group">
        <label htmlFor="location" className="form-label">
          Location
        </label>
        <select
          id="location"
          name="location"
          value={availabilityData.location}
          onChange={handleAvailabilityInputChange}
          className="form-select"
          required
        >
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location.charAt(0).toUpperCase() + location.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <VehicleSelector
        vehicleTypes={VEHICLE_TYPES}
        selectedType={availabilityData.vehicleType}
        onSelect={(type) =>
          setAvailabilityData((prev) => ({ ...prev, vehicleType: type }))
        }
      />
      <div className="form-group">
        <label htmlFor="startDateTime" className="form-label">
          Date and Time
        </label>
        <input
          type="datetime-local"
          id="startDateTime"
          name="startDateTime"
          value={availabilityData.startDateTime}
          onChange={handleAvailabilityInputChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="durationMins" className="form-label">
          Duration (minutes)
        </label>
        <input
          type="number"
          id="durationMins"
          name="durationMins"
          value={availabilityData.durationMins}
          onChange={handleAvailabilityInputChange}
          className="form-input"
          min="15"
          max="120"
          step="15"
          required
        />
      </div>
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Checking..." : "Check Availability"}
      </button>
    </form>
  );

  const renderBookingForm = () => (
    <form onSubmit={handleScheduleTestDrive}>
      <div className="form-group">
        <label htmlFor="customerName" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={bookingData.customerName}
          onChange={handleBookingInputChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="customerEmail" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="customerEmail"
          name="customerEmail"
          value={bookingData.customerEmail}
          onChange={handleBookingInputChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="customerPhone" className="form-label">
          Phone
        </label>
        <input
          type="tel"
          id="customerPhone"
          name="customerPhone"
          value={bookingData.customerPhone}
          onChange={handleBookingInputChange}
          className="form-input"
          required
        />
      </div>
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Booking..." : "Schedule Test Drive"}
      </button>
    </form>
  );

  const renderAvailabilityResult = (vehicle: Vehicle) => (
    <div className="availability-result">
      <h3>Available Vehicle:</h3>
      <p>Type: {vehicle.type}</p>
      <p>Location: {vehicle.location}</p>
      <p>
        Date: {new Date(availabilityData.startDateTime).toLocaleDateString()}
      </p>
      <p>
        Time: {new Date(availabilityData.startDateTime).toLocaleTimeString()}
      </p>
    </div>
  );

  return (
    <div className="test-drive-form">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="form-header">
        <h2 className="form-title">Schedule a Test Drive</h2>
      </div>
      {error && <p className="error-message">{error}</p>}
      {reservation && (
        <div className="success-message">
          <p className="font-bold">Test Drive Scheduled!</p>
          <p>
            Your test drive has been scheduled for{" "}
            {new Date(reservation.startDateTime).toLocaleString()}.
          </p>
        </div>
      )}

      <h3 className="section-title">Check Availability</h3>
      {renderAvailabilityForm()}
      {availableVehicle && !reservation && (
        <>
          <h3 className="section-title">Availability Result</h3>
          {renderAvailabilityResult(availableVehicle)}
          <h3 className="section-title">Book Test Drive</h3>
          {renderBookingForm()}
        </>
      )}
    </div>
  );
}
