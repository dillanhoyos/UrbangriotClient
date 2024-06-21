import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Pin = ({ x, y, label }) => {
  return (
    <Box
      position="absolute"
      left={x}
      top={y}
      transform="translate(-50%, -50%)"
      bgcolor="secondary.main"
      color="white"
      padding={1}
      borderRadius="50%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={40}
      height={40}
    >
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
};

export default Pin;
