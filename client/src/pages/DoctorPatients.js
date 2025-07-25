import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Stack, CircularProgress, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DoctorLayout from '../components/DoctorLayout';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/doctor/patients', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        });
        if (res.ok) {
          const data = await res.json();
          setPatients(data.patients || []);
        } else {
          setPatients([]);
        }
      } catch {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <DoctorLayout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h3" fontWeight={700} color="primary.main" align="center" gutterBottom>
          My Patients
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" mb={4}>
          View and manage all your patients here. Click a patient for more details.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : patients.length === 0 ? (
          <Typography align="center" color="text.secondary" mt={6}>No patients found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {patients.map((patient, idx) => (
              <Grid item xs={12} sm={6} md={4} key={patient._id || idx}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}><PersonIcon /></Avatar>
                      <Box>
                        <Typography fontWeight={700}>{patient.name || 'Patient'}</Typography>
                        <Typography color="text.secondary" fontSize={14}>{patient.email}</Typography>
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

export default DoctorPatients;
