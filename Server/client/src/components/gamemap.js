import React from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const OuterContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: "#00B6EA",
  overflow: 'hidden',
}));

const MapContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  overflow: 'visible', // Changed from 'hidden' to 'visible'
}));

const Controls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  left: 10,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  borderRadius: '4px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
}));

const ImageNavigation = ({ imageSrc }) => {
  return (
    <OuterContainer>
      <MapContainer>
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={10}
          smooth={true}
          limitToBounds={false}
          centerContent={false}
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: true }}
          style={{ overflow: 'visible' }} // Added this line
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <Controls>
                <IconButton onClick={() => zoomIn(0.7, 300)}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => zoomOut(0.7, 300)}>
                  <RemoveIcon />
                </IconButton>
                <IconButton onClick={() => resetTransform(500)}>
                  <RestartAltIcon />
                </IconButton>
              </Controls>
              <TransformComponent wrapperStyle={{ overflow: 'visible' }}> {/* Added wrapperStyle */}
                <img src={imageSrc} alt="Navigable Map" style={{ width: '100%', height: 'auto' }} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </MapContainer>
    </OuterContainer>
  );
};

export default ImageNavigation;