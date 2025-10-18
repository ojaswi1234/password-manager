import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";

import DashBoard  from "../pages/dashboard/dashboard";

import Profile from "../pages/Profile/Profile";
import Welcome from "../pages/authentication/Welcome";
import PassHealth from "../pages/dashboard/features/passHealth";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/healthboard" element={<PassHealth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
