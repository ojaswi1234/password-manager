import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";

import DashBoard  from "../pages/dashboard/dashboard";
import Login from "../pages/authentication/Login";
import Profile from "../pages/Profile/Profile";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
