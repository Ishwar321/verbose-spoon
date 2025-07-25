import React from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      role: 'admin',
    };
    try {
      const res = await axios.post('/api/v1/user/register', values);
      if (res.data.success) {
        setSuccess('Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>Admin Signup</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField margin="normal" required fullWidth label="Name" name="name" />
        <TextField margin="normal" required fullWidth label="Email" name="email" type="email" />
        <TextField margin="normal" required fullWidth label="Password" name="password" type="password" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Sign Up</Button>
      </Box>
    </Box>
  );
};

export default AdminSignup;
