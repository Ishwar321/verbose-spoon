import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, InputAdornment, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const userTypes = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'admin', label: 'Admin' },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm({ ...form, specialization: '', experience: '' });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
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
    if (role === 'doctor' && (!form.specialization || !form.experience)) {
      setError('Please provide specialization and experience for doctors.');
      return false;
    }
    return true;
  };

  const onfinishHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/register', {
        ...form,
        role,
      });
      dispatch(hideLoading());
      if (res.data.success) {
        setSuccess('Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else if (res.data.message && res.data.message.toLowerCase().includes('exist')) {
        setError('This email is already registered as another user type. Please use a different email.');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      setError('Something went wrong');
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8, p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: 4 }}>
      <Stack alignItems="center" spacing={1} mb={2}>
        <PersonIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h5" fontWeight={700} align="center">Create Your Account</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Register as a Patient, Doctor, or Admin to access the platform.
        </Typography>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={onfinishHandler}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
        />
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
          label="Register as"
          name="role"
          value={role}
          onChange={handleRoleChange}
        >
          {userTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        {role === 'doctor' && (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon /></InputAdornment> }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Experience (years)"
              name="experience"
              type="number"
              value={form.experience}
              onChange={handleChange}
              InputProps={{ startAdornment: <InputAdornment position="start"><SchoolIcon /></InputAdornment> }}
            />
          </>
        )}
        <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2, fontWeight: 600 }}>
          Register
        </Button>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
