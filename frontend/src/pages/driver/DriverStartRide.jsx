import { useState } from "react";

const API = "http://localhost:5000/api/rides";

const DriverStartRide = () => {
  const [code, setCode] = useState("");

  const startRide = async () => {
    const res = await fetch(`${API}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rideCode: code }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2>🔑 Enter Ride Code</h2>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter Ride Code"
      />
      <button onClick={startRide}>Start Ride</button>
    </div>
  );
};

export default DriverStartRide;
