import React from "react";
import { TestDriveForm } from "./components/TestDriveForm";
import "./App.css";

const App = () => {
  return (
    <div className="container">
      <h1 className="title">EV Test Drive Booking</h1>
      <TestDriveForm />
    </div>
  );
};

export default App;
