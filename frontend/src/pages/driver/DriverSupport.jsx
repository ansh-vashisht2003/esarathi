import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const DriverSupport = () => {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driver"));

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const sendSupport = async (e) => {
    e.preventDefault();

    if (!subject || !message) {
      return setMsg("Please fill subject and message ❗");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/driver/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: driver?.name,
          email: driver?.email,
          subject,
          message,
        }),
      });

      const data = await res.json();
      setMsg(data.message);

      if (res.ok) {
        setSubject("");
        setMessage("");
      }
    } catch {
      setMsg("Failed to send support request ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">
            Driver Support 📞
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Contact E-Sarathi support team
          </p>
        </div>

        {/* DRIVER INFO */}
        <div className="bg-green-100 p-4 rounded-lg mb-5 text-sm text-green-800">
          <p><b>Name:</b> {driver?.name}</p>
          <p><b>Email:</b> {driver?.email}</p>
        </div>

        {/* FORM */}
        <form onSubmit={sendSupport} className="space-y-4">

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 ring-green-400 outline-none"
          />

          <textarea
            rows="5"
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 ring-green-400 outline-none resize-none"
          />

          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Sending..." : "Send Support Request"}
          </button>
        </form>

        {/* MESSAGE */}
        {msg && (
          <p className="text-center text-sm mt-4 text-green-700 font-medium">
            {msg}
          </p>
        )}

        {/* 📞 EXTRA CONTACT INFO */}
        <div className="mt-6 bg-gray-50 border rounded-xl p-4 text-center">
          <p className="text-sm text-gray-700 font-medium">
            For urgent issues or technical errors, contact us directly:
          </p>
          <p className="text-lg font-bold text-green-700 mt-1">
            📞 6284717464
          </p>
          <p className="text-sm text-gray-600 mt-1">
            or email us at
          </p>
          <p className="text-sm font-semibold text-green-700">
            ✉️ anshvashisht.2003@gmail.com
          </p>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/driver/dashboard")}
          className="w-full mt-4 text-green-700 font-semibold hover:underline"
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
};

export default DriverSupport;
