import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUsers } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driver"));

  useEffect(() => {
    if (!driver) {
      navigate("/driver/login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("driver");
    navigate("/driver/login");
  };

  return (
    <div className="min-h-screen bg-green-50">

      {/* TOP BAR */}
      <div className="bg-green-700 text-white px-8 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Driver Dashboard 🚗</h2>
        <button
          onClick={logout}
          className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-8 max-w-5xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
          <img
            src={`${API_BASE}/driver_pic/${driver?.profilePic}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div>
            <h3 className="text-xl font-bold text-green-800">
              Welcome, {driver?.name} 👋
            </h3>
            <p className="text-gray-600">Email: {driver?.email}</p>
            <p className="text-gray-600">Vehicle: {driver?.vehicleType}</p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span className="font-semibold text-green-700">
                {driver?.status}
              </span>
            </p>
          </div>
        </div>

        {/* 🚕 RIDES SECTION */}
        <h3 className="text-2xl font-bold text-green-800 mt-10 mb-4">
          My Rides
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SOLO RIDES */}
          <div
            onClick={() => navigate("/driver/solo-rides")}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer flex items-center gap-4"
          >
            <FaCar className="text-4xl text-green-600" />
            <div>
              <h4 className="text-lg font-semibold text-green-700">
                Solo Rides
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                View and manage your solo rides.
              </p>
            </div>
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
                Manage shared rides with multiple travellers.
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

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-green-700">
              Support 📞
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              Contact support if needed.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DriverDashboard;
