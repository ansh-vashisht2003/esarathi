import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const DriverLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/driver/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Save driver in localStorage
      localStorage.setItem("driver", JSON.stringify(data.driver));

      // ✅ Redirect to Driver Dashboard
      navigate("/driver/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-[90%] max-w-sm shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-2">
          Driver Login
        </h2>
        <p className="text-sm text-center opacity-90 mb-6">
          Login to manage your rides
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot password */}
        <div className="text-right mb-4">
          <button
            onClick={() => navigate("/driver/forgot-password")}
            className="text-sm text-white opacity-90 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-200 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-xl transition ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-white text-green-700 hover:scale-105"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/30" />
          <span className="px-3 text-sm opacity-80">OR</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Signup */}
        <p className="text-center text-sm opacity-90">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/driver/signup")}
            className="font-semibold text-green-200 hover:underline"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
};

export default DriverLogin;
