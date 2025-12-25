import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import ChooseRole from "./pages/ChooseRole";
import TravellerLogin from "./pages/traveller/TravellerLogin";
import DriverLogin from "./pages/driver/DriverLogin";
import ForgotPassword from "./pages/traveller/ForgotPassword";
import TravellerSignup from "./pages/traveller/TravellerSignup";
import VerifySignupOTP from "./pages/traveller/VerifySignupOTP";
//import ResetPassword from "./pages/traveller/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Splash */}
        <Route path="/" element={<Splash />} />

        {/* Role selection */}
        <Route path="/choose-role" element={<ChooseRole />} />

        {/* Traveller auth */}
        <Route path="/traveller/login" element={<TravellerLogin />} />
        <Route path="/traveller/forgot-password" element={<ForgotPassword />} />
        <Route path="/traveller/signup" element={<TravellerSignup />} />
<Route path="/traveller/verify-otp" element={<VerifySignupOTP />} />

        

        {/* Driver auth */}
        <Route path="/driver/login" element={<DriverLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
