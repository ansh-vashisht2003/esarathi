import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/traveller/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        // move to OTP page later if you want
        // navigate("/traveller/reset-password", { state: { email } });
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white">

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-[90%] max-w-sm shadow-xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-center opacity-90 mb-6">
          We’ll send a one-time password (OTP) to your email
        </p>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Send OTP */}
        <button
          onClick={sendOTP}
          className="w-full bg-white text-green-700 font-semibold py-3 rounded-xl hover:scale-105 hover:shadow-lg transition"
        >
          Send OTP
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 opacity-90">
            {message}
          </p>
        )}

        {/* Back to login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/traveller/login")}
            className="text-sm text-white opacity-90 hover:underline"
          >
            Back to login
          </button>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
