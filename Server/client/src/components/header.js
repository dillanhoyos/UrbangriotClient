// Header.js
import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const Header = ({ imageSrc, name }) => {
  return (
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
          paddingBottom: 0 
        }}
      />
      <Typography variant="h5" color="text.primary">
        {name}
      </Typography>
    </Box>
  );
};

export default Header;
