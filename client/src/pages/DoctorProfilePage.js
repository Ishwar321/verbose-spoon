import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Avatar, Stack, Snackbar, Alert as MuiAlert } from '@mui/material';
import axios from 'axios';
import DoctorLayout from '../components/DoctorLayout';
import PersonIcon from '@mui/icons-material/Person';

const DoctorProfilePage = () => {
  const [editProfile, setEditProfile] = useState({ name: '', email: '', role: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/v1/doctor/profile', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        });
        const user = res.data?.data || {};
        setEditProfile({
          name: user.name || '',
          email: user.email || '',
          role: user.role || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put('/api/v1/doctor/updateProfile', editProfile, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setSuccess('Profile updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Failed to update profile.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <DoctorLayout>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 3 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
          <Stack spacing={2} alignItems="center" mb={2}>
            <Avatar sx={{ width: 90, height: 90, bgcolor: 'primary.main', fontSize: 48 }}>
              <PersonIcon fontSize="inherit" />
            </Avatar>
            <TextField
              label="Name"
              name="name"
              value={editProfile.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={editProfile.email}
              onChange={handleChange}
              fullWidth
              required
              type="email"
            />
            <TextField
              label="Role"
              name="role"
              value={editProfile.role}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ bgcolor: '#f5f5f5' }}
            />
            {error && <MuiAlert severity="error" sx={{ width: '100%' }}>{error}</MuiAlert>}
            {success && <MuiAlert severity="success" sx={{ width: '100%' }}>{success}</MuiAlert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Update Profile
            </Button>
          </Stack>
        </Paper>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {success ? (
            <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              {success}
            </MuiAlert>
          ) : error ? (
            <MuiAlert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
              {error}
            </MuiAlert>
          ) : null}
        </Snackbar>
      </Box>
    </DoctorLayout>
  );
};

export default DoctorProfilePage; // Export the new component name