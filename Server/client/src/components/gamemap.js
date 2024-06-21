import React from 'react';
import { Box } from '@mui/material';

const ImageNavigation = ({ imageSrc }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img src={imageSrc} alt="Navigable Map" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Box>
  );
};

export default ImageNavigation;
