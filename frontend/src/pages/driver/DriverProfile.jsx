import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const DriverProfile = () => {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driver"));

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedToday, setUploadedToday] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!driver) navigate("/driver/login");

    const lastUpload = localStorage.getItem("driverSelfieDate");
    const today = new Date().toDateString();
    if (lastUpload === today) {
      setUploadedToday(true);
    }
  }, []);

  /* ======================
     LOGOUT
  ====================== */
  const logout = () => {
    localStorage.removeItem("driver");
    navigate("/driver/login");
  };

  /* ======================
     CHANGE PASSWORD
  ====================== */
  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      return setMsg("Please fill both password fields ❗");
    }

    setLoading(true);
    const res = await fetch(
      `${API_BASE}/api/driver/change-password/${driver.email}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );

    const data = await res.json();
    setMsg(data.message);
    setLoading(false);
  };

  /* ======================
     CAMERA SYSTEM
  ====================== */

  const startCamera = async () => {
    if (uploadedToday) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch {
      alert("Camera access denied ❌");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const base64Image = canvas.toDataURL("image/png");
    setImage(base64Image);
  };

  const uploadSelfie = async () => {
    if (!image) return alert("Please capture selfie first 📸");

    setLoading(true);

    const res = await fetch(`${API_BASE}/api/driver/selfie/${driver.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const data = await res.json();

    if (res.ok) {
      const today = new Date().toDateString();
      localStorage.setItem("driverSelfieDate", today);
      setUploadedToday(true);

      stopCamera();
      setImage(null);
    }

    setMsg(data.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start p-6">
      <div className="w-full max-w-5xl space-y-6">

        {/* ✅ DRIVER PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={`${API_BASE}/driver_pic/${driver?.profilePic}`}
            alt="Driver"
            className="w-24 h-24 rounded-full border object-cover"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-700">
              {driver?.name}
            </h2>
            <p className="text-gray-600">📧 {driver?.email}</p>
            <p className="text-gray-600">🚗 {driver?.vehicleType}</p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span className="font-semibold text-green-700">
                {driver?.status}
              </span>
            </p>
          </div>

          {/* ✅ BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/driver/dashboard")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Dashboard
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* 🔐 CHANGE PASSWORD */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">
              🔐 Change Password
            </h3>

            <input
              type="password"
              placeholder="Old Password"
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 ring-green-400 outline-none"
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 ring-green-400 outline-none"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>

          {/* 📸 DAILY SELFIE */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">
              📸 Daily Selfie Verification
            </h3>

            {uploadedToday ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center font-semibold">
                ✅ Selfie uploaded for today.
              </div>
            ) : (
              <>
                <div className="border rounded-lg overflow-hidden mb-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-52 object-cover bg-black"
                  />
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>

                <div className="flex gap-3 mb-3">
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Start Camera
                  </button>

                  <button
                    onClick={captureSelfie}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Capture
                  </button>
                </div>

                {image && (
                  <div className="mt-3">
                    <img
                      src={image}
                      alt="Selfie"
                      className="w-full rounded-lg border mb-3"
                    />

                    <button
                      onClick={uploadSelfie}
                      disabled={loading}
                      className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
                    >
                      {loading ? "Uploading..." : "Upload Selfie"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* MESSAGE */}
        {msg && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center font-medium">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverProfile;
