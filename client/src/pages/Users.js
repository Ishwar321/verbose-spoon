import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Box, Typography, Card, CardContent, Grid, Avatar, Stack, CircularProgress, TextField, InputAdornment, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [rawResponse, setRawResponse] = useState(null); // For debugging
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ _id: '', name: '', email: '' });
  const [editing, setEditing] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '' });
  const [adding, setAdding] = useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => { setAddOpen(false); setAddForm({ name: '', email: '', password: '' }); };
  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddPatient = async () => {
    setAdding(true);
    try {
      await axios.post('/api/v1/admin/addPatient', addForm, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      handleAddClose();
      getUsers();
    } catch (error) {
      // handle error
    } finally {
      setAdding(false);
    }
  };
  const handleEditOpen = (user) => {
    setEditForm({ ...user });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditForm({ _id: '', name: '', email: '' });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleUpdateUser = async () => {
    setEditing(true);
    try {
      await axios.put(`/api/v1/admin/updateUser/${editForm._id}`, editForm, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      handleEditClose();
      getUsers();
    } catch (error) {
      // handle error
    } finally {
      setEditing(false);
    }
  };

  // Filter users based on search input
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch users from API
  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/admin/getAllUsers', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setRawResponse(res.data); // Save raw response for debug
      // Support .data, .patients, or .users for robustness
      if (Array.isArray(res.data?.data)) {
        setUsers(res.data.data);
      } else if (Array.isArray(res.data?.patients)) {
        setUsers(res.data.patients);
      } else if (Array.isArray(res.data?.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
      setRawResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Remove user handler
  const handleRemoveUser = async (id) => {
    setRemovingId(id);
    try {
      await axios.delete(`/api/v1/admin/deleteUser/${id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      getUsers();
    } catch (error) {
      // handle error
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Stack spacing={2} alignItems="center" mb={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" fontWeight={700} color="primary.main" align="center" gutterBottom>
              Manage Patients
            </Typography>
            <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 2 }}>
              View and manage all registered patients in the system
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search by name or email"
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
                onClick={handleAddOpen}
                sx={{ height: 48, minWidth: 160 }}
              >
                Add Patient
              </Button>
            </Stack>
          </Box>
        </Stack>
        {/* Add Patient Dialog */}
        <Dialog open={addOpen} onClose={handleAddClose} maxWidth="xs" fullWidth>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="Name" name="name" value={addForm.name} onChange={handleAddChange} fullWidth required />
              <TextField label="Email" name="email" value={addForm.email} onChange={handleAddChange} fullWidth required type="email" />
              <TextField label="Set Password" name="password" value={addForm.password} onChange={handleAddChange} fullWidth required type="password" autoComplete="new-password" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} color="secondary">Cancel</Button>
            <Button onClick={handleAddPatient} color="primary" variant="contained" disabled={adding}>
              {adding ? 'Adding...' : 'Add Patient'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Patient Dialog */}
        <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
          <DialogTitle>Update Patient Info</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="Name" name="name" value={editForm.name} onChange={handleEditChange} fullWidth required />
              <TextField label="Email" name="email" value={editForm.email} onChange={handleEditChange} fullWidth required type="email" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">Cancel</Button>
            <Button onClick={handleUpdateUser} color="primary" variant="contained" disabled={editing}>
              {editing ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Removed duplicate search bar below Add Patient dialog */}
        {/* ...existing code... */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Avatar sx={{ bgcolor: 'grey.200', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <PersonIcon sx={{ color: 'grey.500', fontSize: 48 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>No patients found.</Typography>
            <Typography variant="body1" color="text.secondary">
              No patients match your search. Try a different name or email.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {filteredUsers.map((user, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user._id || idx}>
                <Card sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 8, transform: 'translateY(-4px)' } }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mb: 2 }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600}>{user.name || 'No Name'}</Typography>
                    <Typography color="text.secondary" fontSize={15}>{user.email || 'No Email'}</Typography>
                  </CardContent>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, width: '100%' }} justifyContent="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditNoteIcon />}
                      onClick={() => handleEditOpen(user)}
                      sx={{ ml: 1, textTransform: 'none', fontWeight: 500 }}
                    >
                      Update Info
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveUser(user._id)}
                      disabled={removingId === user._id}
                      sx={{ ml: 1, textTransform: 'none', fontWeight: 500 }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
    </Box>
  </Layout>
  );
};
export default Users;
