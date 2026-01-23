import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCar } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

const DriverSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    aadhaar: "",
    numberPlate: "",
    vehicleType: "Car",
    profilePic: null,
    carImage: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const submitSignup = async () => {
    const data = new FormData();
    data.append("name", form.name);
    data.append("dob", form.dob);
    data.append("email", form.email);
    data.append("aadhaar", form.aadhaar);
    data.append("numberPlate", form.numberPlate);
    data.append("vehicleType", form.vehicleType);
    data.append("profilePic", form.profilePic);
    data.append("carImage", form.carImage);

    try {
      const res = await fetch(`${API_BASE}/api/driver/signup`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Signup failed");
        return;
      }

      alert("Driver registered successfully 🚗");
      navigate("/driver/login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Server error");
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

          <input name="name" placeholder="Full Name" className="input" onChange={handleChange} />
          <input name="dob" type="date" className="input" onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" className="input" onChange={handleChange} />
          <input name="aadhaar" placeholder="Aadhaar Number" className="input" onChange={handleChange} />
          <input name="numberPlate" placeholder="Vehicle Number Plate" className="input" onChange={handleChange} />

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

          {/* Profile Pic */}
          <div>
            <label className="text-sm mb-1 block">Profile Picture</label>
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-3xl" />
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleFile}
                className="text-sm"
              />
            </div>
          </div>

          {/* Car Image */}
          <div>
            <label className="text-sm mb-1 block">Vehicle Photo</label>
            <div className="flex items-center gap-3">
              <FaCar className="text-3xl" />
              <input
                type="file"
                name="carImage"
                accept="image/*"
                onChange={handleFile}
                className="text-sm"
              />
            </div>
          </div>
        </div>

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
