import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/esarathi-logo.png";

const Splash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/choose-role");
          return 100;
        }
        return prev + 1;
      });
    }, 25); // ~2.5s total

    return () => clearInterval(interval);
  }, [navigate]);

  // Circle math
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white">

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-400 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-emerald-300 rounded-full opacity-20 blur-3xl animate-pulse delay-700" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo */}
        <img
          src={logo}
          alt="E-Sarathi Logo"
          className="w-28 h-28 mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]"
        />

        {/* App Name */}
        <h1 className="text-5xl font-bold tracking-wide mb-3">
          E-Sarathi
        </h1>

        {/* Tagline */}
        <p className="text-lg text-center max-w-md opacity-90 mb-10">
          One place solution for all your travelling problems
        </p>

        {/* Circular Progress */}
        <div className="relative w-28 h-28">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="#ffffff"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-100 ease-linear"
            />
          </svg>

          {/* Percentage */}
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
