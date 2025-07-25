import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, InputAdornment, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';


const userTypes = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'admin', label: 'Admin' },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const validate = () => {
    if (!form.email || !form.password) {
      setError('Please fill all required fields.');
      return false;
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const onfinishHandler = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/login', {
        ...form,
        role,
      });
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else if (res.data.user.role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid credentials or user type.');
      }
    } catch (error) {
      dispatch(hideLoading());
      setError('Something went wrong');
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8, p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: 4 }}>
      <Stack alignItems="center" spacing={1} mb={2}>
        <PersonIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h5" fontWeight={700} align="center">Sign In to Your Account</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Login as a Patient, Doctor, or Admin to access your dashboard.
        </Typography>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={onfinishHandler}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }}
        />
        <TextField
          select
          margin="normal"
          required
          fullWidth
          label="Login as"
          name="role"
          value={role}
          onChange={handleRoleChange}
        >
          {userTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2, fontWeight: 600 }}>
          Login
        </Button>
        <Typography align="center" sx={{ mt: 2 }}>
          Not a user? <Link to="/register">Register here</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
