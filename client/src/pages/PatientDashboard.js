import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Typography, Box, Card, CardContent, Button, Grid, Avatar, Stack, Divider } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';


const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, upcoming: 0 });
  const [nextAppointment, setNextAppointment] = useState(null);
  const navigate = useNavigate();

  const getDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/doctor/getAllDoctors', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setDoctors(res.data.doctors || []);
    } catch (error) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      const res = await axios.get('/api/v1/user/appointments', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      const appts = res.data.appointments || [];
      const now = new Date();
      let pending = 0, upcoming = 0, next = null;
      appts.forEach(appt => {
        if (appt.status === 'pending') pending++;
        if (appt.status === 'accepted') {
          upcoming++;
          // Find next upcoming
          const apptDate = new Date(`${appt.date}T${appt.time}`);
          if (!next || (apptDate > now && apptDate < new Date(`${next.date}T${next.time}`))) {
            next = appt;
          }
        }
      });
      setStats({ total: appts.length, pending, upcoming });
      setNextAppointment(next);
    } catch {
      setStats({ total: 0, pending: 0, upcoming: 0 });
      setNextAppointment(null);
    }
  };

  useEffect(() => {
    getDoctors();
    getStats();
  }, []);

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" mb={4}>
          <Typography variant="h3" align="center" fontWeight={700} color="primary.main" gutterBottom>
            Patient Dashboard
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary">
            Welcome! Book appointments, view your stats, and connect with top doctors.
          </Typography>
        </Stack>
        <Grid container spacing={4} justifyContent="center" mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <EventAvailableIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{stats.total}</Typography>
              <Typography variant="subtitle1">Total Appointments</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <EventAvailableIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{stats.pending}</Typography>
              <Typography variant="subtitle1">Pending</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <FavoriteIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{stats.upcoming}</Typography>
              <Typography variant="subtitle1">Upcoming</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <LocalHospitalIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{doctors.length}</Typography>
              <Typography variant="subtitle1">Doctors</Typography>
            </Card>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" gutterBottom fontWeight={600} color="primary.dark">
          Next Appointment
        </Typography>
        {nextAppointment ? (
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4, mb: 2, maxWidth: 500, mx: 'auto' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                <EventAvailableIcon />
              </Avatar>
              <Box>
                <Typography fontWeight={600} color="primary.main">Upcoming Appointment</Typography>
                <Typography fontSize={15} color="text.secondary">
                  {nextAppointment.date} at {nextAppointment.time} with {nextAppointment.doctorName || 'Doctor'}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  Mode: {nextAppointment.mode || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </Card>
        ) : (
          <Typography align="center" color="text.secondary">No upcoming appointments.</Typography>
        )}
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" color="primary" fullWidth sx={{ py: 2, fontWeight: 600 }} onClick={() => navigate('/apply-doctor')}>
              Book Appointment
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="outlined" color="primary" fullWidth sx={{ py: 2, fontWeight: 600 }} onClick={() => navigate('/appointments')}>
              View Appointments
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="outlined" color="secondary" fullWidth sx={{ py: 2, fontWeight: 600 }} onClick={() => navigate('/profile')}>
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default PatientDashboard;
