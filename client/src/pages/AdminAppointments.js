import React from 'react';
import Layout from '../components/Layout';
import { Box, Typography, Stack, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AdminAppointmentsList from '../components/AdminAppointmentsList';

const AdminAppointments = () => {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];
  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" mb={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" align="center" fontWeight={700} color="primary.main" gutterBottom>
              All Appointments
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 2 }}>
              View and manage all appointments in the system
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search by doctor, patient, or date"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
                sx={{ maxWidth: 400 }}
              />
              <Stack direction="row" spacing={1}>
                {statusOptions.map(opt => (
                  <Button
                    key={opt.value}
                    variant={status === opt.value ? "contained" : "outlined"}
                    color={opt.value === "approved" ? "success" : opt.value === "pending" ? "warning" : opt.value === "rejected" ? "error" : "primary"}
                    onClick={() => setStatus(opt.value)}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <AdminAppointmentsList search={search} status={status} />
      </Box>
    </Layout>
  );
};

export default AdminAppointments;
