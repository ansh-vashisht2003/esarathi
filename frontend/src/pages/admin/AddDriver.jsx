import { useEffect, useState } from "react";
import axios from "axios";

const AddDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("/api/admin/drivers/pending");
      setDrivers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (driverId, action) => {
    try {
      setActionLoading(driverId + action);

      await axios.post("/api/admin/drivers/verify", {
        driverId,
        action,
      });

      // Refresh list after approve/reject
      fetchDrivers();
    } catch (error) {
      console.error("Action failed:", error);
      alert("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-900 text-white">
        Loading drivers...
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-900 text-white">
        No drivers pending approval
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 p-10 text-white">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Driver Approval
      </h2>

      {drivers.map((driver) => (
        <div
          key={driver._id}
          className="bg-white text-black rounded-xl p-6 mb-10 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-2">{driver.name}</h3>
          <p><b>Email:</b> {driver.email}</p>
          <p><b>Aadhaar:</b> {driver.aadhaar}</p>

          {/* IMAGE + NUMBER PLATE (COLUMN WISE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* LEFT: CAR IMAGE */}
            <img
              src={`http://localhost:5000/${driver.carImage.replace(/\\/g, "/")}`}
              alt="Car"
              className="rounded-lg w-full h-48 object-cover border"
            />

            {/* RIGHT: NUMBER PLATE */}
            <div className="flex items-center justify-center">
              <p className="text-xl font-semibold">
                Number Plate: <br />
                <span className="text-green-700">{driver.numberPlate}</span>
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => handleAction(driver._id, "REJECT")}
              disabled={actionLoading === driver._id + "REJECT"}
              className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>

            <button
              onClick={() => handleAction(driver._id, "APPROVE")}
              disabled={actionLoading === driver._id + "APPROVE"}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddDriver;
