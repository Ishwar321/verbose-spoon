import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../components/DoctorLayout';
import { Box, Typography, Card, CardContent, Grid, Avatar, Stack, CircularProgress, Divider, Alert } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import dayjs from 'dayjs';

const DoctorHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/v1/doctor/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const history = (res.data.appointments || []).filter(
            appt => ['completed', 'rejected', 'cancelled'].includes(appt.status)
          );
          setAppointments(history);
        } else {
          setError(res.data.message || 'Failed to fetch appointment history.');
        }
      } catch (err) {
        setError('Failed to load appointment history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <DoctorLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" align="center" gutterBottom>
          Appointment History
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" size={40} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
        ) : appointments.length === 0 ? (
          <Typography align="center" color="text.secondary" mt={6}>No past appointments.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {appointments.map((appt, idx) => (
              <Grid item xs={12} sm={6} md={4} key={appt._id || idx}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <EventAvailableIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600} color="primary.dark">
                        {appt.patientName || 'Patient'}
                      </Typography>
                      <Typography color="text.secondary" fontSize={15}>
                        {dayjs(`${appt.date}T${appt.time}`).format('dddd, MMM D, YYYY [at] h:mm A')}
                      </Typography>
                      <Typography color="text.secondary" fontSize={14}>
                        Reason: {appt.reason || 'N/A'}
                      </Typography>
                      <Typography color="text.secondary" fontSize={14} fontWeight={700}>
                        Status: {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </Typography>
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
};

export default DoctorHistory;
