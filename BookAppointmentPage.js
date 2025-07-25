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

const BookAppointmentPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setError(null);
        const res = await axios.get('/api/v1/user/getAllDoctors', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        });
        setDoctors(res.data.doctors || []);
      } catch (err) {
        setError('Failed to load doctors.');
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

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
  };

  const handleApply = async () => {
    try {
      setSuccess('');
      await axios.post('/api/v1/user/book-appointment', {
        doctorId: selectedDoctor._id,  // Use _id for backend compatibility
        date,
        time,
        mode,
      }, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setSuccess('Appointment booked successfully!');
    } catch (err) {
      setSuccess('Failed to book appointment.');
    }
  };

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" align="center" fontWeight={700} color="primary.main" gutterBottom>
          Available Doctors
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={3} justifyContent="center">
          {doctors.map((doctor) => (
            <Grid key={doctor._id} item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', mb: 2 }}>
                <Stack alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 1 }}>
                    <LocalHospitalIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>{doctor.name}</Typography>
                  <Typography color="text.secondary">Specialization: {doctor.specialization}</Typography>
                  <Typography color="text.secondary">Experience: {doctor.experience} years</Typography>
                  <Typography color="text.secondary">Email: {doctor.email}</Typography>
                  <Typography color="text.secondary">Education: {doctor.education || 'N/A'}</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleOpen(doctor)}>
                    Book Appointment
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth >
          <DialogTitle>Book Appointment with {selectedDoctor?.name}</DialogTitle>
          <DialogContent sx={{ minWidth: { xs: 320, sm: 480 }, minHeight: { xs: 200, sm: 120 } }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                select
                label="Mode"
                value={mode}
                onChange={e => setMode(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>Select Mode</em>
                </MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </TextField>
              {success && <Alert severity={success.includes('successfully') ? 'success' : 'error'}>{success}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleApply} variant="contained" color="primary" disabled={!date || !time || !mode || success.includes('successfully')}>
              Book Now
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default BookAppointmentPage;