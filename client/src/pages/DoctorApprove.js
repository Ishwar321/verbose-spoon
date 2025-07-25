import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Avatar,
  Stack, CircularProgress, Divider, Button, Alert, Chip
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import DoctorLayout from '../components/DoctorLayout';
import dayjs from 'dayjs';

const DoctorApprove = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/doctor/appointments', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments((data.appointments || []).filter(appt => appt.status === 'pending'));
      } else {
        setError('Failed to load appointments.');
      }
    } catch {
      setError('Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (id, status) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/v1/doctor/updateAppointment/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      } else {
        alert('Failed to update appointment status.');
      }
    } catch (err) {
      alert('Error while updating status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = (id) => updateAppointmentStatus(id, 'accepted');
  const handleReject = (id) => updateAppointmentStatus(id, 'rejected');

  const formatDateTime = (date, time) => {
    return dayjs(`${date}T${time}`).format('dddd, MMM D YYYY • h:mm A');
  };

  return (
    <DoctorLayout>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h3" fontWeight={800} color="primary.main" align="center" gutterBottom>
          Pending Appointment Requests
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={4}>
          Review and approve or reject appointment requests from patients. Only pending requests are shown here.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" size={44} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
        ) : appointments.length === 0 ? (
          <Typography align="center" color="text.secondary" mt={6}>No pending requests found.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {appointments.map((appt, idx) => (
              <Grid item xs={12} sm={6} md={4} key={appt._id || idx}>
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  p: 2,
                  minHeight: 240,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 8, transform: 'translateY(-4px) scale(1.02)' },
                }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'info.main', width: 54, height: 54, fontSize: 22 }}>
                        {appt.userId?.name ? appt.userId.name[0] : <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700} color="primary.main" fontSize={18}>{appt.userId?.name || 'Patient'}</Typography>
                        <Typography color="text.secondary" fontSize={15}>
                          {formatDateTime(appt.date, appt.time)}
                        </Typography>
                        <Typography color="text.secondary" fontSize={14}>
                          Mode: {appt.mode || 'N/A'}
                        </Typography>
                        {appt.reason && (
                          <Typography color="text.secondary" fontSize={14}>
                            Reason: {appt.reason}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} mb={2}>
                      <Chip label="Pending" color="warning" sx={{ fontWeight: 600, fontSize: 15 }} />
                    </Stack>
                  </CardContent>
                  <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
                    <Button
                      variant="contained"
                      color="success"
                      size="medium"
                      startIcon={<CheckIcon />}
                      onClick={() => handleApprove(appt._id)}
                      disabled={actionLoadingId === appt._id}
                      sx={{ fontWeight: 600 }}
                    >
                      {actionLoadingId === appt._id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="medium"
                      startIcon={<ClearIcon />}
                      onClick={() => handleReject(appt._id)}
                      disabled={actionLoadingId === appt._id}
                      sx={{ fontWeight: 600 }}
                    >
                      {actionLoadingId === appt._id ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DoctorLayout>

  );
}

export default DoctorApprove;
