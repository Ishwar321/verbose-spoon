

import React, { useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../components/DoctorLayout';
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Stack,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

const DoctorHome = () => {
  const [stats, setStats] = useState({ appointments: 0, patients: 0 });
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/v1/doctor/dashboard', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        });
        setStats({
          appointments: res.data.appointmentsCount || 0,
          patients: res.data.patientsCount || 0,
        });
        setNextAppointment(res.data.nextAppointment || null);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <DoctorLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, p: { xs: 1, sm: 3 } }}>
        <Stack spacing={2} alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight={800} color="primary.main" align="center" gutterBottom>
            Doctor Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center">
            Welcome back! Here you can quickly review your practice stats, manage appointments, and access your most important tools.
          </Typography>
        </Stack>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <AssignmentTurnedInIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight={700}>{stats.appointments}</Typography>
              <Typography variant="subtitle1" color="primary.dark">Total Appointments</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, textAlign: 'center', background: 'linear-gradient(135deg, #e8f5e9 60%, #f8fafc 100%)' }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <GroupIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight={700}>{stats.patients}</Typography>
              <Typography variant="subtitle1" color="success.dark">Unique Patients</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, textAlign: 'center', background: 'linear-gradient(135deg, #fceabb 60%, #f8fafc 100%)' }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                <AccessTimeIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight={700}>{nextAppointment ? 1 : 0}</Typography>
              <Typography variant="subtitle1" color="warning.dark">Upcoming Appointment</Typography>
            </Card>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="primary" fullWidth sx={{ py: 2, fontWeight: 600 }} href="/doctor/upcoming-appointments" startIcon={<AccessTimeIcon />}>
              View Upcoming
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="success" fullWidth sx={{ py: 2, fontWeight: 600 }} href="/doctor/approve-appointments" startIcon={<AssignmentTurnedInIcon />}>
              Approve Requests
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="info" fullWidth sx={{ py: 2, fontWeight: 600 }} href="/doctor/patients" startIcon={<GroupIcon />}>
              My Patients
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" color="secondary" fullWidth sx={{ py: 2, fontWeight: 600 }} href="/doctor/appointment-history" startIcon={<CalendarMonthIcon />}>
              Appointment History
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" gutterBottom fontWeight={700} color="primary.dark" align="center">
          Next Appointment
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : nextAppointment ? (
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, mb: 2, maxWidth: 600, mx: 'auto', background: 'linear-gradient(135deg, #f3e5f5 60%, #f8fafc 100%)' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <CalendarMonthIcon />
              </Avatar>
              <Box>
                <Typography fontWeight={700} color="primary.main">{nextAppointment.patientName || 'Patient'}</Typography>
                <Typography fontSize={16} color="text.secondary">
                  <AccessTimeIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                  {nextAppointment.date} at {nextAppointment.time}
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
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="primary" fontWeight={600}>
            "Thank you for your dedication to patient care."
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Use the quick links above to manage your workflow efficiently.
          </Typography>
        </Box>
      </Box>
    </DoctorLayout>
  );
// Removed duplicate/invalid JSX after main return
};

export default DoctorHome;