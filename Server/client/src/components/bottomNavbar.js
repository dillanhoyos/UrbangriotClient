// BottomNav.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ScannerIcon from '@mui/icons-material/Scanner';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

const BottomNav = () => {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0, // Ensure it's aligned to the left edge
        zIndex: 1000,
      }}
    >
      <BottomNavigationAction
        label="Map"
        icon={<MapIcon />}
        component={Link}
        to="/map"
      />
      <BottomNavigationAction
        label="Scan"
        icon={<ScannerIcon />}
        component={Link}
        to="/scan"
      />
      <BottomNavigationAction
        label="Settings"
        icon={<SettingsIcon />}
        component={Link}
        to="/settings"
      />
    </BottomNavigation>
  );
};

export default BottomNav;
