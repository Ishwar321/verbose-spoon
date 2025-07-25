import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  MenuItem
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Layout from '../components/Layout';
import axios from 'axios';

const ApplyDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('');
  const [success, setSuccess] = useState('');
  // Removed unused loading state
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDoctor, setProfileDoctor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Close booking dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
    setSuccess('');
    setDate('');
    setTime('');
    setMode('');
  };

  // Handle booking appointment
  const handleApply = async () => {
    if (!selectedDoctor || !date || !time || !mode) return;
    setSuccess('');
    try {
      const res = await axios.post('/api/v1/user/book-appointment', {
        doctorId: selectedDoctor._id,
        date,
        time,
        mode,
      }, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      if (res.data && res.data.success) {
        setSuccess('Appointment booked successfully!');
        setOpen(false);
        setConfirmOpen(true);
      } else {
        setSuccess(res.data.message || 'Failed to book appointment.');
      }
    } catch (err) {
      setSuccess('Failed to book appointment.');
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      // setLoading(true); // removed unused loading state
      try {
        setError(null);
        const res = await axios.get('/api/v1/admin/getAllDoctors', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        });
        setDoctors(res.data.doctors || []);
      } catch (err) {
        setError('Failed to load doctors.');
      } finally {
      // setLoading(false); // removed unused loading state
      }
    };
    fetchDoctors();
  }, []);

  const handleOpen = (doctor) => {
    setSelectedDoctor(doctor);
    setDate('');
    setTime('');
    setMode('');
    setSuccess('');
    setOpen(true);
  };

  const handleProfileOpen = (doctor) => {
    setProfileDoctor(doctor);
    setProfileOpen(true);
  };
  const handleProfileClose = () => {
    setProfileOpen(false);
    setProfileDoctor(null);
  };

  // Filter doctors by search
  const filteredDoctors = doctors.filter(doctor => {
    const searchLower = search.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(searchLower) ||
      (doctor.specialization && doctor.specialization.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" align="center" fontWeight={700} color="primary.main" gutterBottom>
          Available Doctors
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <TextField
            label="Search by name or specialization"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 350 }}
          />
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {filteredDoctors.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">No doctors found.</Typography>
            </Grid>
          ) : (
            filteredDoctors.map((doctor) => (
              <Grid key={doctor._id} item xs={12} sm={6} md={4}>
                <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', mb: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Stack alignItems="center" spacing={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 1 }}>
                      <LocalHospitalIcon fontSize="large" />
                    </Avatar>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
                      onClick={() => handleProfileOpen(doctor)}
                    >
                      {doctor.name}
                    </Typography>
        {/* Doctor Profile Dialog */}
        <Dialog open={profileOpen} onClose={handleProfileClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Doctor Profile</DialogTitle>
          <DialogContent dividers>
            {profileDoctor && (
              <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 70, height: 70 }}>
                  <LocalHospitalIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>{profileDoctor.name}</Typography>
                <Typography color="text.secondary">Specialization: {profileDoctor.specialization}</Typography>
                <Typography color="text.secondary">Experience: {profileDoctor.experience} years</Typography>
                <Typography color="text.secondary">Email: {profileDoctor.email}</Typography>
                {profileDoctor.qualifications && (
                  <Typography color="text.secondary">Qualifications: {profileDoctor.qualifications}</Typography>
                )}
                {profileDoctor.bio && (
                  <Typography color="text.secondary">Bio: {profileDoctor.bio}</Typography>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProfileClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Booking Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Appointment Booked</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 70, height: 70 }}>
                <LocalHospitalIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color="success.main">Success!</Typography>
              <Typography>Your appointment has been booked and is pending approval.</Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">OK</Button>
          </DialogActions>
        </Dialog>
                    <Typography color="text.secondary">Specialization: {doctor.specialization}</Typography>
                    <Typography color="text.secondary">Experience: {doctor.experience} years</Typography>
                    <Typography color="text.secondary">Email: {doctor.email}</Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleOpen(doctor)}>
                      Book Appointment
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Booking Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, px: 2, py: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Book with {selectedDoctor?.name}
          </DialogTitle>

          <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
              <TextField
                label="Time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
              <TextField
                select
                label="Mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value=""><em>Select Mode</em></MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </TextField>

              {success && (
                <Alert severity={success.includes('successfully') ? 'success' : 'error'}>
                  {success}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} size="small">Cancel</Button>
            <Button
              onClick={handleApply}
              variant="contained"
              color="primary"
              size="small"
              disabled={!date || !time || !mode || success.includes('successfully')}
            >
              Book Now
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default ApplyDoctor;
