// BottomNav.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ScannerIcon from '@mui/icons-material/Scanner';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

const BottomNav = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const navItems = [
    { label: "Map", icon: <MapIcon />, to: "/map" },
    { label: "Scan", icon: <ScannerIcon />, to: "/scan" },
    { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
  ];

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: 200,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 200, boxSizing: 'border-box' },
          }}
        >
          <List>
            {navItems.map((item, index) => (
              <ListItem button component={Link} to={item.to} key={index}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      ) : (
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
            left: 0,
            zIndex: 1000,
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={index}
              label={item.label}
              icon={item.icon}
              component={Link}
              to={item.to}
            />
          ))}
        </BottomNavigation>
      )}
    </>
  );
};

export default BottomNav;