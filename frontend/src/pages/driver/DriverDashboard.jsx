import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUsers } from "react-icons/fa";
import io from "socket.io-client";

const API_BASE = "http://localhost:5000";
const socket = io("http://localhost:5000");

const DriverDashboard = () => {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driver"));

  /* =========================
     AUTH CHECK
  ========================= */
  useEffect(() => {
    if (!driver) {
      navigate("/driver/login");
    }
  }, []);

  /* =========================
     SEND LIVE LOCATION TO SOCKET
  ========================= */
  useEffect(() => {
    if (!driver) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        socket.emit("driverOnline", {
          email: driver.email,
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("driver");
    navigate("/driver/login");
  };

  return (
    <div className="min-h-screen bg-green-50">

      {/* ✅ NAVBAR */}
      <div className="bg-green-700 text-white px-8 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Driver Dashboard 🚗</h2>
        <button
          onClick={logout}
          className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-8 max-w-5xl mx-auto">

        {/* ✅ PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">

          <img
            src={`${API_BASE}/driver_pic/${driver?.profilePic}`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-green-300 shadow-md"
          />

          <h3 className="text-2xl font-bold text-green-800 mt-4">
            Welcome, {driver?.name} 👋
          </h3>

          <p className="text-gray-600 mt-1">
            📧 {driver?.email}
          </p>

          <p className="text-gray-600 mt-1">
            🚗 {driver?.vehicleType}
          </p>

          <span className="mt-3 px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
            {driver?.status}
          </span>

          <button
            onClick={() => navigate("/driver/profile")}
            className="mt-5 px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Profile Settings ⚙️
          </button>
        </div>

        {/* 🚕 RIDES SECTION */}
        <h3 className="text-2xl font-bold text-green-800 mt-10 mb-4 text-center">
          My Rides
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SOLO RIDES */}
         <div
  onClick={() => navigate("/driver/solo-trips")}
  className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer"
>
  <h4 className="text-lg font-semibold text-green-700">
    Find Nearby Rides 🚕
  </h4>
  <p className="text-sm text-gray-600 mt-2">
    View live solo ride requests.
  </p>
</div>


          {/* RIDE SHARING */}
          <div
            onClick={() => navigate("/driver/ride-sharing")}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer flex items-center gap-4"
          >
            <FaUsers className="text-4xl text-green-600" />
            <div>
              <h4 className="text-lg font-semibold text-green-700">
                Ride Sharing
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Manage shared rides with travellers.
              </p>
            </div>
          </div>

        </div>

        {/* OTHER FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-green-700">
              Earnings 💰
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Check your earnings and reports.
            </p>
          </div>

          <div
            onClick={() => navigate("/driver/profile")}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <h4 className="text-lg font-semibold text-green-700">
              Profile Settings ⚙️
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Update profile, password & selfie verification.
            </p>
          </div>

          {/* SUPPORT */}
          <div
            onClick={() => navigate("/driver/support")}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <h4 className="text-lg font-semibold text-green-700">
              Support 📞
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Contact support team.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DriverDashboard;
