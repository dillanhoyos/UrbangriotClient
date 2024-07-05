import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333', // Indigo
    },
    secondary: {
      main: '#fff', // Pink
    },
    background: {
      default: '#f0f2f5', // Light Grey
      paper: '#fff', // White
    },
    text: {
      primary: '#333', // Dark Grey
      secondary: '#666', // Medium Grey
    },
    error: {
      main: '#f44336', // Red
    },
    success: {
      main: '#4caf50', // Green
    },
    warning: {
      main: '#ff9800', // Orange
    },
    info: {
      main: '#2196f3', // Blue
    },
    divider: '#ccc', // Divider color
    action: {
      active: '#1976d2', // Active state color
      hover: '#eee', // Hover state color
      selected: '#f5f5f5', // Selected state color
      disabled: '#ccc', // Disabled state color
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Patrick Hand", cursive',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
