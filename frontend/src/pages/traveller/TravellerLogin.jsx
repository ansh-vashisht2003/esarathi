import { useNavigate } from "react-router-dom";

const TravellerLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white">

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-[90%] max-w-sm shadow-xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Traveller Login
        </h2>
        <p className="text-sm text-center opacity-90 mb-6">
          Login to continue your journey
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Forgot password */}
        <div className="text-right mb-6">
          <button
            onClick={() => navigate("/traveller/forgot-password")}
            className="text-sm text-white font-medium opacity-90 hover:opacity-100 hover:underline transition"
          >
            Forgot password?
          </button>
        </div>

        {/* Login button */}
        <button
          className="w-full bg-white text-green-700 font-semibold py-3 rounded-xl hover:scale-105 hover:shadow-lg transition"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/30" />
          <span className="px-3 text-sm opacity-80">OR</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Sign up */}
        <p className="text-center text-sm opacity-90">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/traveller/signup")}
            className="font-semibold text-green-200 hover:underline"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
};

export default TravellerLogin;
