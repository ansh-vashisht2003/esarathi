import { useState } from "react";
import { Link } from "react-router-dom";

const TravellerNavbar = ({ travellerName }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-green-800 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT: LOGO */}
        <div className="text-xl font-bold">
          E-Sarathi
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          <li><Link to="/traveller/dashboard" className="hover:text-green-300">Home</Link></li>
          <li><Link to="/traveller/book-solo" className="hover:text-green-300">Book a Ride (Solo)</Link></li>
          <li><Link to="/traveller/book-share" className="hover:text-green-300">Cab Sharing</Link></li>
          <li><Link to="/traveller/contact" className="hover:text-green-300">Contact</Link></li>
          <li><Link to="/traveller/profile" className="hover:text-green-300">Profile</Link></li>
        </ul>

        {/* RIGHT: USER NAME */}
        <div className="hidden md:block font-semibold whitespace-nowrap">
          Welcome, {travellerName}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden mt-4 bg-green-900 rounded-lg p-4 space-y-3">
          <Link onClick={() => setOpen(false)} to="/traveller/dashboard" className="block">Home</Link>
          <Link onClick={() => setOpen(false)} to="/traveller/book-solo" className="block">Book a Ride (Solo)</Link>
          <Link onClick={() => setOpen(false)} to="/traveller/book-share" className="block">Cab Sharing</Link>
          <Link onClick={() => setOpen(false)} to="/traveller/contact" className="block">Contact</Link>
          <Link onClick={() => setOpen(false)} to="/traveller/profile" className="block">Profile</Link>

          <div className="border-t border-green-700 pt-2 font-semibold">
            Welcome, {travellerName}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TravellerNavbar;
