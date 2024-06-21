// src/ResponsiveComponent.js
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Typography } from '@mui/material';

function ResponsiveComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box p={2} bgcolor={isMobile ? 'lightblue' : 'lightgreen'}>
      <Typography variant={isMobile ? 'body1' : 'h4'}>
        {isMobile ? 'Mobile View' : 'Desktop View'}
      </Typography>
    </Box>
  );
}

export default ResponsiveComponent;
