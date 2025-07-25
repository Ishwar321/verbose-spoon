import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Avatar,
  Stack, CircularProgress, Divider, Alert, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import InfoIcon from '@mui/icons-material/Info';
import DoctorLayout from '../components/DoctorLayout';
import dayjs from 'dayjs';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/doctor/appointments', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
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

  const formatDateTime = (date, time) => {
    return dayjs(`${date}T${time}`).format('dddd, MMM D YYYY • h:mm A');
  };

  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(appt => appt.status === statusFilter);

  return (
    <DoctorLayout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h3" fontWeight={700} color="primary.main" align="center" gutterBottom>
          All Appointments
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={4}>
          View all your appointments. Use the filter to view by status.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={e => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredAppointments.length === 0 ? (
          <Typography align="center" color="text.secondary" mt={6}>No appointments found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredAppointments.map((appt, idx) => (
              <Grid item xs={12} sm={6} md={4} key={appt._id || idx}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 2,
                  minHeight: 210,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                        <EventAvailableIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={700}>{appt.userId?.name || 'Patient'}</Typography>
                        <Typography color="text.secondary" fontSize={14}>
                          {formatDateTime(appt.date, appt.time)}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography color="text.secondary" fontSize={14}>
                      Status: <b style={{ textTransform: 'capitalize' }}>{appt.status}</b>
                    </Typography>
                    <Typography color="text.secondary" fontSize={14}>
                      Mode: {appt.mode || 'N/A'}
                    </Typography>
                  </CardContent>
                  <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<InfoIcon />}
                    >
                      View Details
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

export default DoctorAppointments;
