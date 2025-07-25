import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Avatar, Stack, Paper, Snackbar, Alert as MuiAlert } from '@mui/material';
import Layout from '../components/Layout';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const Profile = () => {
  // Removed unused profile state to fix eslint warning
  const [editProfile, setEditProfile] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [originalProfile, setOriginalProfile] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const res = await axios.post('/api/v1/user/getUserData', {}, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        });
        const user = res.data?.data || {};
        const newProfile = {
          name: user.name || '',
          email: user.email || '',
          role: user.role || '',
        };
        setEditProfile(newProfile);
        setOriginalProfile(newProfile);
      } catch (err) {
        // Optionally handle error
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [location]);

  const handleChange = (e) => {
    setEditProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put('/api/v1/user/updateProfile', editProfile, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setSuccess('Profile updated successfully!');
      setOriginalProfile(editProfile);
      setSnackbarOpen(true);
    } catch (err) {
      setError('Failed to update profile.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Helper to check if profile changed
  const isProfileChanged = () => {
    return (
      editProfile.name !== originalProfile.name ||
      editProfile.email !== originalProfile.email
    );
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
  };

  if (fetching) {
    return (
      <Layout>
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center' }}>
          <Typography variant="h6">Loading profile...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 3 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
          <Stack spacing={2} alignItems="center" mb={2}>
            <Avatar sx={{ width: 90, height: 90, bgcolor: 'primary.main', fontSize: 48 }}>
              {editProfile.name ? getInitials(editProfile.name) : <PersonIcon fontSize="inherit" />}
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
              disabled={loading || !isProfileChanged()}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
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
    </Layout>
  );
};

export default Profile;
