import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import AppRoutes from "./CompoundComponents/mainmenuroutes";
import Onboarding from "./CompoundComponents/onboarding";

const userdata = {
  imagesrc: "/user_images/image.png",
  username: "Dillan Hoyos",
};

function App() {
  const [scannedUrl, setScannedUrl] = useState("");
  const [onboardingComplete, setOnboardingComplete] = useState(false); // State to track onboarding completion
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleScan = (url) => {
    setScannedUrl(url);
    window.location.href = url;
  };

  // Function to handle onboarding completion
  const handleOnboardingComplete = (data) => {
    // Perform any necessary actions with the onboarding data
    console.log("Onboarding Data:", data);
    setOnboardingComplete(true);
    // Additional logic to save data or perform actions as needed
  };

  // Render onboarding if it's not complete, otherwise render main application routes
  return (
    <Router>
      {!onboardingComplete ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        
              <AppRoutes
                isDesktop={isDesktop}
                scannedUrl={scannedUrl}
                handleScan={handleScan}
                userdata={userdata}
              />
         
      )}
    </Router>
  );
}

export default App;
