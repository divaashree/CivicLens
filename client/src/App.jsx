import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Map from "./pages/Map";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import BottomNav from "./components/layout/BottomNav";

export default function App() {
  return (
    <Router>
      <div className="pb-20 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <BottomNav />
      </div>
    </Router>
  );
}