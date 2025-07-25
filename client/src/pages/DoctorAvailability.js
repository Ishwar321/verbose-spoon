import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Stack, Divider, Button, TextField, Alert } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DoctorLayout from '../components/DoctorLayout';

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch('/api/v1/doctor/availability', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        });
        if (res.ok) {
          const data = await res.json();
          setAvailability(data.availability || []);
        }
      } catch {}
    };
    fetchAvailability();
  }, []);

  const handleAdd = async () => {
    if (!date || !time) {
      setError('Please enter both date and time.');
      setSuccess('');
      return;
    }
    const newAvailability = [...availability, { date, time }];
    setAvailability(newAvailability);
    setDate('');
    setTime('');
    setSuccess('Availability slot added!');
    setError('');
    // Save to backend
    await fetch('/api/v1/doctor/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ availability: newAvailability }),
    });
  };

  return (
    <DoctorLayout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h3" fontWeight={700} color="primary.main" align="center" gutterBottom>
          My Availability
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={4}>
          Set and view your available slots for appointments. Add new slots below.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button variant="contained" color="primary" onClick={handleAdd} sx={{ minWidth: 120 }}>
            Add Slot
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {availability.length === 0 ? (
          <Typography align="center" color="text.secondary" mt={6}>No availability set.</Typography>
        ) : (
          <Grid container spacing={3}>
            {availability.map((slot, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}><CalendarMonthIcon /></Avatar>
                      <Box>
                        <Typography fontWeight={700}>{slot.date}</Typography>
                        <Typography color="text.secondary" fontSize={14}>{slot.time}</Typography>
                      </Box>
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

export default DoctorAvailability;
