// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

// A new helper component to handle the token from the URL
const AppContent = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const location = useLocation(); // Hook to get the current URL details

  useEffect(() => {
    // --- THIS IS THE NEW, CENTRALIZED LOGIC ---
    // Check for token in URL first
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      console.log('Found token in URL, saving it...');
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      // Clean the URL
      window.history.replaceState(null, '', '/dashboard');
    } else {
      // If no token in URL, check localStorage
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
    setLoading(false); // We are done checking for tokens
    // --- END OF NEW LOGIC ---
  }, [location.search]); // Re-run if the URL search params change

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Show a blank page or a spinner while checking for the token
  if (loading) {
    return null; // Or <CircularProgress />
  }

  return (
    <>
      <Navbar token={token} handleLogout={handleLogout} />
      <Container component="main">
        <Routes>
          <Route path="/login" element={!token ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </>
  );
};

// The main App component now just wraps everything in the Router
function App() {
  return (
    <Router>
      <CssBaseline />
      <AppContent />
    </Router>
  );
}

export default App;