import React from 'react';
import Layout from '../components/Layout';
import { Typography, Box, Stack, Grid, Card } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const HomePage = () => {
  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 900, mx: 'auto', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ mt: 8 }}>
          <LocalHospitalIcon color="primary" sx={{ fontSize: 56 }} />  {/* Reduced from 80 to 56 */}
          <Typography variant="h3" align="center" fontWeight={700} color="primary.main" gutterBottom>
            Doctor Appointment System
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary">
            Book, manage, and track your doctor appointments with ease.
          </Typography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={5}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': { boxShadow: 8, transform: 'scale(1.03)', bgcolor: 'primary.light', color: 'primary.contrastText' },
                }}
                onClick={() => window.location.href = '/apply-doctor'}
              >
                <Stack alignItems="center" spacing={1}>
                  <LocalHospitalIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h6" fontWeight={600}>Find Doctors</Typography>
                  <Typography color="text.secondary">Browse and book appointments with top doctors</Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': { boxShadow: 8, transform: 'scale(1.03)', bgcolor: 'success.light', color: 'success.contrastText' },
                }}
                onClick={() => window.location.href = '/appointments'}
              >
                <Stack alignItems="center" spacing={1}>
                  <LocalHospitalIcon color="success" sx={{ fontSize: 48 }} />
                  <Typography variant="h6" fontWeight={600}>My Appointments</Typography>
                  <Typography color="text.secondary">See all your upcoming and past appointments</Typography>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Layout>
  );
};

export default HomePage;