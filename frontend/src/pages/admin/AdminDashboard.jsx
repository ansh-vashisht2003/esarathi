import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = sessionStorage.getItem("adminAuth");

    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }

    const handleUnload = () => {
      sessionStorage.removeItem("adminAuth");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-green-900 p-10">
      <h2 className="text-3xl font-bold text-center text-white mb-10">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

        {/* ADD DRIVER */}
        <div
          onClick={() => navigate("/admin/add-driver")}
          className="bg-white text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer text-center"
        >
          <div className="text-3xl">➕</div>
          <p className="mt-4 font-semibold">Add Driver</p>
        </div>

        {/* REMOVE DRIVER */}
        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer text-center">
          <div className="text-3xl">❌</div>
          <p className="mt-4 font-semibold">Remove Driver</p>
        </div>

        {/* CHECK STATS */}
        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer text-center">
          <div className="text-3xl">📊</div>
          <p className="mt-4 font-semibold">Check Stats</p>
        </div>

        {/* DRIVER REQUESTS */}
        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer text-center">
          <div className="text-3xl">🚗</div>
          <p className="mt-4 font-semibold">Driver Requests</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
