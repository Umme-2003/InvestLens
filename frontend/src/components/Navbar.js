// src/components/Navbar.js
import React, { useContext } from 'react'; // Import useContext
import { AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material';
import { ColorModeContext } from '../context/ThemeContext'; // Import our context
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

const Navbar = ({ token, handleLogout }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          InvestLens
        </Typography>
        
        {/* The Theme Toggle Button */}
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {token && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
