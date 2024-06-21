import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QRScanner from "./components/Scanner"; // Import the QRScanner component
import BottomNav from "./components/bottomNavbar";
import ProfileHeader from "./components/profileHeader";
import { Box, IconButton, Slider } from '@mui/material';
import Header from "./components/header";
import Map from "./components/map";
import Settings from "./components/settings";
import ImageNavigation from "./components/gamemap";

const campsData = [
  { id: "IC", name: "IdentityCamp", progress: 50 },
  { id: "A", name: "AlphabetCamp", progress: 30 },
  { id: "N", name: "NumbersCamp", progress: 80 },
  { id: "PR", name: "ProverbsCamp", progress: 80 },
  { id: "R", name: "RhythmCamp", progress: 80 },
  { id: "V", name: "VocabularyCamp", progress: 80 },
];
const userdata = {
  imagesrc: "/user_images/image.png",
  username: "Dillan Hoyos",
};

const mapImage = "/camp_images/map.png";

function App() {
  const [scannedUrl, setScannedUrl] = useState("");

  const handleScan = (url) => {
    setScannedUrl(url);
    // Optionally, perform any action with the scanned URL, e.g., redirect to it
    window.location.href = url;
  };

  return (
    <Router>
      {/* Header component */}
      <Header imageSrc={userdata.imagesrc} name={userdata.username} />
      <ProfileHeader campsData={campsData} />

      <Routes>
      <Route
          path="/map"
          element={
            <Box sx={{ width: '100%', height: 'calc(100vh - 200px)' }}> {/* Adjust the height as needed */}
              <ImageNavigation imageSrc={mapImage} />
            </Box>
          }
        />
        <Route path="/scan" element={<QRScanner onScan={handleScan} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<QRScanner onScan={handleScan} />} />{" "}
        {/* Default route */}
      </Routes>

      <BottomNav />
    </Router>
  );
}

export default App;
