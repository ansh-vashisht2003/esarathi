import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DriverSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    aadhaar: "",
    numberPlate: "",
    carImage: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, carImage: e.target.files[0] });
  };

  // ✅ FIXED: real backend call
  const submitSignup = async () => {
    const data = new FormData();
    data.append("name", form.name);
    data.append("dob", form.dob);
    data.append("email", form.email);
    data.append("aadhaar", form.aadhaar);
    data.append("numberPlate", form.numberPlate);
    data.append("carImage", form.carImage);

    try {
      const res = await fetch("http://localhost:5000/api/driver/signup", {
        method: "POST",
        body: data, // ❗ DO NOT add headers
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Signup failed");
        return;
      }

      alert(result.message);
      navigate("/driver/login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white px-4 py-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-xl">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Driver Registration
        </h2>
        <p className="text-sm text-center opacity-90 mb-8">
          Submit your details. Our team will review and approve your account.
        </p>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="input"
            onChange={handleChange}
          />

          <input
            name="dob"
            type="date"
            className="input"
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="input"
            onChange={handleChange}
          />

          <input
            name="aadhaar"
            placeholder="Aadhaar Number"
            className="input"
            onChange={handleChange}
          />

          <input
            name="numberPlate"
            placeholder="Vehicle Number Plate"
            className="input"
            onChange={handleChange}
          />

          {/* Upload */}
          <div>
            <label className="block text-sm opacity-90 mb-1">
              Car front photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-white file:text-green-700
                         hover:file:bg-green-100"
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={submitSignup}
          className="w-full mt-8 bg-white text-green-700 font-semibold py-3 rounded-xl
                     hover:scale-105 hover:shadow-lg transition"
        >
          Submit for Approval
        </button>

        {/* Info */}
        <p className="text-xs text-center opacity-80 mt-6">
          If approved, login credentials will be sent to your email.
        </p>

      </div>
    </div>
  );
};

export default DriverSignup;
