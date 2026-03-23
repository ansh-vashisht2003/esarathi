import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const API = "http://localhost:5000/api/rides";

/* ICONS */
const driverIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

const pickupIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const dropIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const DriverSoloTrips = () => {
  const driver = JSON.parse(localStorage.getItem("driver"));

  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [route, setRoute] = useState([]);
  const [driverLoc, setDriverLoc] = useState(null);
  const [rideCode, setRideCode] = useState("");

  /* ================= DRIVER LIVE LOCATION ================= */
  useEffect(() => {
    if (!driver?.email) return;

    const watchId = navigator.geolocation.watchPosition((pos) => {
      const loc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setDriverLoc(loc);

      socket.emit("driverOnline", {
        email: driver.email,
        lat: loc.lat,
        lng: loc.lng,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [driver]);

  /* ================= LOAD SEARCHING RIDES ================= */
  const loadRides = async () => {
    const res = await fetch(`${API}/searching`);
    const data = await res.json();
    setRides(data);
  };

  useEffect(() => {
    if (!driver?.email) return;

    socket.emit("joinDriver", driver.email);

    loadRides();

    const handleNewRide = (ride) => {
      setRides((prev) => [ride, ...prev]);
    };

    socket.on("newRideRequest", handleNewRide);

    return () => socket.off("newRideRequest", handleNewRide);
  }, [driver]);

  /* ================= DRAW ROUTE (Driver → Pickup → Drop) ================= */
  useEffect(() => {
    const drawRoute = async () => {
      if (!driverLoc || !selectedRide) return;

      const { pickup, drop } = selectedRide;

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${driverLoc.lng},${driverLoc.lat};${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();

      const coords = data.routes[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

      setRoute(coords);
    };

    drawRoute();
  }, [driverLoc, selectedRide]);

  /* ================= ACCEPT RIDE (🔥 FIXED) ================= */
  const acceptRide = async (rideId) => {
    try {
      const res = await fetch(`${API}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId,
          driverEmail: driver.email, // ✅ IMPORTANT (matches backend)
        }),
      });

      const data = await res.json();

      console.log("✅ Ride accepted:", data);

      alert("✅ Ride Accepted!");
      setSelectedRide(data);
      loadRides();
    } catch (err) {
      console.error("❌ Accept ride error:", err);
    }
  };

  /* ================= START RIDE (CODE) ================= */
  const startRide = async () => {
    if (!rideCode) return alert("Enter ride code");

    const res = await fetch(`${API}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rideCode }),
    });

    const data = await res.json();

    if (data.message) {
      alert("🚕 Ride Started!");
    } else {
      alert("❌ Invalid Code");
    }
  };

  return (
    <div className="bg-green-50 min-h-screen">

      {/* MAP */}
      <div style={{ height: "35vh" }}>
        {driverLoc && (
          <MapContainer
            center={[driverLoc.lat, driverLoc.lng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* DRIVER */}
            <Marker position={[driverLoc.lat, driverLoc.lng]} icon={driverIcon} />

            {/* PICKUP */}
            {selectedRide && (
              <Marker
                position={[selectedRide.pickup.lat, selectedRide.pickup.lng]}
                icon={pickupIcon}
              />
            )}

            {/* DROP */}
            {selectedRide && (
              <Marker
                position={[selectedRide.drop.lat, selectedRide.drop.lng]}
                icon={dropIcon}
              />
            )}

            {/* ROUTE */}
            {route.length > 0 && (
              <Polyline positions={route} color="blue" weight={5} />
            )}
          </MapContainer>
        )}
      </div>

      {/* UI CARD */}
      <div className="bg-white rounded-t-3xl -mt-6 p-5 shadow-xl">

        {/* SELECTED RIDE */}
        {selectedRide ? (
          <div className="bg-green-100 p-4 rounded-xl shadow-lg mb-4">
            <h3 className="text-lg font-bold text-green-800">
              🚕 Active Ride
            </h3>

            <p className="text-sm mt-1">
              <b>Traveller:</b> {selectedRide.traveller.name}
            </p>
            <p className="text-sm">
              <b>Pickup:</b> {selectedRide.pickup.address}
            </p>
            <p className="text-sm">
              <b>Drop:</b> {selectedRide.drop.address}
            </p>
            <p className="text-sm">
              <b>Fare:</b> ₹{selectedRide.fare}
            </p>

            {/* START RIDE */}
            <div className="mt-3">
              <input
                value={rideCode}
                onChange={(e) => setRideCode(e.target.value)}
                placeholder="Enter Ride Code"
                className="w-full border px-3 py-2 rounded-lg mb-2"
              />
              <button
                onClick={startRide}
                className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                Start Ride
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-green-800 mb-3">
              🚗 Nearby Ride Requests
            </h2>

            {rides.length === 0 && (
              <p className="text-gray-500 text-sm">No rides found</p>
            )}

            {rides.map((ride) => (
              <div
                key={ride._id}
                className="border border-green-300 p-3 rounded-xl mb-3 shadow-sm"
              >
                <p className="text-sm">
                  <b>Traveller:</b> {ride.traveller.name}
                </p>
                <p className="text-sm">
                  <b>Pickup:</b> {ride.pickup.address}
                </p>
                <p className="text-sm">
                  <b>Drop:</b> {ride.drop.address}
                </p>
                <p className="text-sm">
                  <b>Vehicle:</b> {ride.vehicleType}
                </p>
                <p className="text-sm font-semibold text-green-700">
                  ₹{ride.fare}
                </p>

                <button
                  onClick={() => acceptRide(ride._id)}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
                >
                  Accept Ride
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverSoloTrips;
