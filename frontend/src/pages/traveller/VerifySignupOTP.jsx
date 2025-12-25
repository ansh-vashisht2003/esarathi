import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const VerifySignupOTP = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const verifyOTP = async () => {
    const res = await fetch(
      "http://localhost:5000/api/traveller/verify-signup-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, otp }),
      }
    );

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      navigate("/traveller/login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[90%] max-w-sm">

        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Email
        </h2>
        <p className="text-sm text-center opacity-90 mb-6">
          Enter the OTP sent to your email
        </p>

        <input
          type="text"
          placeholder="6-digit OTP"
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-800"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOTP}
          className="w-full bg-white text-green-700 font-semibold py-3 rounded-xl"
        >
          Verify & Continue
        </button>

        {message && (
          <p className="text-center text-sm mt-4 opacity-90">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifySignupOTP;
