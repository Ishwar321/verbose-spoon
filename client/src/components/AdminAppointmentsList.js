import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, Avatar, Stack, Chip, CircularProgress, Divider } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';

const AdminAppointmentsList = ({ search = '', status = 'all' }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/admin/getAllAppointments', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setAppointments(res.data.appointments || []);
    } catch (error) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // Filter appointments by search and status
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch =
      appt.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      appt.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      appt.date?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || (appt.status && appt.status.toLowerCase() === status);
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <Divider sx={{ mb: 3 }} />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>No appointments found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredAppointments.map((appt, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, minHeight: 220 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}><EventNoteIcon /></Avatar>
                    <Box>
                      <Typography fontWeight={600} fontSize={18}>
                        {appt.doctorName || 'Doctor'}
                      </Typography>
                      <Typography color="text.secondary" fontSize={14}>
                        {appt.specialization || 'Specialization'}
                      </Typography>
                    </Box>
                    <Chip label={appt.status || 'pending'} color={
                      appt.status === 'approved' ? 'success' : appt.status === 'rejected' ? 'error' : 'warning'
                    } size="small" sx={{ ml: 'auto' }} />
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}><PersonIcon /></Avatar>
                    <Typography fontWeight={500}>{appt.patientName || 'Patient'}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}><LocalHospitalIcon /></Avatar>
                    <Typography fontWeight={500}>Date: {appt.date || '-'}</Typography>
                    <Typography fontWeight={500}>Time: {appt.time || '-'}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminAppointmentsList;
