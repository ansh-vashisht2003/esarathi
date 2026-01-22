import { Link } from "react-router-dom";
import TravellerNavbar from "../components/TravellerNavbar";

const ContactSuccess = () => {
  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";

  return (
    <div className="min-h-screen bg-green-50">
      {/* NAVBAR */}
      <TravellerNavbar travellerName={travellerName} />

      {/* CONTENT */}
      <div className="flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow max-w-md text-center mt-20">
          <h2 className="text-3xl font-bold text-green-700 mb-3">
            Message Sent ✅
          </h2>

          <p className="text-gray-700">
            Thank you for contacting us. Our support team will get back to you
            shortly.
          </p>

          <Link to="/traveller/dashboard">
            <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactSuccess;
