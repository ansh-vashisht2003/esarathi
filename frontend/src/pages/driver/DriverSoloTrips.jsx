import DriverTopbar from "./DriverTopbar";
import { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader
} from "@react-google-maps/api";

import io from "socket.io-client";

const socket = io("http://localhost:5000");
const API = "http://localhost:5000/api/rides";

const GOOGLE_KEY = "AIzaSyDwaSxjJlJvRtRfLCUk0Bw4BLy3QUJk4KI";

const mapContainerStyle = {
  width: "100%",
  height: "100%"
};

const DriverSoloTrips = () => {

  const driver = JSON.parse(localStorage.getItem("driver"));

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_KEY
  });

  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);

  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [driverLoc, setDriverLoc] = useState(null);
  const [directions, setDirections] = useState(null);
  const [rideCode, setRideCode] = useState("");
  const [rideStarted, setRideStarted] = useState(false);

  /* -------- SMOOTH DRIVER MOVEMENT -------- */

  const animateMarker = (newLoc) => {

    if (!driverLoc) {
      setDriverLoc(newLoc);
      return;
    }

    const frames = 30;
    const latStep = (newLoc.lat - driverLoc.lat) / frames;
    const lngStep = (newLoc.lng - driverLoc.lng) / frames;

    let i = 0;

    const interval = setInterval(() => {

      i++;

      setDriverLoc(prev => ({
        lat: prev.lat + latStep,
        lng: prev.lng + lngStep
      }));

      if (i >= frames) clearInterval(interval);

    }, 50);

  };

  /* ---------------- DRIVER LOCATION ---------------- */

  useEffect(() => {

    if (!driver?.email) return;

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };

        setDriverLoc(loc);

        socket.emit("driverOnline", {
          email: driver.email,
          lat: loc.lat,
          lng: loc.lng
        });

      },

      (err) => {
        console.log("GPS Error", err);
      },

      { enableHighAccuracy: true }

    );

    const watchId = navigator.geolocation.watchPosition(

      (pos) => {

        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };

        animateMarker(loc);

        socket.emit("driverOnline", {
          email: driver.email,
          lat: loc.lat,
          lng: loc.lng
        });

      },

      (err) => {
        console.log("GPS Error", err);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [driver?.email]);



  /* ---------------- AUTO CENTER MAP ---------------- */

  useEffect(() => {

    if (mapRef.current && driverLoc) {
      mapRef.current.panTo(driverLoc);
    }

  }, [driverLoc]);



  /* ---------------- LOAD RIDES ---------------- */

  const loadRides = async () => {

    try {

      const res = await fetch(`${API}/searching`);
      const data = await res.json();

      setRides(data);

    } catch (err) {

      console.log(err);

    }

  };



  /* ---------------- SOCKET CONNECTION ---------------- */

  useEffect(() => {

    if (!driver?.email) return;

    socket.emit("joinDriver", driver.email);

    loadRides();

    socket.on("newRideRequest", (ride) => {
      setRides(prev => [ride, ...prev]);
    });

    socket.on("rideAccepted", (rideId) => {
      setRides(prev =>
        prev.filter(r => r._id !== rideId)
      );
    });

    return () => {

      socket.off("newRideRequest");
      socket.off("rideAccepted");

    };

  }, [driver?.email]);



  /* ---------------- ROUTE DRAWING ---------------- */

  useEffect(() => {

    if (!driverLoc || !selectedRide || !isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();

    const origin = !rideStarted
      ? driverLoc
      : { lat: selectedRide.pickup.lat, lng: selectedRide.pickup.lng };

    const destination = !rideStarted
      ? { lat: selectedRide.pickup.lat, lng: selectedRide.pickup.lng }
      : { lat: selectedRide.drop.lat, lng: selectedRide.drop.lng };

    directionsService.route(
      {
        origin,
        destination,
        travelMode: "DRIVING"
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      }
    );

  }, [driverLoc, selectedRide, rideStarted, isLoaded]);



  /* ---------------- ACCEPT RIDE ---------------- */

  const acceptRide = async (rideId) => {

    const res = await fetch(`${API}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rideId,
        driverEmail: driver.email
      })
    });

    const data = await res.json();

    if (data.message) {
      alert(data.message);
      return;
    }

    alert("Ride Accepted");

    setSelectedRide(data);
    setRides([]);

  };



  /* ---------------- START RIDE ---------------- */

  const startRide = async () => {

    const res = await fetch(`${API}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rideCode
      })
    });

    const data = await res.json();

    if (data.message === "Ride started") {

      alert("Ride Started");
      setRideStarted(true);

    } else {

      alert("Invalid OTP");

    }

  };



  if (!isLoaded) return <div className="p-10">Loading Map...</div>;



  return (

    <div className="bg-green-50 min-h-screen flex flex-col">

      <DriverTopbar />

      {/* MAP */}

      <div className="relative flex-grow" style={{ height: "45vh" }}>

        {!driverLoc && (

          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">

            <p className="animate-pulse">📍 Locating driver...</p>

          </div>

        )}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={driverLoc || { lat: 28.6139, lng: 77.2090 }}
          zoom={16}
          onLoad={(map) => (mapRef.current = map)}
        >

          {driverLoc && (

            <Marker
              position={driverLoc}
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />

          )}

          {selectedRide && !rideStarted && (

            <Marker
              position={{
                lat: selectedRide.pickup.lat,
                lng: selectedRide.pickup.lng
              }}
              label="Pickup"
            />

          )}

          {directions && (

            <DirectionsRenderer directions={directions} />

          )}

        </GoogleMap>

      </div>

      {/* DRIVER PANEL */}

      <div className="bg-white rounded-t-3xl -mt-8 p-6 shadow-xl">

        {selectedRide ? (

          <div>

            <p className="font-semibold">
              Traveller: {selectedRide.traveller?.name}
            </p>

            <p>
              Pickup: {selectedRide.pickup?.address}
            </p>

            <p>
              Drop: {selectedRide.drop?.address}
            </p>

            <p>
              Fare: ₹{selectedRide.fare}
            </p>

            {!rideStarted && (

              <>

                <input
                  value={rideCode}
                  onChange={(e)=>setRideCode(e.target.value)}
                  placeholder="Enter OTP"
                  className="border p-2 w-full mt-3 rounded"
                />

                <button
                  onClick={startRide}
                  className="bg-green-600 text-white w-full mt-3 p-2 rounded"
                >
                  Start Ride
                </button>

              </>

            )}

          </div>

        ) : (

          rides.map((ride)=>(

            <div key={ride._id} className="border p-3 mb-3 rounded">

              <p className="font-semibold">
                {ride.pickup.address}
              </p>

              <p>
                {ride.drop.address}
              </p>

              <button
                onClick={()=>acceptRide(ride._id)}
                className="bg-black text-white w-full mt-2 p-2 rounded"
              >
                Accept Ride
              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );

};

export default DriverSoloTrips;