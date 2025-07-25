import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Alert
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const FindDoctors = () => {
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

  const handleBook = async () => {
    try {
      setSuccess('');
      await axios.post('/api/v1/user/book-appointment', {
        doctorId: selectedDoctor.id,
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
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main" gutterBottom>
        Find Doctors
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3} justifyContent="center">
        {doctors.map((doctor) => (
          <Grid key={doctor.id} gridSize={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', mb: 2 }}>
              <Stack alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 1 }}>
                  <LocalHospitalIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>{doctor.name}</Typography>
                <Typography color="text.secondary">Specialization: {doctor.specialization}</Typography>
                <Typography color="text.secondary">Experience: {doctor.experience} years</Typography>
                <Typography color="text.secondary">Email: {doctor.email}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleOpen(doctor)}>
                  Book Appointment
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book Appointment with {selectedDoctor?.name}</DialogTitle>
        <DialogContent>
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
              SelectProps={{ native: true }}
            >
              <option value="">Select Mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </TextField>
            {success && <Alert severity={success.includes('successfully') ? 'success' : 'error'}>{success}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBook} variant="contained" color="primary" disabled={!date || !time || !mode}>
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FindDoctors;
