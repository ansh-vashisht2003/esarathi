import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import ChooseRole from "./pages/ChooseRole";
import TravellerLogin from "./pages/traveller/TravellerLogin";
import DriverLogin from "./pages/driver/DriverLogin";
import ForgotPassword from "./pages/traveller/ForgotPassword";
import TravellerSignup from "./pages/traveller/TravellerSignup";
import VerifySignupOTP from "./pages/traveller/VerifySignupOTP";
import DriverSignup from "./pages/driver/DriverSignup";
import VerifyDriverOTP from "./pages/driver/VerifyDriverOTP";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddDriver from "./pages/admin/AddDriver";
import TravellerDashboard from "./pages/traveller/TravellerDashbaord";
import TravellerBookSolo from "./pages/traveller/TravellerBookSolo";
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
        <Route path="/traveller/dashboard" element={<TravellerDashboard />} />
        <Route path="/traveller/book-solo" element={<TravellerBookSolo />} />

        

        {/* Driver auth */}
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/login" element={<DriverLogin />} />
<Route path="/driver/signup" element={<DriverSignup />} />
<Route path="/driver/verify-otp" element={<VerifyDriverOTP />} />
<Route path="/driver/forgot-password" element={<ForgotPassword />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-driver" element={<AddDriver />} />
      </Routes>
    </Router>
  );
}

export default App;
