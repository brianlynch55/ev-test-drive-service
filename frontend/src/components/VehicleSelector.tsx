import { ChangeEvent } from "react";

interface VehicleSelectorProps {
  vehicleTypes: string[];
  selectedType: string;
  onSelect: (type: string) => void;
}
// This section is broken out to a separate component 
//to demonstrate a small piece of modular component design
// With more time, I would do this to other sections of the form
export function VehicleSelector({
  vehicleTypes,
  selectedType,
  onSelect,
}: VehicleSelectorProps) {
  const effectiveSelectedType = selectedType || vehicleTypes[0];

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  const formatVehicleType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="form-group">
      <label htmlFor="vehicleType" className="form-label">
        Select Vehicle Type
      </label>
      <select
        id="vehicleType"
        value={effectiveSelectedType}
        onChange={handleChange}
        className="form-select"
      >
        {vehicleTypes.map((type) => (
          <option key={type} value={type}>
            {formatVehicleType(type)}
          </option>
        ))}
      </select>
    </div>
  );
}
