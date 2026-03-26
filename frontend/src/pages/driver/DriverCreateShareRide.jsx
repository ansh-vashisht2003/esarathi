import { useState, useEffect, useRef } from "react";
import DriverTopbar from "./DriverTopbar";

const API = "http://localhost:5000/api/share-rides";

function DriverCreateShareRide() {

  const driver = JSON.parse(localStorage.getItem("driver"));

  const pickupRef = useRef(null);
  const dropRef = useRef(null);
  const routeRef = useRef(null);

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [route, setRoute] = useState([]);
  const [routeInput, setRouteInput] = useState("");

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [success, setSuccess] = useState(false);


  /* GOOGLE MAP LOAD */

  useEffect(() => {

    if (window.google) {
      initAutocomplete();
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDwaSxjJlJvRtRfLCUk0Bw4BLy3QUJk4KI&libraries=places";

    script.async = true;

    script.onload = () => initAutocomplete();

    document.body.appendChild(script);

  }, []);



  const initAutocomplete = () => {

    if (!window.google) return;

    const pickupAuto = new window.google.maps.places.Autocomplete(pickupRef.current);

    pickupAuto.addListener("place_changed", () => {
      const place = pickupAuto.getPlace();
      setPickup(place.formatted_address);
    });


    const dropAuto = new window.google.maps.places.Autocomplete(dropRef.current);

    dropAuto.addListener("place_changed", () => {
      const place = dropAuto.getPlace();
      setDrop(place.formatted_address);
    });


    const routeAuto = new window.google.maps.places.Autocomplete(routeRef.current);

    routeAuto.addListener("place_changed", () => {

      const place = routeAuto.getPlace();

      setRoute(prev => [...prev, place.formatted_address]);

      setRouteInput("");

    });

  };


  const removeRoute = (city) => {
    setRoute(route.filter(r => r !== city));
  };


  const createRide = async () => {

    const routeCities = route.map(city => ({ city }));

    const rideData = {

      driver: driver._id,
      vehicleType,
      vehicleNumber,

      pickup: { city: pickup },
      drop: { city: drop },

      route: routeCities,

      price,
      seats,
      availableSeats: seats,

      date,
      time

    };

    const res = await fetch(`${API}/create`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rideData)

    });

    const data = await res.json();

    if (data.message) {

      setSuccess(true);

      setPickup("");
      setDrop("");
      setRoute([]);
      setRouteInput("");
      setVehicleType("");
      setVehicleNumber("");
      setPrice("");
      setSeats("");
      setDate("");
      setTime("");

      setTimeout(() => setSuccess(false), 3000);

    }

  };


  return (

    <div className="bg-gray-100 min-h-screen">

      <DriverTopbar />

      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create Shared Ride
        </h2>

        {success && (
          <div className="bg-green-100 text-green-800 border border-green-300 p-3 mb-5 rounded text-center font-semibold">
            🚗 Ride Posted Successfully
          </div>
        )}


        {/* LOCATION SECTION */}

        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Route Details
        </h3>

        <input
          ref={pickupRef}
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e)=>setPickup(e.target.value)}
          className="border p-3 w-full mb-3 rounded focus:ring-2 focus:ring-green-400"
        />

        <input
          ref={dropRef}
          placeholder="Drop Location"
          value={drop}
          onChange={(e)=>setDrop(e.target.value)}
          className="border p-3 w-full mb-3 rounded focus:ring-2 focus:ring-green-400"
        />


        <input
          ref={routeRef}
          placeholder="Add Route Stop"
          value={routeInput}
          onChange={(e)=>setRouteInput(e.target.value)}
          className="border p-3 w-full mb-2 rounded"
        />

        <div className="flex flex-wrap gap-2 mb-6">

          {route.map((city,index)=>(
            <div
              key={index}
              className="bg-green-200 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {city}

              <button
                onClick={()=>removeRoute(city)}
                className="text-red-600 font-bold"
              >
                ×
              </button>

            </div>
          ))}

        </div>


        {/* VEHICLE SECTION */}

        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Vehicle Details
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">

          <input
            placeholder="Vehicle Type (Swift)"
            value={vehicleType}
            onChange={(e)=>setVehicleType(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            placeholder="Vehicle Number (HR06AB1234)"
            value={vehicleNumber}
            onChange={(e)=>setVehicleNumber(e.target.value.toUpperCase())}
            className="border p-3 rounded"
          />

        </div>


        {/* RIDE INFO */}

        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Ride Info
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <input
            type="number"
            placeholder="Seats"
            value={seats}
            onChange={(e)=>setSeats(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Price per passenger"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="time"
            value={time}
            onChange={(e)=>setTime(e.target.value)}
            className="border p-3 rounded"
          />

        </div>


        {/* BUTTON */}

        <button
          onClick={createRide}
          className="bg-green-600 hover:bg-green-700 transition text-white w-full py-3 rounded-lg text-lg font-semibold"
        >
          Post Ride
        </button>

      </div>

    </div>

  );

}

export default DriverCreateShareRide;