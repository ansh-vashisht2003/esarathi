import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCar, FaPhone } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const DriverSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    aadhaar: "",
    numberPlate: "",
    vehicleType: "Car",
    profilePic: null,
    carImage: null,
  });

  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewCar, setPreviewCar] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (!file) return;

    setForm({ ...form, [name]: file });

    const reader = new FileReader();
    reader.onload = () => {
      if (name === "profilePic") setPreviewProfile(reader.result);
      if (name === "carImage") setPreviewCar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Age validation (>=18)
  const isAdult = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const submitSignup = async () => {
    setError("");

    if (!form.name || !form.email || !form.dob || !form.phone) {
      return setError("Please fill all required fields");
    }

    if (!isAdult(form.dob)) {
      return setError("Driver must be at least 18 years old");
    }

    if (!form.carImage) {
      return setError("Vehicle photo is required");
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));

    try {
      const res = await fetch(`${API_BASE}/api/driver/signup`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        return setError(result.message || "Signup failed");
      }

      alert("Driver registered successfully 🚗. Please check your email.");
      navigate("/driver/login");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white px-4 py-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-2">
          Driver Registration
        </h2>
        <p className="text-sm text-center opacity-90 mb-6">
          Register as a driver and start earning 🚀
        </p>

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
            placeholder="Email"
            className="input"
            onChange={handleChange}
          />

          {/* Phone Number */}
          
            <input
              name="phone"
              placeholder="Phone Number"
              className="input flex-1"
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

          {/* Vehicle Type */}
          <select
            name="vehicleType"
            className="input text-black"
            onChange={handleChange}
          >
            <option>Bike</option>
            <option>Car</option>
            <option>Auto</option>
            <option>SUV</option>
            <option>Truck</option>
          </select>

          {/* PROFILE PICTURE */}
          <div>
            <label className="text-sm mb-2 block">Profile Picture</label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/40 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition">
              {previewProfile ? (
                <img
                  src={previewProfile}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="flex flex-col items-center text-white/80">
                  <FaUserCircle className="text-5xl mb-2" />
                  <p className="text-sm">Click to upload profile photo</p>
                </div>
              )}

              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>

          {/* VEHICLE IMAGE */}
          <div>
            <label className="text-sm mb-2 block">Vehicle Photo</label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/40 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition">
              {previewCar ? (
                <img
                  src={previewCar}
                  alt="Car Preview"
                  className="w-full h-40 object-cover rounded-lg border-2 border-white"
                />
              ) : (
                <div className="flex flex-col items-center text-white/80">
                  <FaCar className="text-5xl mb-2" />
                  <p className="text-sm">Click to upload vehicle photo</p>
                </div>
              )}

              <input
                type="file"
                name="carImage"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-200 text-sm text-center mt-3">
            {error}
          </p>
        )}

        <button
          onClick={submitSignup}
          className="w-full mt-6 bg-white text-green-700 font-semibold py-3 rounded-xl hover:scale-105 hover:shadow-lg transition"
        >
          Submit for Approval
        </button>

        <p className="text-xs text-center opacity-80 mt-4">
          After approval, you can login as a driver.
        </p>

      </div>
    </div>
  );
};

export default DriverSignup;
