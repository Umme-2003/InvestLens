// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({ token, handleLogout }) => {
  return (
    // AppBar is the main navigation bar container
    <AppBar position="static">
      <Toolbar>
        {/* 'flexGrow: 1' makes the title take up all available space, pushing the button to the right */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          KaroStartup Pitch Deck Analyzer
        </Typography>
        {/* Only show the logout button if a token exists */}
        {token && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;