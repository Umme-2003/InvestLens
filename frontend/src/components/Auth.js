// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Link, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // A nice icon for the avatar

// A new simple component for the copyright footer
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        InvestLens
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = { email, password };
    
    try {
      const response = await axios.post(url, payload);
      if (isLogin) {
        onLoginSuccess(response.data.token);
      } else {
        setMessage('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* --- 1. NEW BRANDING HEADER --- */}
        <Typography component="h1" variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
          Welcome to InvestLens
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Uncover investment potential with the power of AI.
        </Typography>

        {/* --- 2. IMPROVED FORM LAYOUT (using Paper component) --- */}
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, width: '100%', maxWidth: '450px' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h2" variant="h5">
            {isLogin ? 'Sign in' : 'Sign up'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Button
                href="/api/auth/google"
                fullWidth
                variant="outlined"
                startIcon={<img src="/google-logo.svg" alt="Google logo" style={{width: 20, height: 20}} />}
                sx={{ mt: 2, mb: 1 }}
            >
              Sign In with Google
            </Button>

            <Typography align="center" sx={{ my: 1 }}>OR</Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin ? 'Sign In' : 'Register'}
            </Button>
            {error && <Typography color="error" align="center">{error}</Typography>}
            {message && <Typography color="success.main" align="center">{message}</Typography>}
            <Link href="#" variant="body2" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }} sx={{ display: 'block', textAlign: 'center' }}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Link>
          </Box>
        </Paper>
        
        {/* --- 3. NEW COPYRIGHT FOOTER --- */}
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Box>
    </Container>
  );
};

export default Auth;
