import { useEffect, useRef, useState } from "react";
import TravellerNavbar from "../components/TravellerNavbar";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "50vh",
};

const TravellerBookSolo = () => {
  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [currentPos, setCurrentPos] = useState(null);
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState("");
  const [distance, setDistance] = useState("");
  const [driverPos, setDriverPos] = useState(null);

  const driverIntervalRef = useRef(null);

  /* ================= GOOGLE MAP LOADER ================= */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  /* ================= GET LIVE USER LOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setCurrentPos(location);
      setPickup("Current Location");
    });
  }, []);

  /* ================= DRAW ROUTE ================= */
  const calculateRoute = async () => {
    if (!pickup || !destination || !currentPos) return;

    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: currentPos,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirections(result);

    const leg = result.routes[0].legs[0];
    setDistance(leg.distance.text);
    setEta(leg.duration.text);

    // Start driver simulation
    simulateDriver(result.routes[0].overview_path);
  };

  /* ================= DRIVER MOVEMENT SIMULATION ================= */
  const simulateDriver = (path) => {
    if (!path || path.length === 0) return;

    let index = 0;
    setDriverPos({
      lat: path[0].lat(),
      lng: path[0].lng(),
    });

    driverIntervalRef.current = setInterval(() => {
      index++;
      if (index >= path.length) {
        clearInterval(driverIntervalRef.current);
        return;
      }

      setDriverPos({
        lat: path[index].lat(),
        lng: path[index].lng(),
      });
    }, 1000); // driver moves every 1 second
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <TravellerNavbar travellerName={travellerName} />

      {/* ================= MAP ================= */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPos || { lat: 20.5937, lng: 78.9629 }}
        zoom={14}
      >
        {currentPos && (
          <Marker position={currentPos} label="You" />
        )}

        {driverPos && (
          <Marker
            position={driverPos}
            icon={{
              url: "https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {directions && (
          <DirectionsRenderer directions={directions} />
        )}
      </GoogleMap>

      {/* ================= BOTTOM SHEET ================= */}
      <div className="bg-white rounded-t-3xl p-6 shadow-xl -mt-6 relative z-10">
        <h2 className="text-xl font-bold text-green-800 mb-4">
          Book a Solo Ride
        </h2>

        {/* PICKUP */}
        <input
          value={pickup}
          disabled
          className="w-full mb-3 p-3 rounded-lg bg-gray-100"
        />

        {/* DESTINATION */}
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Drop location"
          className="w-full mb-3 p-3 rounded-lg bg-gray-100"
        />

        <button
          onClick={calculateRoute}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold"
        >
          Show Route
        </button>

        {/* ETA & DISTANCE */}
        {eta && distance && (
          <div className="mt-4 bg-green-50 p-4 rounded-xl">
            <p><b>Estimated Time:</b> {eta}</p>
            <p><b>Distance:</b> {distance}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravellerBookSolo;
