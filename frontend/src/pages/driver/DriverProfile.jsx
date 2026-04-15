import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUsers, FaLock, FaCamera, FaSignOutAlt, FaWallet, FaCheckCircle } from "react-icons/fa";

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
  const [earnings, setEarnings] = useState(0);
  const [pastRides, setPastRides] = useState([]);
  const [shareRides, setShareRides] = useState([]);

  useEffect(() => {
    if (!driver) navigate("/driver/login");
    const lastUpload = localStorage.getItem("driverSelfieDate");
    const today = new Date().toDateString();
    if (lastUpload === today) setUploadedToday(true);

    loadDriverStats();
    loadShareRides();
  }, []);

  const loadDriverStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rides/driver/${driver.email}`);
      const data = await res.json();
      setEarnings(data.totalEarnings || 0);
      setPastRides(data.rides || []);
    } catch (err) { console.log(err); }
  };

  const loadShareRides = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/share-rides/driver/${driver.email}`);
      const data = await res.json();
      setShareRides(data || []);
    } catch (err) { console.log(err); }
  };

  const logout = () => {
    localStorage.removeItem("driver");
    navigate("/driver/login");
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) return setMsg("Please fill both fields");
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/driver/change-password/${driver.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    setMsg(data.message);
    setLoading(false);
  };

  const startCamera = async () => {
    if (uploadedToday) return;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch { alert("Camera access denied ❌"); }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
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
    setImage(canvas.toDataURL("image/png"));
  };

  const uploadSelfie = async () => {
    if (!image) return alert("Capture selfie first");
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/driver/selfie/${driver.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    if (res.ok) {
      localStorage.setItem("driverSelfieDate", new Date().toDateString());
      setUploadedToday(true);
      stopCamera();
      setImage(null);
    }
    const data = await res.json();
    setMsg(data.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER NAVBAR */}
      <div className="bg-green-700 text-white p-4 shadow-md mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">E-Sarathi Driver Dashboard</h1>
          <button onClick={logout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition text-sm font-semibold">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PROFILE & STATS */}
        <div className="lg:col-span-1 space-y-6">
          {/* DRIVER CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="relative inline-block">
              <img
                src={`${API_BASE}/driver_pic/${driver?.profilePic}`}
                alt="Driver"
                className="w-24 h-24 rounded-full border-4 border-green-100 object-cover mx-auto"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 p-1.5 rounded-full border-2 border-white">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-4">{driver?.name}</h2>
            <p className="text-gray-500 text-sm">{driver?.email}</p>
            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-2 font-bold uppercase tracking-wider">
              {driver?.vehicleType}
            </span>
          </div>

          {/* EARNINGS CARD */}
          <div className="bg-green-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <FaWallet className="absolute -right-4 -bottom-4 text-8xl text-green-600 opacity-30" />
            <p className="text-green-100 text-sm font-medium">Total Wallet Earnings</p>
            <p className="text-4xl font-extrabold mt-1">₹{earnings}</p>
            <div className="mt-4 pt-4 border-t border-green-600 flex justify-between text-xs">
              <span>Total Rides: {pastRides.length + shareRides.length}</span>
              <span>Level: Silver</span>
            </div>
          </div>

          {/* PASSWORD SETTINGS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaLock className="text-green-600" /> Account Security
            </h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Old Password"
                className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={changePassword}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition text-sm"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RIDES & VERIFICATION */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DAILY VERIFICATION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaCamera className="text-green-600" /> Daily Verification
              </h3>
              {uploadedToday && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Verified Today</span>}
            </div>

            {uploadedToday ? (
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700">
                <FaCheckCircle className="text-xl" />
                <p className="text-sm font-medium">Your daily attendance is already marked. You are ready to ride!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-60 mx-auto">
                  <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden"></canvas>
                  {!stream && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm italic">
                      Camera is off
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {!stream ? (
                    <button onClick={startCamera} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold">Start Camera</button>
                  ) : (
                    <button onClick={captureSelfie} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold">Take Snap</button>
                  )}
                </div>

                {image && (
                  <div className="pt-4 border-t flex items-center gap-4">
                    <img src={image} className="w-24 h-24 rounded-lg border shadow-sm" />
                    <button onClick={uploadSelfie} className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 shadow-md">
                      {loading ? "Uploading..." : "Confirm & Upload"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIDE HISTORY TABS (GRID) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SOLO RIDES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCar className="text-green-600" /> Solo Ride History
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {pastRides.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-10">No rides yet</p>
                ) : (
                  pastRides.map((ride) => (
                    <div key={ride._id} className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-green-700">₹{ride.fare}</span>
                        <span className="text-[10px] text-gray-400">{new Date(ride.completedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-700 truncate">● {ride.pickup.address}</p>
                      <p className="text-xs text-gray-700 truncate">● {ride.drop.address}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SHARED RIDES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUsers className="text-green-600" /> Upcoming Shared
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {shareRides.length === 0 ? (
                  <p className="text-gray-400 text-sm italic text-center py-10">No upcoming rides</p>
                ) : (
                  shareRides.map((ride) => (
                    <div key={ride._id} className="bg-green-50 border border-green-100 p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-800">{ride.date}</span>
                        <span className="text-xs font-bold text-green-700">₹{ride.totalPrice}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-600">
                        <span>{ride.pickup.city}</span>
                        <span>→</span>
                        <span>{ride.drop.city}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FEEDBACK MSG */}
      {msg && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-green-600 shadow-2xl p-4 rounded-lg animate-bounce">
          <p className="text-sm font-bold text-green-800">{msg}</p>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;