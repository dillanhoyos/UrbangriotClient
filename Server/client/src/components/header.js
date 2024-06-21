// Header.js
import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

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
      <Avatar alt={name} src={imageSrc} sx={{ width: 56, height: 56, marginRight: 2 }} />
      <Typography variant="h5" color="text.primary">{name}</Typography>
    </Box>
  );
};

export default Header;
