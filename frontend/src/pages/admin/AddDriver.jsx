import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const AddDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/drivers/pending`);
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

      await axios.post(`${API_BASE}/api/admin/drivers/verify`, {
        driverId,
        action,
      });

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
        No drivers pending approval 🚗
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 p-10 text-white">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Driver Approval Panel
      </h2>

      {drivers.map((driver) => {
        const profilePic = driver.profilePic
          ? `${API_BASE}/driver_pic/${driver.profilePic}`
          : "https://ui-avatars.com/api/?name=Driver&background=22c55e&color=fff";

        const carImage = `${API_BASE}/driver_pic/${driver.carImage}`;

        return (
          <div
            key={driver._id}
            className="bg-white text-black rounded-2xl p-6 mb-10 max-w-5xl mx-auto shadow-lg"
          >
            {/* HEADER */}
            <div className="flex items-center gap-6 mb-6">
              <img
                src={profilePic}
                alt="Driver"
                className="w-20 h-20 rounded-full object-cover border-4 border-green-500"
              />

              <div>
                <h3 className="text-2xl font-bold">{driver.name}</h3>
                <p className="text-gray-600">{driver.email}</p>
                <p className="text-sm text-green-700 font-semibold">
                  Vehicle Type: {driver.vehicleType}
                </p>
              </div>
            </div>

            {/* DRIVER DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <p>
                <b>DOB:</b>{" "}
                {new Date(driver.dob).toLocaleDateString()}
              </p>
              <p>
                <b>Aadhaar:</b> {driver.aadhaar}
              </p>
              <p>
                <b>Number Plate:</b> {driver.numberPlate}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold">
                  {driver.status}
                </span>
              </p>
            </div>

            {/* CAR IMAGE */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Car Image</h4>
              <img
                src={carImage}
                alt="Car"
                className="rounded-xl w-full max-h-64 object-cover border shadow"
              />
            </div>

            {/* AI VERIFICATION */}
            <div className="mt-5 bg-gray-100 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                🤖 AI Vehicle Verification
              </h4>

              <p>
                Detected Plate:
                <b className="ml-2">
                  {driver.aiCheck?.detectedPlate || "Not detected"}
                </b>
              </p>

              <p>
                Plate Matches Registration:
                <span
                  className={`font-semibold ml-2 ${
                    driver.aiCheck?.plateMatches
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {driver.aiCheck?.plateMatches ? "YES" : "NO"}
                </span>
              </p>

              <p>
                Electric Vehicle Plate:
                <span
                  className={`font-semibold ml-2 ${
                    driver.aiCheck?.electricPlate
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {driver.aiCheck?.electricPlate
                    ? "YES (Green Plate)"
                    : "NO"}
                </span>
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4 mt-8">
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
                Approve
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddDriver;