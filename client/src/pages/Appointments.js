import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Stack,
  Chip,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fatal, setFatal] = useState(false);

  const getAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      setFatal(false);
      const res = await axios.get('/api/v1/user/appointments', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      console.log('Appointments response:', res.data);
      setAppointments(Array.isArray(res.data.appointments) ? res.data.appointments : []);
    } catch (error) {
      setAppointments([]);
      setError('Failed to load appointments. Please try again later.');
      console.error('Appointments fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      getAppointments();
    } catch (e) {
      setFatal(true);
      setError('A fatal error occurred. Please contact support.');
      console.error('Fatal error in useEffect:', e);
    }
  }, []);

  // Helper to split appointments
  const now = new Date();
  const safeParseDateTime = (date, time) => {
    try {
      if (!date || !time) return null;
      const dt = new Date(`${date}T${time}`);
      if (isNaN(dt.getTime())) return null;
      return dt;
    } catch {
      return null;
    }
  };
  let pending = [], upcoming = [], completed = [], rejected = [];
  try {
    pending = appointments.filter((a) => a && a.status === 'pending');
    upcoming = appointments.filter(
      (a) => a && a.status === 'accepted' && safeParseDateTime(a.date, a.time) && safeParseDateTime(a.date, a.time) >= now
    );
    completed = appointments.filter(
      (a) => a && a.status === 'completed'
    );
    rejected = appointments.filter(
      (a) => a && (a.status === 'rejected' || a.status === 'cancelled')
    );
  } catch (e) {
    setFatal(true);
    setError('A fatal error occurred while processing appointments.');
    console.error('Fatal error in appointment splitting:', e);
  }

  // Card status chip
  const statusChip = (status) => {
    if (status === 'accepted')
      return <Chip icon={<CheckCircleIcon />} label="Accepted" color="success" sx={{ fontWeight: 600, fontSize: 15 }} />;
    if (status === 'pending')
      return <Chip icon={<HourglassEmptyIcon />} label="Pending" color="warning" sx={{ fontWeight: 600, fontSize: 15 }} />;
    if (status === 'completed')
      return <Chip icon={<CheckCircleIcon />} label="Completed" color="primary" sx={{ fontWeight: 600, fontSize: 15 }} />;
    if (status === 'cancelled')
      return <Chip icon={<CancelIcon />} label="Cancelled" color="default" sx={{ fontWeight: 600, fontSize: 15 }} />;
    return <Chip icon={<CancelIcon />} label="Rejected" color="error" sx={{ fontWeight: 600, fontSize: 15 }} />;
  };

  // Card details
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
  };

  const renderCard = (appt, isUpcoming = false) => {
    if (!appt) return null;
    return (
      <Card
        sx={{
          minHeight: 220,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
          borderRadius: 3,
          boxShadow: 3,
          background: 'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)',
          transition: '0.3s',
          '&:hover': { boxShadow: 8, transform: 'translateY(-4px) scale(1.02)' },
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={1} sx={{ width: '100%' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 54, height: 54, fontSize: 22 }}>
            {appt.doctorName ? getInitials(appt.doctorName) : <PersonIcon />}
          </Avatar>
          <Box sx={{ flex: 1, textAlign: 'left' }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
              // onClick={() => handleDoctorProfile(appt.doctorId)}
            >
              {appt.doctorName || 'Dr. John Doe'}
            </Typography>
            {appt.specialization && (
              <Typography variant="body2" color="text.secondary">
                {appt.specialization}
              </Typography>
            )}
            {appt.mode && (
              <Typography variant="body2" color="text.secondary">
                Mode: {appt.mode.charAt(0).toUpperCase() + appt.mode.slice(1)}
              </Typography>
            )}
          </Box>
        </Stack>
        <CardContent sx={{ textAlign: 'center', flexGrow: 1, width: '100%' }}>
          <Stack direction="row" spacing={2} justifyContent="center" mb={1}>
            <Chip icon={<CalendarMonthIcon />} label={appt.date || 'N/A'} color="info" />
            <Chip icon={<AccessTimeIcon />} label={appt.time || 'N/A'} color="primary" />
          </Stack>
          {appt.location && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              Location: {appt.location}
            </Typography>
          )}
          {statusChip(appt.status)}
          {isUpcoming && (
            <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
              <Button variant="outlined" color="primary" size="small" disabled>
                Reschedule
              </Button>
              <Button variant="outlined" color="error" size="small" disabled>
                Cancel
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  };

  // Top-level render debug
  console.log('Appointments render', { appointments, loading, error, fatal });

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 900, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" mb={4}>
          <Typography variant="h4" align="center" fontWeight={700} color="primary.main" gutterBottom>
            My Appointments
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary">
            View all your upcoming and past appointments here. Stay updated and never miss your visit!
          </Typography>
        </Stack>
        <Box sx={{ mt: 4 }}>
          {fatal && (
            <Alert severity="error" sx={{ mb: 3 }}>A fatal error occurred. Please contact support.</Alert>
          )}
          {error && !fatal && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}
          {loading ? (
            <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading appointments...</Typography>
          ) : appointments.length === 0 && !error && !fatal ? (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Avatar sx={{ bgcolor: 'grey.200', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                <EventAvailableIcon sx={{ color: 'grey.500', fontSize: 48 }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" gutterBottom>No appointments found.</Typography>
              <Typography variant="body1" color="text.secondary">
                Book your first appointment with our top doctors and manage all your visits here!
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 3 }} href="/apply-doctor">
                Book Now
              </Button>
            </Box>
          ) : !error && !fatal ? (
            <>
              {/* Pending Section */}
              {pending.length > 0 && (
                <>
                  <Typography variant="h6" fontWeight={600} color="warning.main" mb={1}>
                    Pending Requests
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    These appointments are awaiting approval from the doctor.
                  </Typography>
                  <Grid container spacing={2} mb={3}>
                    {pending.map((appt, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        {renderCard(appt)}
                      </Grid>
                    ))}
                  </Grid>
                  <Divider sx={{ mb: 3 }} />
                </>
              )}
              {/* Upcoming Section */}
              <Typography variant="h6" fontWeight={600} color="primary.main" mb={1}>
                Upcoming Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                These are your accepted appointments scheduled for the future.
              </Typography>
              {upcoming.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No upcoming appointments. Book your next visit!
                </Alert>
              ) : (
                <Grid container spacing={2} mb={3}>
                  {upcoming.map((appt, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      {renderCard(appt, true)}
                    </Grid>
                  ))}
                </Grid>
              )}
              <Divider sx={{ mb: 3 }} />
              {/* Completed Section */}
              <Typography variant="h6" fontWeight={600} color="success.main" mb={1}>
                Completed Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                These appointments have been completed.
              </Typography>
              {completed.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>No completed appointments yet.</Alert>
              ) : (
                <Grid container spacing={2} mb={3}>
                  {completed.map((appt, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      {renderCard(appt)}
                    </Grid>
                  ))}
                </Grid>
              )}
              <Divider sx={{ mb: 3 }} />
              {/* Rejected/Cancelled Section */}
              <Typography variant="h6" fontWeight={600} color="error.main" mb={1}>
                Rejected / Cancelled Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                These appointments were either rejected by the doctor or cancelled.
              </Typography>
              {rejected.length === 0 ? (
                <Alert severity="info">No rejected or cancelled appointments.</Alert>
              ) : (
                <Grid container spacing={2}>
                  {rejected.map((appt, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      {renderCard(appt)}
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : null}
        </Box>
      </Box>
    </Layout>
  );
};

export default Appointments;
