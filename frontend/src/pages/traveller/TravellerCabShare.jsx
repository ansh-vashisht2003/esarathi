import { useState } from "react";
import TravellerNavbar from "../components/TravellerNavbar";

const API = "http://localhost:5000/api/share-rides";

export default function TravellerCabShare() {

  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

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

  /* JOIN RIDE */

  const joinRide = async (rideId) => {

    const res = await fetch(`${API}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rideId,
        travellerEmail: traveller.email
      })
    });

    const data = await res.json();

    alert(data.message);

    searchRides();
  };

  return (

    <div className="bg-green-50 min-h-screen">

      <TravellerNavbar travellerName={travellerName} />

      {/* SEARCH CARD */}

      <div className="max-w-3xl mx-auto bg-white p-6 mt-6 rounded-xl shadow">

        <h2 className="text-xl font-bold text-green-700 mb-4">
          Find Shared Ride
        </h2>

        <div className="grid grid-cols-2 gap-3">

          <input
            placeholder="Pickup city"
            value={pickup}
            onChange={(e)=>setPickup(e.target.value)}
            className="border border-green-300 p-3 rounded-lg"
          />

          <input
            placeholder="Destination city"
            value={drop}
            onChange={(e)=>setDrop(e.target.value)}
            className="border border-green-300 p-3 rounded-lg"
          />

        </div>

        <button
          onClick={searchRides}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Search Rides
        </button>

      </div>

      {/* RIDE LIST */}

      <div className="max-w-4xl mx-auto mt-6 space-y-4">

        {loading && (
          <p className="text-center text-gray-600">
            Searching rides...
          </p>
        )}

        {!loading && rides.length === 0 && (
          <p className="text-center text-gray-500">
            No shared rides available
          </p>
        )}

        {rides.map((ride) => (

          <div
            key={ride._id}
            className="bg-white p-6 rounded-xl shadow"
          >

            {/* DRIVER INFO */}

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                <img
                  src={`http://localhost:5000/driver_pic/${ride.driver.profilePic}`}
                  className="w-12 h-12 rounded-full"
                />

                <div>

                  <p className="font-semibold">
                    {ride.driver.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {ride.vehicleType} • {ride.driver.numberPlate}
                  </p>

                </div>

              </div>

              <p className="text-green-600 font-bold text-lg">
                ₹ {ride.price}
              </p>

            </div>

            {/* ROUTE */}

            <div className="mt-3">

              <p className="font-semibold">
                {ride.pickup.city} → {ride.drop.city}
              </p>

              <p className="text-sm text-gray-500">
                Departure: {ride.time}
              </p>

            </div>

            {/* FULL ROUTE PATH */}

            {ride.route && (

              <div className="mt-2 text-sm text-gray-600">

                {ride.route.map((r,i)=>(
                  <span key={i}>
                    {r.city}
                    {i !== ride.route.length-1 && " → "}
                  </span>
                ))}

              </div>

            )}

            {/* PASSENGERS */}

            <div className="mt-4">

              <p className="text-sm font-semibold text-gray-700">
                Passengers
              </p>

              <div className="flex gap-2 mt-1 flex-wrap">

                {ride.passengers.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    No passengers yet
                  </span>
                )}

                {ride.passengers.map((p,i)=>(
                  <span
                    key={i}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {p.name || p.email}
                  </span>
                ))}

              </div>

            </div>

            {/* SEATS + JOIN */}

            <div className="flex justify-between items-center mt-4">

              <p className="text-sm text-gray-600">
                Seats left: {ride.availableSeats}
              </p>

              <button
                onClick={()=>joinRide(ride._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
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