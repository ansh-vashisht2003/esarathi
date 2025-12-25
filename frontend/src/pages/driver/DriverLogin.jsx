const DriverLogin = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-md w-[90%] max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">
          Driver Login
        </h2>

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <button className="w-full bg-slate-800 text-white py-3 rounded-lg">
          Login
        </button>
      </div>
    </div>
  );
};

export default DriverLogin;
