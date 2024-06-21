import React, { useState, useEffect } from 'react';
import { Avatar, Grid, Typography, Box, LinearProgress } from '@mui/material';
import Slider from 'react-slick';
import { useTheme } from '@mui/material/styles'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProfileHeader = ({ campsData }) => {
  const [activeCamp, setActiveCamp] = useState(campsData[0]);
  const [totalProgress, setTotalProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    // Calculate total progress when campsData changes
    const total = campsData.reduce((acc, camp) => acc + camp.progress, 0);
    const averageProgress = total / campsData.length;
    setTotalProgress(averageProgress);
  }, [campsData]);

  const handleCampSelect = (camp) => {
    setActiveCamp(camp === activeCamp ? null : camp);
  };
  const campImages = {
    "IC": '/camp_images/AlphabetCamp.png',
    "A": '/camp_images/Identity.png',
    "N": '/camp_images/NumbersCamp.png',
    "PR": '/camp_images/ProverbsCamp.png',
    "R": '/camp_images/RhythmCamp.png',
    "V": '/camp_images/VocabularyCamp.png',
    // Add more images as needed for each camp
  };

  // Settings for react-slick carousel to show three slides at a time and center items
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Number of slides to show at a time
    slidesToScroll: 1, // Number of slides to scroll per swipe
    centerMode: true,
    centerPadding: '10px', // Adjust padding around center slide
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <Box p={2} borderBottom={1} mb={2}>
      <Slider {...settings}>
        {campsData.map((camp) => (
          <Box key={camp.id} textAlign="center">
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      color:
                        activeCamp === camp
                          ? theme.palette.text.primary
                          : theme.palette.text.secondary,
                      fontWeight: activeCamp === camp ? "bold" : "normal",
                      minWidth: 100, // Ensures consistent width for Avatar
                      margin: "0 auto", // Center align text
                    }}
                  >
                    {camp.progress}%
                  </Typography>
                  <Avatar
                    onClick={() => handleCampSelect(camp)}
                    sx={{
                        width: { xs: 75, sm: 50, md: 60 }, // Adjust sizes based on screen breakpoints
                        height: { xs: 75, sm: 50, md: 60 }, // Adjust sizes based on screen breakpoints
                        backgroundColor: "#fff",
                        color: activeCamp === camp ? theme.palette.text.primary : theme.palette.text.secondary,
                        border: activeCamp === camp ? "2px solid transparent" : theme.palette.text.primary,
                        cursor: "pointer",
                        margin: "0 auto", // Center align Avatar
                        transition: "none", // Disable transitions
                        position: "relative", // Ensure positioning context for progress bar
                      }}
                    >
                    {campImages[camp.id] ? (
                      <img
                        src={campImages[camp.id]}
                        alt={camp.name}
                        style={{ width: "100%", height: "auto" }}
                      />
                    ) : (
                      camp.name.charAt(0)
                    )}
                  </Avatar>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      color:
                        activeCamp === camp
                          ? theme.palette.text.primary
                          : theme.palette.text.secondary,
                      fontWeight: activeCamp === camp ? "bold" : "normal",
                      minWidth: 100, // Ensures text width matches Avatar width
                      margin: "0 auto", // Center align text
                    }}
                  >
                    {camp.name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Slider>

      <Box mt={2} textAlign="center" aria-hidden="true">
        {/* This Box is empty and acts as a spacer */}
      </Box>
      {/* Global Progress Bar */}
      <Box mt={3} textAlign="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            mt: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ mt: 1, textAlign: "left", width: "80%" }}
          >
            Total Progress: {Math.round(totalProgress)}%
          </Typography>
          <LinearProgress 
            variant="determinate"
            value={totalProgress}
            sx={{ width: "80%", alignSelf: "center" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
