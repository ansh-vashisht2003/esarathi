import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "ADMIN" && password === "ADMIN") {
      sessionStorage.setItem("adminAuth", "true");
  navigate("/admin/dashboard");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-700 to-green-900">
      <form
        onSubmit={handleLogin}
        className="bg-green-600 p-10 rounded-2xl shadow-xl w-[380px]"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Admin Login
        </h2>

        <p className="text-center text-green-100 mb-8">
          Login to manage E-Sarathi
        </p>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-3 rounded-lg bg-white text-gray-800"
         value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

       

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 rounded-lg bg-white text-gray-800"
         value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

      

        {/* BUTTON */}
        <button
          type="submit"
          className="
            w-full bg-white text-green-700
            font-semibold py-3 rounded-lg
            hover:bg-green-100 transition
          "
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
