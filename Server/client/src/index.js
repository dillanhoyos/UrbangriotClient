// src/index.js
import React from 'react';
import {createRoot} from 'react-dom';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const root = createRoot(document.getElementById('root'));


root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);