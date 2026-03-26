import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Autocomplete,
  TrafficLayer,
  useJsApiLoader
} from "@react-google-maps/api";

import TravellerNavbar from "../components/TravellerNavbar";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const API = "http://localhost:5000/api/rides";

const GOOGLE_KEY = "AIzaSyDwaSxjJlJvRtRfLCUk0Bw4BLy3QUJk4KI";

const mapContainerStyle = {
  width: "100%",
  height: "45vh"
};

const vehicleRates = {
  motorcycle: 6,
  mini: 10,
  suv: 15,
  xuv: 18
};

const vehicles = [
  { id: "motorcycle", name: "Motorcycle", icon: "🏍" },
  { id: "mini", name: "Car Mini", icon: "🚗" },
  { id: "suv", name: "Car SUV", icon: "🚙" },
  { id: "xuv", name: "Car XUV", icon: "🚘" }
];

export default function TravellerBookSolo() {

  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_KEY,
    libraries: ["places"]
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);

  const [pickupAuto, setPickupAuto] = useState(null);
  const [dropAuto, setDropAuto] = useState(null);

  const [pickupText, setPickupText] = useState("");
  const [dropText, setDropText] = useState("");

  const [vehicle, setVehicle] = useState("mini");

  const [directions, setDirections] = useState(null);

  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState(0);
  const [price, setPrice] = useState(0);

  const [surge, setSurge] = useState(1);
  const [showTraffic, setShowTraffic] = useState(true);

  /* -------- CURRENT LOCATION -------- */

  useEffect(() => {

  navigator.geolocation.getCurrentPosition(

    (pos) => {

      const { latitude, longitude } = pos.coords;

      const coords = {
        lat: latitude,
        lng: longitude
      };

      setPickupCoords(coords);

      /* convert lat lng → real address */

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: coords }, (results, status) => {

        if (status === "OK" && results[0]) {

          setPickupText(results[0].formatted_address);

        } else {

          setPickupText("Unknown Location");

        }

      });

    },

    (err) => {
      console.log("GPS error:", err);
    },

    {
      enableHighAccuracy: true
    }

  );

}, []);

  /* -------- PICKUP CHANGE -------- */

  const pickupChanged = () => {

    if (!pickupAuto) return;

    const place = pickupAuto.getPlace();
    if (!place.geometry) return;

    const loc = place.geometry.location;

    setPickupCoords({
      lat: loc.lat(),
      lng: loc.lng()
    });

    setPickupText(place.formatted_address || place.name);
  };

  /* -------- DESTINATION CHANGE -------- */

  const dropChanged = () => {

    if (!dropAuto) return;

    const place = dropAuto.getPlace();
    if (!place.geometry) return;

    const loc = place.geometry.location;

    setDropCoords({
      lat: loc.lat(),
      lng: loc.lng()
    });

    setDropText(place.formatted_address || place.name);
  };

  /* -------- ROUTE + SURGE CALCULATION -------- */

  useEffect(() => {

    if (!pickupCoords || !dropCoords || !isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: pickupCoords,
        destination: dropCoords,
        travelMode: "DRIVING"
      },
      (result, status) => {

        if (status === "OK") {

          setDirections(result);

          const leg = result.routes[0].legs[0];

          const km = leg.distance.value / 1000;
          const minutes = leg.duration.value / 60;

          setDistance(km.toFixed(2));
          setEta(Math.ceil(minutes));

          /* -------- SURGE CALCULATION -------- */

          let surgeMultiplier = 1;

          const hour = new Date().getHours();

          if (hour >= 8 && hour <= 10) surgeMultiplier += 0.3;
          if (hour >= 18 && hour <= 21) surgeMultiplier += 0.3;

          if (minutes / km > 3) surgeMultiplier += 0.5;
          else if (minutes / km > 2) surgeMultiplier += 0.2;

          setSurge(surgeMultiplier);

          const rate = vehicleRates[vehicle];

          const finalFare = km * rate * surgeMultiplier;

          setPrice(Math.ceil(finalFare));

        }

      }
    );

  }, [pickupCoords, dropCoords, vehicle, isLoaded]);

  /* -------- BOOK RIDE -------- */

  const bookRide = async () => {

    if (!pickupCoords || !dropCoords) return;

    const rideData = {

      traveller: {
        name: traveller?.name,
        email: traveller?.email
      },

      pickup: {
        address: pickupText,
        ...pickupCoords
      },

      drop: {
        address: dropText,
        ...dropCoords
      },

      vehicleType: vehicle,
      distance,
      eta,
      fare: price

    };

    const res = await fetch(`${API}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rideData)
    });

    const ride = await res.json();

    socket.emit("rideRequest", ride);
  };

  if (!isLoaded) return <div className="p-10">Loading Map...</div>;

  return (

    <div className="bg-green-50 min-h-screen">

      <TravellerNavbar travellerName={travellerName} />

      {/* SEARCH CARD */}

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-5 mt-5">

        <Autocomplete
          onLoad={(auto) => setPickupAuto(auto)}
          onPlaceChanged={pickupChanged}
        >
          <input
            value={pickupText}
            onChange={(e) => setPickupText(e.target.value)}
            placeholder="Pickup Location"
            className="w-full border border-green-300 p-3 rounded-lg mb-3"
          />
        </Autocomplete>

        <Autocomplete
          onLoad={(auto) => setDropAuto(auto)}
          onPlaceChanged={dropChanged}
        >
          <input
            value={dropText}
            onChange={(e) => setDropText(e.target.value)}
            placeholder="Destination"
            className="w-full border border-green-300 p-3 rounded-lg"
          />
        </Autocomplete>

      </div>

      {/* MAP */}

      <div className="max-w-4xl mx-auto mt-4 px-4">

        {pickupCoords && (

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={pickupCoords}
            zoom={14}
          >

            {showTraffic && <TrafficLayer />}

            <Marker
              position={pickupCoords}
              icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            />

            {dropCoords && (

              <Marker
                position={dropCoords}
                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              />

            )}

            {directions && (
              <DirectionsRenderer directions={directions} />
            )}

          </GoogleMap>

        )}

      </div>

      {/* TRAFFIC BUTTON */}

      <div className="text-center mt-3">

        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          {showTraffic ? "Hide Traffic" : "Show Traffic"}
        </button>

      </div>

      {/* VEHICLE SELECTION */}

      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-3 mt-5 px-4">

        {vehicles.map((v) => (

          <button
            key={v.id}
            onClick={() => setVehicle(v.id)}
            className={`p-4 rounded-xl border text-center font-semibold
            ${
              vehicle === v.id
                ? "bg-green-600 text-white"
                : "bg-white border-green-300 text-green-700"
            }`}
          >

            <div className="text-xl">{v.icon}</div>
            <div className="text-sm">{v.name}</div>

          </button>

        ))}

      </div>

      {/* FARE CARD */}

      {distance > 0 && (

        <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-lg p-6 text-center">

          <p className="text-gray-600">
            Distance: <b>{distance} km</b>
          </p>

          <p className="text-gray-600">
            ETA: <b>{eta} mins</b>
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹ {price}
          </p>

          {surge > 1 && (
            <p className="text-red-500 text-sm mt-1">
              🔥 Surge pricing active
            </p>
          )}

          <button
            onClick={bookRide}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Book Ride
          </button>

        </div>

      )}

    </div>
  );
}