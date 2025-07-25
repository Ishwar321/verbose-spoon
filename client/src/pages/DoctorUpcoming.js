import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../components/DoctorLayout';
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Stack, CircularProgress, Divider, Alert, Chip, Button
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import dayjs from 'dayjs';

const DoctorUpcoming = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpcoming = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/v1/doctor/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const upcoming = (res.data.appointments || []).filter(appt => appt.status === 'accepted' && dayjs(`${appt.date}T${appt.time}`).isAfter(dayjs()));
        setAppointments(upcoming);
      } else {
        setError(res.data.message || 'Failed to fetch upcoming appointments.');
      }
    } catch (err) {
      setError('Failed to load upcoming appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const updateAppointmentStatus = async (id, status) => {
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`/api/v1/doctor/updateAppointment/${id}`,
        { status },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setAppointments(prev => prev.filter(appt => appt._id !== id));
      } else {
        alert(res.data.message || 'Failed to update appointment status.');
      }
    } catch (err) {
      alert('Error while updating status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <DoctorLayout>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h3" fontWeight={800} color="primary.main" align="center" gutterBottom>
          Upcoming Appointments
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={4}>
          All approved appointments that are scheduled for the future are shown here. Stay updated with your upcoming visits.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" size={44} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
        ) : appointments.length === 0 ? (
          <Typography align="center" color="text.secondary" mt={6}>No upcoming appointments.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {appointments.map((appt, idx) => (
              <Grid item xs={12} sm={6} md={4} key={appt._id || idx}>
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  p: 2,
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 8, transform: 'translateY(-4px) scale(1.02)' },
                }}>
                  <CardContent>
                    <Stack spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', width: 54, height: 54, fontSize: 22 }}>
                        {appt.patientName ? appt.patientName[0] : <PersonOutlineIcon />}
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} color="primary.dark">
                        {appt.patientName || 'Patient'}
                      </Typography>
                      <Typography color="text.secondary" fontSize={15}>
                        {dayjs(`${appt.date}T${appt.time}`).format('dddd, MMM D, YYYY [at] h:mm A')}
                      </Typography>
                      <Typography color="text.secondary" fontSize={14}>
                        Mode: {appt.mode || 'N/A'}
                      </Typography>
                      {appt.reason && (
                        <Typography color="text.secondary" fontSize={14}>
                          Reason: {appt.reason}
                        </Typography>
                      )}
                      <Chip label="Approved" color="success" sx={{ fontWeight: 600, fontSize: 15, mt: 1 }} />
                      <Stack direction="row" spacing={2} mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={actionLoadingId === appt._id}
                          onClick={() => updateAppointmentStatus(appt._id, 'completed')}
                          sx={{ fontWeight: 600, minWidth: 110 }}
                        >
                          {actionLoadingId === appt._id ? 'Marking...' : 'Mark Complete'}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={actionLoadingId === appt._id}
                          onClick={() => updateAppointmentStatus(appt._id, 'cancelled')}
                          sx={{ fontWeight: 600, minWidth: 110 }}
                        >
                          {actionLoadingId === appt._id ? 'Cancelling...' : 'Cancel'}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DoctorLayout>

  );
}

export default DoctorUpcoming;
