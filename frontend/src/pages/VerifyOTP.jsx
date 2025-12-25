import { api } from "../services/api";
import { useState } from "react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");

  const verify = async () => {
    await api.post("/auth/verify-otp", {
      email: "anshvashisht.2003@gmail.com",
      otp
    });
    alert("Verified");
  };

  return (
    <>
      <input onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verify}>Verify OTP</button>
    </>
  );
};

export default VerifyOTP;
