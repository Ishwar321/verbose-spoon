import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Avatar, Stack, AppBar, Toolbar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import '../styles/LayoutStyles.css';

// The 'Home' menu item is highlighted for both '/doctor' and '/doctor/home' routes (see sidebar logic below)
const DoctorSidebarMenu = [
    {
        name: 'Home',
        path: '/doctor/home',
        icon: 'fa-solid fa-house',
    },
    {
        name: 'Upcoming',
        path: '/doctor/upcoming-appointments',
        icon: 'fa-solid fa-calendar-alt',
    },
    {
        name: 'Approve',
        path: '/doctor/approve-appointments',
        icon: 'fa-solid fa-clipboard-check',
    },
    {
        name: 'History',
        path: '/doctor/appointment-history',
        icon: 'fa-solid fa-history',
    },   
    {
        name: 'Profile',
        path: '/doctor/profile',
        icon: 'fa-solid fa-user',
    },
    {
        name: 'Logout',
        path: 'logout',
        icon: 'fa-solid fa-right-from-bracket',
    },
];

const DoctorLayout = ({ children }) => {
  const { user } = useSelector(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };
  return (
    <>
      <AppBar position="static" color="default" elevation={2} sx={{ mb: 3 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo192.png" alt="DocApp Logo" style={{ width: 40, marginRight: 12 }} />
            <Typography variant="h6" color="primary" fontWeight={700} sx={{ letterSpacing: 1 }}>
              DOC APPOINTMENT
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button color="inherit" onClick={() => navigate('/doctor/profile')} startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}><PersonIcon /></Avatar>} sx={{ textTransform: 'none', fontWeight: 500 }}>
              {user?.name || 'Profile'}
            </Button>
            <Button variant="contained" color="primary" onClick={handleLogout} sx={{ textTransform: 'none', fontWeight: 500 }}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <div className='main' style={{ minHeight: '100vh', background: '#f5f6fa' }}>
        <div className='layout' style={{ minHeight: '100vh' }}>
          <div className='sidebar'>
            <div className='logo'><h6>DOC APP</h6>
              <hr></hr>
            </div>
            <div className='menu'>
              {DoctorSidebarMenu.map(menu => {
                // Normalize path for Home and other menu items
                let isActive = false;
                if (menu.path === '/doctor/home') {
                  // Highlight Home for '/', '/doctor', '/doctor/home', '/doctor/home/'
                  isActive = ["/", "/doctor", "/doctor/home", "/doctor/home/"].includes(location.pathname);
                } else {
                  // Remove trailing slash for comparison
                  const currentPath = location.pathname.endsWith('/') && location.pathname.length > 1
                    ? location.pathname.slice(0, -1)
                    : location.pathname;
                  isActive = currentPath === menu.path;
                }
                if (menu.name === 'Logout') {
                  return (
                    <div className={`menu-item`} key={menu.path} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      <i className={`fa ${menu.icon}`}></i>
                      <span>Logout</span>
                    </div>
                  );
                }
                return (
                  <div className={`menu-item ${isActive ? "active" : ""}`} key={menu.path}>
                    <i className={`fa ${menu.icon}`}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='content' style={{ minHeight: '100vh', background: '#fff' }}>
            <div className='body'>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorLayout;