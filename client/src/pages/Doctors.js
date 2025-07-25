import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Box, Typography, Card, CardContent, Grid, Avatar, Stack, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, InputAdornment } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', specialization: '', experience: '', password: '' });
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [search, setSearch] = useState('');
  // Booking states removed for admin: only deleting is allowed
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ _id: '', name: '', email: '', specialization: '', experience: '' });
  const [editing, setEditing] = useState(false);
  const handleEditOpen = (doc) => {
    setEditForm({ ...doc });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditForm({ _id: '', name: '', email: '', specialization: '', experience: '' });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleUpdateDoctor = async () => {
    setEditing(true);
    try {
      await axios.put(`/api/v1/admin/updateDoctor/${editForm._id}`, editForm, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      handleEditClose();
      getDoctors();
    } catch (error) {
      // handle error
    } finally {
      setEditing(false);
    }
  };

  const getDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/admin/getAllDoctors', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setDoctors(res.data.doctors || []);
    } catch (error) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setForm({ name: '', email: '', specialization: '', experience: '', password: '' }); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddDoctor = async () => {
    setAdding(true);
    try {
      await axios.post('/api/v1/admin/addDoctor', form, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      handleClose();
      getDoctors();
    } catch (error) {
      // handle error
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveDoctor = async (id) => {
    setRemovingId(id);
    try {
      await axios.delete(`/api/v1/admin/removeDoctor/${id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      getDoctors();
    } catch (error) {
      // handle error
    } finally {
      setRemovingId(null);
    }
  };

  // Booking logic removed for admin

  // Booking dialog close logic removed for admin

  // Booking appointment logic removed for admin

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.email.toLowerCase().includes(search.toLowerCase()) ||
    (doc.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" mb={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight={700} color="primary.main" align="center" gutterBottom>
              Manage Doctors
            </Typography>
            <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 2 }}>
              View and manage all registered doctors in the system
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or specialization"
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
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{ height: 48, minWidth: 160 }}
              >
                Add Doctor
              </Button>
            </Stack>
          </Box>
        </Stack>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredDoctors.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Avatar sx={{ bgcolor: 'grey.200', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <LocalHospitalIcon sx={{ color: 'grey.500', fontSize: 48 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>No doctors found.</Typography>
            <Typography variant="body1" color="text.secondary">
              No doctors match your search. Try a different name, email, or specialization.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {filteredDoctors.map((doc, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <Card sx={{ minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' } }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 70, height: 70, mb: 2 }}>
                    <LocalHospitalIcon fontSize="large" />
                  </Avatar>
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600}>{doc.name || 'Dr. John Doe'}</Typography>
                    <Typography color="text.secondary" fontSize={15}>{doc.specialization || 'Specialist'}</Typography>
                    <Typography color="text.secondary" fontSize={14} mt={1}>Experience: {doc.experience || 0} years</Typography>
                    <Typography color="text.secondary" fontSize={14} mt={1}>Email: {doc.email}</Typography>
                  </CardContent>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, width: '100%' }} justifyContent="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditNoteIcon />}
                      onClick={() => handleEditOpen(doc)}
                      sx={{ ml: 1, textTransform: 'none', fontWeight: 500 }}
                    >
                      Update Credentials
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveDoctor(doc._id)}
                      disabled={removingId === doc._id}
                      sx={{ ml: 1, textTransform: 'none', fontWeight: 500 }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
            {/* Edit Doctor Dialog moved outside the map to prevent blackout */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
              <DialogTitle>Edit Doctor Credentials</DialogTitle>
              <DialogContent>
                <Stack spacing={2} mt={1}>
                  <TextField label="Name" name="name" value={editForm.name} onChange={handleEditChange} fullWidth required />
                  <TextField label="Email" name="email" value={editForm.email} onChange={handleEditChange} fullWidth required type="email" />
                  <TextField label="Specialization" name="specialization" value={editForm.specialization} onChange={handleEditChange} fullWidth required />
                  <TextField label="Experience (years)" name="experience" value={editForm.experience} onChange={handleEditChange} fullWidth required type="number" />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditClose} color="secondary">Cancel</Button>
                <Button onClick={handleUpdateDoctor} color="primary" variant="contained" disabled={editing}>
                  {editing ? 'Updating...' : 'Update'}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        )}
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required type="email" />
              <TextField label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} fullWidth required />
              <TextField label="Experience (years)" name="experience" value={form.experience} onChange={handleChange} fullWidth required type="number" />
              <TextField label="Set Password" name="password" value={form.password} onChange={handleChange} fullWidth required type="password" autoComplete="new-password" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleAddDoctor} color="primary" variant="contained" disabled={adding}>
              {adding ? 'Adding...' : 'Add Doctor'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Booking dialog removed for admin */}
      </Box>
    </Layout>
  );
};

export default Doctors;
