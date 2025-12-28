import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const VerifyDriverOTP = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const verifyOTP = async () => {
    console.log("Verifying OTP for:", state.email);
    navigate("/driver/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[90%] max-w-sm">

        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Email
        </h2>
        <p className="text-sm text-center opacity-90 mb-6">
          Enter OTP sent to your email
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit OTP"
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-800"
        />

        <button
          onClick={verifyOTP}
          className="w-full bg-white text-green-700 font-semibold py-3 rounded-xl"
        >
          Verify
        </button>

      </div>
    </div>
  );
};

export default VerifyDriverOTP;
