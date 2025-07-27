// src/theme.js
import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Palette values for light mode
          primary: {
            main: '#1976d2', // A nice blue
          },
          secondary: {
            main: '#dc004e', // A pinkish red
          },
          background: {
            default: '#f4f6f8',
            paper: '#ffffff',
          },
        }
      : {
          // Palette values for dark mode
          primary: {
            main: '#90caf9', // A lighter blue for contrast
          },
          secondary: {
            main: '#f48fb1', // A lighter pink
          },
          background: {
            default: '#121212', // Standard dark background
            paper: '#1e1e1e', // Slightly lighter for cards/surfaces
          },
        }),
  },
  typography: {
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
  }
});

export default getDesignTokens;
