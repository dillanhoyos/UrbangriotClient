// AppRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import QRScanner from "../components/Scanner";
import BottomNav from "../components/bottomNavbar";
import ProfileHeader from "../components/camps_progress";
import Header from "../components/header";
import Map from "../components/map";
import Settings from "../components/settings";
import ImageNavigation from "../components/gamemap";
import  EuclideanSequencer from "../audiocomponents/EuclideanSequencer_SliderVersion"
import  EuclideanSequencer_List from "../audiocomponents/EuclideanSequencer_ListVersion"
import  AlphariddimsSequencer from "../audiocomponents/AlphariddimsSequencerList"
import  AlphariddimsSequencerButtons from "../audiocomponents/AlphariddimsSequencerButtons"
import LevelMap from "../components/map";
import { Box } from "@mui/material";

const campsData = [
  { id: "IC", name: "IdentityCamp", progress: 50 },
  { id: "A", name: "AlphabetCamp", progress: 30 },
  { id: "N", name: "NumbersCamp", progress: 80 },
  { id: "PR", name: "ProverbsCamp", progress: 80 },
  { id: "R", name: "RhythmCamp", progress: 80 },
  { id: "V", name: "VocabularyCamp", progress: 80 },
];

const mapImage = "/camp_images/map.png";

const AppRoutes = ({ isDesktop, scannedUrl, handleScan, userdata }) => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      flexDirection: isDesktop ? "row" : "column",
    }}
  >
    {isDesktop && <BottomNav />}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        ml: isDesktop ? "10px" : 0,
      }}
    >
      {/* Fixed Header and ProfileHeader */}
      <Header imageSrc={userdata.imagesrc} name={userdata.username} />

      {/* Scrollable content area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "none",
          mt: "100px",
        }}
      >
        <Routes>
          <Route
            path="/map"
            element={
              <Box
                sx={{
                  width: isDesktop ? "calc(90vw - 120px)" : "100%",
                  height: "calc(100vh - 125px)", // Adjust based on your header height
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <ProfileHeader campsData={campsData} />
                <ImageNavigation imageSrc={mapImage} />
              </Box>
            }
          />
          <Route path="/scan" element={<QRScanner onScan={handleScan} />} />
          <Route path="/sequencer" element={<EuclideanSequencer />} />
          <Route path="/sequencer_list" element={<EuclideanSequencer_List/>} />
          <Route path="/Alphariddims" element={<AlphariddimsSequencer/>} />
          <Route path="/AlphariddimsButtons" element={<AlphariddimsSequencerButtons/>} />
          <Route path="/camp_map" element={<LevelMap />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<QRScanner onScan={handleScan} />} />
        </Routes>
      </Box>

      {/* Bottom Navigation for Mobile */}
      {!isDesktop && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            zIndex: 1,
            backgroundColor: "#ffffff",
          }}
        >
          <BottomNav />
        </Box>
      )}
    </Box>
  </Box>
);

export default AppRoutes;
