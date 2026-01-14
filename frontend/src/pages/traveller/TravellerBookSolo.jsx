import { useEffect, useRef, useState } from "react";
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
   Fit Map Bounds
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

/* =========================
   Suggestion Item
========================= */
const SuggestionItem = ({ icon, text, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "12px",
      display: "flex",
      gap: 10,
      cursor: "pointer",
      borderBottom: "1px solid #eee",
      fontSize: 14,
      alignItems: "center",
      background: "#fff",
    }}
  >
    <span style={{ fontSize: 18 }}>{icon}</span>
    <span>{text}</span>
  </div>
);

const TravellerBookSolo = () => {
  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  // Pickup
  const [pickupText, setPickupText] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [pickupResults, setPickupResults] = useState([]);
  const [pickupLoading, setPickupLoading] = useState(false);

  // Drop
  const [dropText, setDropText] = useState("");
  const [dropCoords, setDropCoords] = useState(null);
  const [dropResults, setDropResults] = useState([]);
  const [dropLoading, setDropLoading] = useState(false);

  // Route
  const [route, setRoute] = useState([]);

  // Cache + debounce refs
  const cacheRef = useRef({});
  const debounceTimer = useRef(null);

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
     Accurate GPS Location
  ========================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > 1500) return;

        setPickupCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      () => alert("Enable GPS & location access"),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* =========================
     DEBOUNCED + CACHED SEARCH
  ========================= */
  const searchLocation = (query, setter, setLoading) => {
    if (!query || query.length < 3) {
      setter([]);
      setLoading(false);
      return;
    }

    // Clear old debounce
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      // Cache hit
      if (cacheRef.current[query]) {
        setter(cacheRef.current[query]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const INDIA_BBOX = "68.1113787,6.5546079,97.395561,35.6745457";

      let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query
      )}&limit=6&bbox=${INDIA_BBOX}`;

      if (pickupCoords) {
        url += `&lat=${pickupCoords.lat}&lon=${pickupCoords.lng}`;
      }

      try {
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

        cacheRef.current[query] = results;
        setter(results);
      } catch {
        setter([]);
      } finally {
        setLoading(false);
      }
    }, 400); // 👈 debounce delay
  };

  /* =========================
     Draw Route
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
      ><br></br>
        <h2 style={{ color: "#064b28", marginBottom: 12 }}>
          Book a Solo Ride
        </h2>
<br></br>
        {/* PICKUP */}
        <input
          value={pickupText}
          onChange={(e) => {
            setPickupText(e.target.value);
            searchLocation(
              e.target.value,
              setPickupResults,
              setPickupLoading
            );
          }}
          placeholder="Enter pickup location"
          style={{ width: "100%", padding: 14 }}
        />

        {pickupLoading && (
          <div style={{ padding: 8, color: "#777" }}>
            Searching pickup locations…
          </div>
        )}

        {pickupResults.map((loc) => (
          <SuggestionItem
            key={loc.place_id}
            icon="🟢"
            text={loc.display_name}
            onClick={() => {
              setPickupText(loc.display_name);
              setPickupCoords({ lat: loc.lat, lng: loc.lon });
              setPickupResults([]);
            }}
          />
        ))}

        {/* DROP */}
        <input
          value={dropText}
          onChange={(e) => {
            setDropText(e.target.value);
            searchLocation(
              e.target.value,
              setDropResults,
              setDropLoading
            );
          }}
          placeholder="Where to?"
          style={{ width: "100%", padding: 14, marginTop: 12 }}
        />

        {dropLoading && (
          <div style={{ padding: 8, color: "#777" }}>
            Searching destinations…
          </div>
        )}

        {dropResults.map((loc) => (
          <SuggestionItem
            key={loc.place_id}
            icon="🔴"
            text={loc.display_name}
            onClick={() => {
              setDropText(loc.display_name);
              setDropCoords({ lat: loc.lat, lng: loc.lon });
              setDropResults([]);
            }}
          />
        ))}

        <button
          disabled={!pickupCoords || !dropCoords}
          style={{
            width: "100%",
            marginTop: 18,
            padding: 14,
            background:
              pickupCoords && dropCoords ? "#0a7c3a" : "#9fd6b5",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
          }}
        >
          Book Ride
        </button>
      </div>
    </div>
  );
};

export default TravellerBookSolo;