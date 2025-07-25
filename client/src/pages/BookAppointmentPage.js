import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Stack,
  CardActions,
  Chip,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const BookAppointmentPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [bookingMode, setBookingMode] = useState('online');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const navigate = useNavigate();

  const getDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/user/getAllDoctors', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.doctors || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      setDoctors([]);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  const handleBookClick = (doc) => {
    setBookingDoctor(doc);
    setBookingDate(null);
    setBookingTime(null);
    setBookingMode('online');
    setBookingSuccess('');
    setBookingError('');
  };

  const handleBookingClose = () => {
    setBookingDoctor(null);
    setBookingDate(null);
    setBookingTime(null);
    setBookingMode('online');
    setBookingSuccess('');
    setBookingError('');
  };

  const handleBookAppointment = async () => {
    if (!bookingDate || !bookingTime) {
      setBookingError('Please select both date and time.');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      const dateStr = format(bookingDate, 'yyyy-MM-dd');
      const timeStr = format(bookingTime, 'HH:mm');
      const res = await axios.post('/api/v1/user/book-appointment', {
        doctorId: bookingDoctor._id,
        date: dateStr,
        time: timeStr,
        mode: bookingMode,
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setBookingSuccess('Appointment booked successfully!');
        setTimeout(() => {
          handleBookingClose();
        }, 1500);
      } else {
        setBookingError(res.data.message || 'Failed to book appointment.');
      }
    } catch (error) {
      setBookingError('Failed to book appointment. Please try again.');
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Layout>
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight={700} color="primary.main">
          Find Your Doctor
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" mb={4}>
          Browse our list of specialists and book an appointment with ease.
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : doctors.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No doctors available at the moment.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please check back later or contact support.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {doctors.map((doc) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={doc._id}>
                <Card sx={{
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-4px)',
                  },
                }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 70, height: 70, mb: 2 }}>
                    <LocalHospitalIcon fontSize="large" />
                  </Avatar>
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1, width: '100%' }}>
                    <Typography variant="h6" fontWeight={600}>{doc.name || 'Dr. Unknown'}</Typography>
                    <Typography color="text.secondary" fontSize={15}>{doc.specialization || 'Specialist'}</Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
                      <Chip icon={<SchoolIcon />} label={doc.education || 'N/A'} size="small" />
                      <Chip icon={<WorkHistoryIcon />} label={`${doc.experience || 0} yrs`} size="small" />
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ width: '100%' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleBookClick(doc)}
                    >
                      Book Appointment
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Dialog open={!!bookingDoctor} onClose={handleBookingClose} maxWidth="xs" fullWidth>
          <DialogTitle>Book Appointment with {bookingDoctor?.name}</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={2} mt={1}>
                <DatePicker
                  label="Select Date"
                  value={bookingDate}
                  onChange={setBookingDate}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
                <TimePicker
                  label="Select Time"
                  value={bookingTime}
                  onChange={setBookingTime}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
                <TextField
                  select
                  label="Mode of Appointment"
                  value={bookingMode}
                  onChange={e => setBookingMode(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </TextField>
              </Stack>
            </LocalizationProvider>
            {bookingError && <Alert severity="error" sx={{ mt: 2 }}>{bookingError}</Alert>}
            {bookingSuccess && <Alert severity="success" sx={{ mt: 2 }}>{bookingSuccess}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBookingClose} color="secondary">Cancel</Button>
            <Button
              onClick={handleBookAppointment}
              color="primary"
              variant="contained"
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Booking...' : 'Book'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default BookAppointmentPage;