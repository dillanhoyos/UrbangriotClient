import React from 'react';
import { Box } from '@mui/material';

const ImageNavigation = ({ imageSrc }) => {
  return (
    <Box p={0}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <img 
        src={imageSrc} 
        alt="Navigable Map" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          objectFit: 'contain', 
          display: 'block', 
          alignSelf: 'flex-start'  // Aligns the image to the top
        }} 
      />
    </Box>
  );
};

export default ImageNavigation;
