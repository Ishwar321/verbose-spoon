import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout'; // Use the main, role-aware Layout for consistency
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Stack,
  CircularProgress, Divider, Alert, Button
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';

const UpcomingAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUpcomingAppointments = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // Fetch ALL appointments for the doctor and then filter them on the frontend
      const res = await axios.get('/api/v1/doctor/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const now = dayjs(); // Current date and time
        const filteredAppts = (res.data.appointments || []).filter(appt => {
          // Ensure date and time exist and are valid before parsing
          if (!appt.date || !appt.time) return false;
          const appointmentDateTime = dayjs(`${appt.date}T${appt.time}`);
          // FIX: The status for a confirmed appointment is 'accepted', not 'approved'.
          return appt.status === 'accepted' && appointmentDateTime.isAfter(now);
        }).sort((a, b) => { // Sort by date and time
          const dateA = dayjs(`${a.date}T${a.time}`);
          const dateB = dayjs(`${b.date}T${b.time}`);
          return dateA.diff(dateB);
        });
        setAppointments(filteredAppts);
      } else {
        setError(res.data.message || 'Failed to fetch appointments.');
      }
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      setError('Failed to load upcoming appointments. Please check your network or try again.');
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        localStorage.clear();
        // Redirect to login if token is invalid/expired.
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, [fetchUpcomingAppointments]);

  // Helper to format date and time for display
  const formatAppointmentDateTime = (date, time) => {
    if (!date || !time) return 'N/A';
    const dt = dayjs(`${date}T${time}`);
    return dt.isValid() ? dt.format('dddd, MMMM D, YYYY [at] h:mm A') : 'Invalid Date/Time';
  };

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" align="center" gutterBottom>
          Your Upcoming Appointments
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" mb={4}>
          Here are all the appointments you have approved that are scheduled for the future.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" size={40} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 3 }}>
            {error}
          </Alert>
        ) : appointments.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6, p: 3 }}>
            <Avatar sx={{ bgcolor: 'info.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <EventAvailableIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>No upcoming appointments found.</Typography>
            <Typography variant="body1" color="text.secondary">
              You currently have no approved appointments scheduled for the future.
            </Typography>
            {/* Button to direct to the main appointments page to check pending requests */}
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/doctor/appointments')}>
              Check Pending Requests
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((appt) => (
              <Grid item xs={12} sm={6} md={4} key={appt._id}> {/* Use appt._id for unique key */}
                <Card sx={{
                  borderRadius: 3, boxShadow: 3, p: 2, minHeight: 180,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        <EventAvailableIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700} variant="h6">{appt.userId?.name || 'Patient'}</Typography>
                        <Typography color="text.secondary" fontSize={14}>{appt.userId?.email || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ mb: 1 }} />
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <CalendarMonthIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.primary">
                        {formatAppointmentDateTime(appt.date, appt.time)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.primary">
                        Mode: {appt.mode || 'N/A'}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="outlined" color="primary" size="small" onClick={() => { /* Implement view details logic or navigate */ }}>
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default UpcomingAppointmentsPage;