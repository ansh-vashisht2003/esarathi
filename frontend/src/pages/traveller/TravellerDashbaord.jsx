import TravellerNavbar from "../components/TravellerNavbar";

const TravellerDashboard = () => {
  // ✅ Get logged-in traveller from localStorage
  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  return (
    <div className="min-h-screen bg-green-50">
      {/* NAVBAR */}
      <TravellerNavbar travellerName={travellerName} />

      <div className="max-w-6xl mx-auto p-8">
        {/* HOME / WELCOME */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Welcome, {travellerName} 👋
          </h2>
          <p className="text-gray-700">
            Book safe, reliable and affordable rides anytime, anywhere.
          </p>
        </section>

        {/* SAFETY TIPS */}
        <section className="bg-white rounded-xl p-6 mb-10 shadow">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">
            Safety Tips While Traveling
          </h3>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Always verify the vehicle number before boarding</li>
            <li>Share your live location with a trusted contact</li>
            <li>Wear seat belts at all times</li>
            <li>Avoid sharing personal information with strangers</li>
            <li>Use in-app support for emergencies</li>
          </ul>
        </section>

        {/* BOOKING OPTIONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SOLO RIDE */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h4 className="text-xl font-bold text-green-700 mb-3">
              Book a Solo Ride
            </h4>
            <p className="text-gray-600 mb-4">
              Travel alone with complete comfort and privacy.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Book Solo Ride
            </button>
          </div>

          {/* CAB SHARING */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h4 className="text-xl font-bold text-green-700 mb-3">
              Book a Cab Sharing Ride
            </h4>
            <p className="text-gray-600 mb-4">
              Save money by sharing your ride with others.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Book Shared Ride
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TravellerDashboard;
