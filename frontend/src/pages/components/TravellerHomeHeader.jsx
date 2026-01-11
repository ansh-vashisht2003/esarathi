const TravellerHomeHeader = ({ name, profilePic }) => {
  const defaultProfile =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow mb-8">
      
      {/* LEFT: LOGO + NAME */}
      <div className="flex items-center gap-4">
        <img
          src="/esarathi-logo.png"
          alt="E-Sarathi Logo"
          className="h-12 w-12"
        />

        <div>
          <h1 className="text-2xl font-bold text-green-800">
            E-Sarathi
          </h1>
          <p className="text-gray-600">
            Welcome, <span className="font-semibold">{name}</span>
          </p>
        </div>
      </div>

      {/* RIGHT: PROFILE PIC */}
      <div>
        <img
          src={profilePic || defaultProfile}
          alt="Profile"
          className="h-14 w-14 rounded-full object-cover border-2 border-green-600"
        />
      </div>
    </div>
  );
};

export default TravellerHomeHeader;
