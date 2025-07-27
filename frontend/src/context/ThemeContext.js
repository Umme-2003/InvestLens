// src/context/ThemeContext.js
import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import getDesignTokens from '../theme';

// Create a context for the color mode
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeProvider = ({ children }) => {
  // Get the user's preference from localStorage, or default to 'light'
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            // Save the new mode to localStorage
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
      },
    }),
    [],
  );

  // Update the theme only when the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ColorModeContext.Provider>
  );
};