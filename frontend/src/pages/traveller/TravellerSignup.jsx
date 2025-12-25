import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TravellerSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const signup = async () => {
    const res = await fetch(
      "http://localhost:5000/api/traveller/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      navigate("/traveller/verify-otp", { state: { email: form.email } });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[90%] max-w-sm">

        <h2 className="text-3xl font-bold text-center mb-2">
          Create Traveller Account
        </h2>
        <p className="text-sm text-center opacity-90 mb-6">
          Sign up to start your journey
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 p-3 rounded-lg bg-white text-gray-800"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-3 p-3 rounded-lg bg-white text-gray-800"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Create password"
          className="w-full mb-4 p-3 rounded-lg bg-white text-gray-800"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={signup}
          className="w-full bg-white text-green-700 font-semibold py-3 rounded-xl"
        >
          Continue
        </button>

        {message && (
          <p className="text-center text-sm mt-4 opacity-90">
            {message}
          </p>
        )}

        {/* Google Signup (UI only for now) */}
        <button className="w-full mt-4 border border-white py-3 rounded-xl">
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default TravellerSignup;
