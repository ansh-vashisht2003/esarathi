import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TravellerNavbar from "../components/TravellerNavbar";

/* =========================
   Marker Icons
========================= */
const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/* =========================
   Fit Map to Route
========================= */
const FitBounds = ({ pickup, drop }) => {
  const map = useMap();

  useEffect(() => {
    if (pickup && drop) {
      map.fitBounds(
        [
          [pickup.lat, pickup.lng],
          [drop.lat, drop.lng],
        ],
        { padding: [50, 50] }
      );
    }
  }, [pickup, drop, map]);

  return null;
};

const TravellerBookSolo = () => {
  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  // Pickup
  const [pickupText, setPickupText] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [pickupResults, setPickupResults] = useState([]);

  // Drop
  const [dropText, setDropText] = useState("");
  const [dropCoords, setDropCoords] = useState(null);
  const [dropResults, setDropResults] = useState([]);

  // Route
  const [route, setRoute] = useState([]);

  /* =========================
     Reverse Geocode (India)
  ========================= */
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&countrycodes=in`
      );
      const data = await res.json();
      setPickupText(data.display_name || "Current Location");
    } catch {}
  };

  /* =========================
     Accurate Current Location
  ========================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        // Ignore poor accuracy (IP-based)
        if (accuracy > 1500) return;

        setPickupCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      () => alert("Enable GPS & location access"),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* =========================
     INDIA-ONLY LOCATION SEARCH
  ========================= */
  const searchLocation = async (query, setter) => {
    if (!query || query.length < 3) return;

    // India bounding box
    const INDIA_BBOX = "68.1113787,6.5546079,97.395561,35.6745457";

    let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      query
    )}&limit=6&bbox=${INDIA_BBOX}`;

    // Bias search near pickup
    if (pickupCoords) {
      url += `&lat=${pickupCoords.lat}&lon=${pickupCoords.lng}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    const results = data.features
      .filter(
        (f) =>
          f.properties.country === "India" ||
          f.properties.countrycode === "IN"
      )
      .map((f) => ({
        place_id: f.properties.osm_id,
        display_name: [
          f.properties.name,
          f.properties.city ||
            f.properties.district ||
            f.properties.state,
        ]
          .filter(Boolean)
          .join(", "),
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
      }));

    setter(results);
  };

  /* =========================
     Draw Route (OSRM)
  ========================= */
  useEffect(() => {
    const drawRoute = async () => {
      if (!pickupCoords || !dropCoords) return;

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${dropCoords.lng},${dropCoords.lat}?overview=full&geometries=geojson`
      );

      const data = await res.json();
      const coords = data.routes[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );

      setRoute(coords);
    };

    drawRoute();
  }, [pickupCoords, dropCoords]);

  return (
    <div style={{ background: "#f0fff6", minHeight: "100vh" }}>
      <TravellerNavbar travellerName={travellerName} />

      {/* MAP */}
      <div style={{ height: "45vh" }}>
        {pickupCoords && (
          <MapContainer
            center={[pickupCoords.lat, pickupCoords.lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            {/* NATURAL / GREEN MAP */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <FitBounds pickup={pickupCoords} drop={dropCoords} />

            <Marker
              position={[pickupCoords.lat, pickupCoords.lng]}
              icon={greenIcon}
            />

            {dropCoords && (
              <Marker
                position={[dropCoords.lat, dropCoords.lng]}
                icon={redIcon}
              />
            )}

            {route.length > 0 && (
              <Polyline positions={route} color="#0a7c3a" weight={5} />
            )}
          </MapContainer>
        )}
      </div>

      {/* BOOKING CARD */}
      <div
        style={{
          background: "#fff",
          marginTop: -30,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
        }}
      >
        <h2 style={{ color: "#064b28" }}>Book a Solo Ride</h2>

        {/* PICKUP */}
        <input
          value={pickupText}
          onChange={(e) => {
            setPickupText(e.target.value);
            searchLocation(e.target.value, setPickupResults);
          }}
          placeholder="Pickup location"
          style={{ width: "100%", padding: 12 }}
        />

        {pickupResults.map((loc) => (
          <div
            key={loc.place_id}
            onClick={() => {
              setPickupText(loc.display_name);
              setPickupCoords({ lat: loc.lat, lng: loc.lon });
              setPickupResults([]);
            }}
            style={{ padding: 6, cursor: "pointer" }}
          >
            📍 {loc.display_name}
          </div>
        ))}

        {/* DROP */}
        <input
          value={dropText}
          onChange={(e) => {
            setDropText(e.target.value);
            searchLocation(e.target.value, setDropResults);
          }}
          placeholder="Destination"
          style={{ width: "100%", padding: 12, marginTop: 12 }}
        />

        {dropResults.map((loc) => (
          <div
            key={loc.place_id}
            onClick={() => {
              setDropText(loc.display_name);
              setDropCoords({ lat: loc.lat, lng: loc.lon });
              setDropResults([]);
            }}
            style={{ padding: 6, cursor: "pointer" }}
          >
            📍 {loc.display_name}
          </div>
        ))}

        <button
          disabled={!pickupCoords || !dropCoords}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 14,
            background: pickupCoords && dropCoords ? "#0a7c3a" : "#9fd6b5",
            color: "#fff",
            border: "none",
            borderRadius: 10,
          }}
        >
          Book Ride
        </button>
      </div>
    </div>
  );
};

export default TravellerBookSolo;
