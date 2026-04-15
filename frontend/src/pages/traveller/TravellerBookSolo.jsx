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

  const [showTraffic, setShowTraffic] = useState(true);

  const [currentRide, setCurrentRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [rideCode, setRideCode] = useState("");
  const [rideStarted, setRideStarted] = useState(false);

  /* SOCKET EVENTS */

  useEffect(() => {

    if (!traveller?.email) return;

    socket.emit("joinTraveller", traveller.email);

    socket.on("rideDriverAssigned", (data) => {
      setDriver(data.driver);
      setRideCode(data.rideCode);
    });

    socket.on("rideStarted", () => {
      setRideStarted(true);
    });

    return () => {
      socket.off("rideDriverAssigned");
      socket.off("rideStarted");
    };

  }, []);

  /* CURRENT LOCATION */

  useEffect(() => {

    navigator.geolocation.getCurrentPosition((pos) => {

      const { latitude, longitude } = pos.coords;

      const coords = {
        lat: latitude,
        lng: longitude
      };

      setPickupCoords(coords);

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: coords }, (results, status) => {

        if (status === "OK" && results[0]) {
          setPickupText(results[0].formatted_address);
        }

      });

    });

  }, []);

  /* PICKUP SELECT */

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

  /* DROP SELECT */

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

  /* ROUTE + FARE */

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

          const rate = vehicleRates[vehicle];
          const finalFare = km * rate;

          setPrice(Math.ceil(finalFare));

        }

      }
    );

  }, [pickupCoords, dropCoords, vehicle, isLoaded]);

  /* BOOK RIDE */

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

    setCurrentRide(ride);

  };

  if (!isLoaded) return <div className="p-10">Loading Map...</div>;

  return (

    <div className="bg-green-50 min-h-screen">

      <TravellerNavbar travellerName={travellerName} />

      {/* PICKUP + DESTINATION INPUTS */}

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-5 mt-5">

        <Autocomplete
          onLoad={(auto) => setPickupAuto(auto)}
          onPlaceChanged={pickupChanged}
        >
          <input
            value={pickupText}
            onChange={(e)=>setPickupText(e.target.value)}
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
            onChange={(e)=>setDropText(e.target.value)}
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

            <Marker position={pickupCoords} />

            {dropCoords && <Marker position={dropCoords} />}

            {directions && (
              <DirectionsRenderer directions={directions} />
            )}

          </GoogleMap>

        )}

      </div>

      {/* VEHICLES */}

      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-3 mt-5 px-4">

        {vehicles.map((v) => (

          <button
            key={v.id}
            onClick={() => setVehicle(v.id)}
            className={`p-4 rounded-xl border text-center font-semibold
            ${vehicle === v.id
              ? "bg-green-600 text-white"
              : "bg-white border-green-300 text-green-700"
            }`}
          >

            <div className="text-xl">{v.icon}</div>
            <div className="text-sm">{v.name}</div>

          </button>

        ))}

      </div>

      {/* FARE */}

      {distance > 0 && !currentRide && (

        <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-lg p-6 text-center">

          <p>Distance: {distance} km</p>
          <p>ETA: {eta} mins</p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹ {price}
          </p>

          <button
            onClick={bookRide}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Book Ride
          </button>

        </div>

      )}

      {/* WAITING */}

      {currentRide && !driver && (

        <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-xl text-center">

          <h2 className="text-xl font-bold text-green-700">
            Waiting for driver...
          </h2>

          <p className="text-gray-600 mt-2">
            Driver will arrive soon
          </p>

        </div>

      )}

      {/* DRIVER INFO */}

      {driver && (

        <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-xl text-center">

          <h2 className="text-xl font-bold text-green-700">
            Driver Accepted 🚗
          </h2>

          <p className="mt-2 font-semibold">{driver.name}</p>

          <p>{driver.vehicleType}</p>

          <p>{driver.numberPlate}</p>

          <p className="mt-3">Share this OTP with driver</p>

          <div className="text-3xl font-bold text-green-700">
            {rideCode}
          </div>

        </div>

      )}

      {/* RIDE STARTED */}

      {rideStarted && (

        <div className="max-w-md mx-auto mt-6 bg-green-100 p-6 rounded-xl text-center">

          <h2 className="text-xl font-bold text-green-700">
            Ride Started 🚗
          </h2>

          <button
            onClick={async () => {

              await fetch(`${API}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rideId: currentRide._id })
              });

              alert("Ride Completed");

            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4"
          >
            Complete Ride
          </button>

        </div>

      )}

    </div>

  );

}