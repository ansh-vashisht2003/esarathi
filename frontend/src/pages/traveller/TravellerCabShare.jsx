import { useState, useEffect, useRef } from "react";
import TravellerNavbar from "../components/TravellerNavbar";

const API = "http://localhost:5000/api/share-rides";

export default function TravellerCabShare() {

  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerNames, setPassengerNames] = useState([]);

  /* KEEP PASSENGER NAMES LENGTH MATCHING PASSENGER COUNT */

  useEffect(() => {
    setPassengerNames((prev) => prev.slice(0, passengerCount));
  }, [passengerCount]);



  /* GOOGLE AUTOCOMPLETE */

  useEffect(() => {

    if (!window.google) return;

    const pickupAuto = new window.google.maps.places.Autocomplete(
      pickupRef.current
    );

    pickupAuto.addListener("place_changed", () => {
      const place = pickupAuto.getPlace();
      setPickup(place.formatted_address);
    });

    const dropAuto = new window.google.maps.places.Autocomplete(
      dropRef.current
    );

    dropAuto.addListener("place_changed", () => {
      const place = dropAuto.getPlace();
      setDrop(place.formatted_address);
    });

  }, []);



  /* SEARCH RIDES */

  const searchRides = async () => {

    if (!pickup || !drop) return;

    setLoading(true);

    const res = await fetch(
      `${API}/search?pickup=${pickup}&drop=${drop}`
    );

    const data = await res.json();

    setRides(data);

    setLoading(false);

  };



  /* PRICE CALCULATION */

  const calculatePrice = (ride) => {

    const cities = [
      ride.pickup.city,
      ...ride.route.map(r => r.city),
      ride.drop.city
    ];

    const pickupIndex = cities.findIndex(c =>
      c.toLowerCase().includes(pickup.toLowerCase())
    );

    const dropIndex = cities.findIndex(c =>
      c.toLowerCase().includes(drop.toLowerCase())
    );

    if (pickupIndex === -1 || dropIndex === -1)
      return Math.round(ride.totalPrice);

    const segmentCount = dropIndex - pickupIndex;

    const segmentDistance =
      ride.totalDistance / ride.segments.length;

    const passengerDistance =
      segmentDistance * segmentCount;

    const price =
      passengerDistance * (ride.pricePerKm || 0) * passengerCount;

    return Math.round(price);

  };



  /* JOIN RIDE */

  const joinRide = async (rideId) => {

    const res = await fetch(`${API}/join`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        rideId,
        travellerEmail: traveller.email,
        pickup,
        drop,
        seats: passengerCount,
        passengerNames

      })

    });

    const data = await res.json();

    alert(
`${data.message}
Seats Booked: ${passengerCount}
Total Price: ₹${data.price}`
    );

    setPassengerCount(1);
    setPassengerNames([]);

    searchRides();

  };



  return (

    <div className="bg-gray-100 min-h-screen">

      <TravellerNavbar travellerName={travellerName} />


      {/* SEARCH BOX */}

      <div className="max-w-3xl mx-auto bg-white p-8 mt-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">
          Find Shared Ride
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            ref={pickupRef}
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e)=>setPickup(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            ref={dropRef}
            placeholder="Drop Location"
            value={drop}
            onChange={(e)=>setDrop(e.target.value)}
            className="border p-3 rounded-lg"
          />

        </div>

        <button
          onClick={searchRides}
          className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Searching..." : "Search Rides"}
        </button>

      </div>



      {/* RIDE LIST */}

      <div className="max-w-4xl mx-auto mt-8 space-y-5">

        {rides.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            No rides found
          </p>
        )}

        {rides.map((ride) => (

          <div
            key={ride._id}
            className="bg-white p-6 rounded-xl shadow-lg"
          >

            <div className="flex justify-between">

              <div>

                <p className="font-semibold text-lg">
                  {ride.driver.name}
                </p>

                <p className="text-sm text-gray-500">
                  {ride.vehicleType} • {ride.vehicleNumber}
                </p>

              </div>

              <p className="text-green-600 font-bold text-lg">
                ₹{calculatePrice(ride)}
              </p>

            </div>


            <div className="mt-3">

              <p className="font-semibold">
                {ride.pickup.city} → {ride.drop.city}
              </p>

              <p className="text-sm text-gray-500">
                {ride.date} • {ride.time}
              </p>

            </div>


            {/* PASSENGER SELECTOR */}

            <div className="flex items-center gap-3 mt-4">

              <button
                onClick={()=>setPassengerCount(Math.max(1, passengerCount-1))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span className="font-semibold">{passengerCount}</span>

              <button
                onClick={()=>setPassengerCount(
                  Math.min(ride.availableSeats, passengerCount + 1)
                )}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>

              <span className="text-sm text-gray-600">
                Passengers
              </span>

            </div>


            {/* PASSENGER NAMES */}

            <div className="mt-3">

              {Array.from({ length: passengerCount }).map((_, i) => (

                <input
                  key={i}
                  value={passengerNames[i] || ""}
                  placeholder={`Passenger ${i+1} name`}
                  className="border p-2 w-full mb-2 rounded"
                  onChange={(e)=>{

                    const names=[...passengerNames];
                    names[i]=e.target.value;
                    setPassengerNames(names);

                  }}
                />

              ))}

            </div>


            <div className="flex justify-between items-center mt-4">

              <p className="text-sm text-gray-600">
                Seats left: {ride.availableSeats}
              </p>

              <button
                disabled={ride.availableSeats === 0}
                onClick={()=>joinRide(ride._id)}
                className={`px-5 py-2 rounded-lg text-white font-semibold ${
                  ride.availableSeats === 0
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Join Ride
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

