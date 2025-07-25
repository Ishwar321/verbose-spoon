import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Typography, Box, Card, CardContent, Grid, Avatar, Stack, Chip, Divider, Button, Tooltip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0 });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API calls for stats and recent activity
      const usersRes = await axios.get('/api/v1/admin/getAllUsers', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      const doctorsRes = await axios.get('/api/v1/admin/getAllDoctors', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setStats({
        users: usersRes.data.users.length,
        doctors: doctorsRes.data.doctors.length,
        appointments: 42, // Replace with real data if available
      });
      setRecentUsers(usersRes.data.users.slice(0, 3));
      setRecentDoctors(doctorsRes.data.doctors.slice(0, 3));
    } catch (error) {
      setStats({ users: 0, doctors: 0, appointments: 0 });
      setRecentUsers([]);
      setRecentDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" mb={4}>
          <Typography variant="h3" align="center" fontWeight={700} color="primary.main" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary">
            Manage users, doctors, and appointments with real-time insights
          </Typography>
        </Stack>
        {/* Quick Actions */}
        <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
          <Button variant="contained" color="primary" onClick={() => navigate('/admin/doctors')}>Manage Doctors</Button>
          <Button variant="contained" color="secondary" onClick={() => navigate('/admin/users')}>View Patients</Button>
          <Button variant="contained" color="info" onClick={() => navigate('/admin/appointments')}>View Appointments</Button>
        </Stack>
        {/* Stats Cards */}
        <Grid container spacing={4} justifyContent="center" mb={4}>
          <Grid item xs={12} sm={4}>
            <Tooltip title="View all patients">
              <Card onClick={() => navigate('/admin/users')} sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText', cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.03)' } }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                  <PeopleIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{stats.users}</Typography>
                <Typography variant="subtitle1">Total Patients</Typography>
              </Card>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Tooltip title="View all doctors">
              <Card onClick={() => navigate('/admin/doctors')} sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText', cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.03)' } }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                  <LocalHospitalIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{stats.doctors}</Typography>
                <Typography variant="subtitle1">Total Doctors</Typography>
              </Card>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Tooltip title="View all appointments">
              <Card onClick={() => navigate('/admin/appointments')} sx={{ p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText', cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.03)' } }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                  <EventNoteIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{stats.appointments}</Typography>
                <Typography variant="subtitle1">Appointments</Typography>
              </Card>
            </Tooltip>
          </Grid>
        </Grid>
        {/* Notifications Section */}
        <Divider sx={{ my: 4 }} />
        <Box mb={4}>
          <Typography variant="h5" fontWeight={600} color="primary.dark" mb={2}>
            Notifications & Pending Actions
          </Typography>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2, bgcolor: 'warning.light' }}>
            <Typography color="warning.main" fontWeight={600}>
              {/* Example notification, replace with real logic if needed */}
              {recentDoctors.some(doc => doc.status !== 'approved')
                ? `You have ${recentDoctors.filter(doc => doc.status !== 'approved').length} doctor(s) pending approval.`
                : 'No pending doctor approvals.'}
            </Typography>
          </Card>
        </Box>
        {/* Recent Activity */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <NotificationsActiveIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>Recent Doctors</Typography>
                </Stack>
                {recentDoctors.length === 0 ? (
                  <Typography color="text.secondary">No recent doctors found.</Typography>
                ) : (
                  recentDoctors.map((doc, idx) => (
                    <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'success.main' }}><LocalHospitalIcon /></Avatar>
                        <Box>
                          <Typography fontWeight={600}>{doc.name}</Typography>
                          <Typography color="text.secondary" fontSize={14}>{doc.specialization || 'Specialist'}</Typography>
                        </Box>
                        <Chip label={doc.status || 'pending'} color={doc.status === 'approved' ? 'success' : 'warning'} size="small" sx={{ ml: 'auto' }} />
                      </Stack>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <NotificationsActiveIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>Recent Patients</Typography>
                </Stack>
                {recentUsers.length === 0 ? (
                  <Typography color="text.secondary">No recent users found.</Typography>
                ) : (
                  recentUsers.map((user, idx) => (
                    <Box key={idx} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}><PeopleIcon /></Avatar>
                        <Box>
                          <Typography fontWeight={600}>{user.name}</Typography>
                          <Typography color="text.secondary" fontSize={14}>{user.email}</Typography>
                        </Box>
                        <Chip label={user.role} color={user.role === 'admin' ? 'info' : 'primary'} size="small" sx={{ ml: 'auto' }} />
                      </Stack>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
