// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Link, Divider } from '@mui/material';

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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {isLogin ? 'Sign in' : 'Sign up'}
        </Typography>

        {/* --- GOOGLE SIGN IN BUTTON --- */}
        <Button
          component="a" // Use component="a" to make it a link
          href="/api/auth/google"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: '#4285F4', '&:hover': { backgroundColor: '#357AE8' } }}
        >
          Sign In with Google
        </Button>

        <Divider sx={{ width: '100%', mb: 2 }}>OR</Divider>

        {/* --- REGULAR EMAIL/PASSWORD FORM --- */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          <Link href="#" variant="body2" sx={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Auth;