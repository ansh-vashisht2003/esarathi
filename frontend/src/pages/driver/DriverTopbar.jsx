import { useNavigate } from "react-router-dom";

const DriverTopbar = () => {

  const navigate = useNavigate();

  const driver = JSON.parse(localStorage.getItem("driver"));

  return (
    <div className="bg-green-700 text-white flex justify-between items-center px-6 py-3 shadow-md">

      {/* APP NAME */}
      <h1
        onClick={() => navigate("/driver/dashboard")}
        className="text-xl font-bold cursor-pointer"
      >
        ESarathi Driver
      </h1>

      {/* MENU */}
      <div className="flex gap-6 text-sm font-semibold">

        <button
          onClick={() => navigate("/driver/dashboard")}
          className="hover:text-green-200"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/driver/profile")}
          className="hover:text-green-200"
        >
          Profile
        </button>

      </div>

      {/* DRIVER NAME */}
      <div className="text-sm">
        {driver?.name}
      </div>

    </div>
  );
};

export default DriverTopbar;