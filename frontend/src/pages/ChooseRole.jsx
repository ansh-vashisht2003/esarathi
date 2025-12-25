import { useNavigate } from "react-router-dom";
import { FaUser, FaCar } from "react-icons/fa";

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 w-[90%] max-w-md text-center shadow-xl">

        <h1 className="text-3xl font-bold mb-2">Who are you?</h1>
        <p className="text-sm opacity-90 mb-8">
          Choose how you want to use E-Sarathi
        </p>

        {/* Traveller */}
        <button
          onClick={() => navigate("/traveller/login")}
          className="w-full flex items-center justify-center gap-3 py-3 mb-4 rounded-xl bg-white text-green-700 font-semibold hover:scale-105 transition"
        >
          <FaUser />
          Traveller
        </button>

        {/* Driver */}
        <button
          onClick={() => navigate("/driver/login")}
          className="w-full flex items-center justify-center gap-3 py-3 mb-4 rounded-xl bg-white text-green-700 font-semibold hover:scale-105 transition"
        >
          <FaCar />
          Driver
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;
