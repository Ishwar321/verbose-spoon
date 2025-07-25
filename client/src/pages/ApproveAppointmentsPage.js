import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DoctorLayout from '../components/DoctorLayout'; // Adjust path based on your setup
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Stack,
  CircularProgress, Divider, Alert, Button
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // Used for generic appointment icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // For Approve button
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // For Reject button
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // For patient avatar
import dayjs from 'dayjs'; // For date/time handling

const ApproveAppointmentsPage = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null); // To show loading state on specific buttons

  const fetchPendingAppointments = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const res = await axios.get('/api/v1/doctor/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // Filter appointments where status is 'pending'
        const filteredAppts = (res.data.appointments || []).filter(appt => appt.status === 'pending')
                                                           .sort((a,b) => dayjs(`${a.date}T${a.time}`).diff(dayjs(`${b.date}T${b.time}`))); // Sort by date/time
        setPendingAppointments(filteredAppts);
      } else {
        setError(res.data.message || 'Failed to fetch pending appointments.');
      }
    } catch (err) {
      console.error('Error fetching pending appointments:', err);
      setError('Failed to load pending appointments. Please check your network or try again.');
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        localStorage.clear();
        // You might want to navigate to login page here if needed
        // navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingAppointments();
  }, [fetchPendingAppointments]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setActionLoadingId(appointmentId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `/api/v1/doctor/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Remove the appointment from the list after successful update
        setPendingAppointments(prevAppts =>
          prevAppts.filter(appt => appt._id !== appointmentId)
        );
        // Optionally show a success message
        // alert(`Appointment ${appointmentId} ${newStatus} successfully!`);
      } else {
        alert(res.data.message || `Failed to ${newStatus} appointment.`);
      }
    } catch (err) {
      console.error(`Error updating appointment status to ${newStatus}:`, err);
      alert(`Error while trying to ${newStatus} appointment.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatAppointmentDateTime = (date, time) => {
    if (!date || !time) return 'N/A';
    const dt = dayjs(`${date}T${time}`);
    return dt.isValid() ? dt.format('dddd, MMMM D, YYYY [at] h:mm A') : 'Invalid Date/Time';
  };

  return (
    <DoctorLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} color="primary.main" align="center" gutterBottom>
          Approve New Appointments
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" mb={4}>
          Review and decide on incoming appointment requests from patients.
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
        ) : pendingAppointments.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6, p: 3 }}>
            <Avatar sx={{ bgcolor: 'success.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <CheckCircleOutlineIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>No pending appointment requests.</Typography>
            <Typography variant="body1" color="text.secondary">
              All caught up! There are no new appointments awaiting your approval.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {pendingAppointments.map((appt) => (
              <Grid item xs={12} sm={6} md={4} key={appt._id}>
                <Card sx={{
                  borderRadius: 3, boxShadow: 3, p: 2, minHeight: 220,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'transform 0.2s ease-in-out', '&:hover': { boxShadow: 6 }
                }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        <PersonOutlineIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700} variant="h6">{appt.patientName || 'Patient'}</Typography> {/* Using patientName from backend */}
                        <Typography color="text.secondary" fontSize={14}>{appt.patientEmail || 'N/A'}</Typography> {/* Using patientEmail from backend */}
                      </Box>
                    </Stack>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.primary" mb={0.5}>
                      Date & Time: {formatAppointmentDateTime(appt.date, appt.time)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mode: {appt.mode || 'N/A'}
                    </Typography>
                  </CardContent>
                  <Stack direction="row" spacing={1} justifyContent="center" mt={2} mb={1}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={() => handleStatusUpdate(appt._id, 'approved')}
                      disabled={actionLoadingId === appt._id}
                    >
                      {actionLoadingId === appt._id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<CancelOutlinedIcon />}
                      onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                      disabled={actionLoadingId === appt._id}
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
};

export default ApproveAppointmentsPage;