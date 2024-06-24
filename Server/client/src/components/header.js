// Header.js
import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, useMediaQuery, useTheme } from "@mui/material";

const Header = ({ imageSrc, name }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Box
      sx={{
        position: "fixed",
        width: isDesktop ? `calc(100% - 240px)` : "100%",
        zIndex: 1,
        backgroundColor: "#ffffff",
        top: 0,
      }}
    >
      <Box
        display="flex"
        alignItems="left"
        justifyContent="left"
        padding={2}
        color="white"
        borderColor="grey"
      >
        <Avatar
          alt={name}
          src={imageSrc}
          sx={{
            width: { xs: 45, sm: 50, md: 50 },
            height: { xs: 45, sm: 50, md: 50 },
            marginRight: 2,
            paddingBottom: 0,
          }}
        />
        <Typography variant="h5" color="text.primary">
          {name}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
