import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const NotificationPage = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Notifications
      </Typography>
      <Alert severity="info">No new notifications.</Alert>
    </Box>
  );
};

export default NotificationPage;
