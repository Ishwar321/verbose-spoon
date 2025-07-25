import React from 'react';
import "../styles/LayoutStyles.css";
import { SidebarMenu, AdminSidebarMenu, DoctorSidebarMenu, PatientSidebarMenu } from '../Data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Layout = ({ children }) => {
    const { user } = useSelector(state => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };
    const getSidebarMenu = () => {
        if (user?.role === 'admin') return AdminSidebarMenu;
        if (user?.role === 'doctor') return DoctorSidebarMenu;
        return PatientSidebarMenu;
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
                        <Button color="inherit" onClick={() => navigate('/profile')} startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}><PersonIcon /></Avatar>} sx={{ textTransform: 'none', fontWeight: 500 }}>
                            {user?.name || 'Profile'}
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ textTransform: 'none', fontWeight: 500 }}>
                            Logout
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            <div className='main'>
                <div className='layout'>
                    <div className='sidebar'>
                        <div className='logo'><h6>DOC APP</h6>
                            <hr></hr>
                        </div>
                        <div className='menu'>
                            {getSidebarMenu().map(menu => {
                                const isActive = location.pathname === menu.path;
                                if (menu.name === 'Logout') {
                                    return (
                                        <div className={`menu-item`} key={menu.path} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                            <i className={menu.icon}></i>
                                            <span>Logout</span>
                                        </div>
                                    );
                                }
                                return (
                                    <div className={`menu-item ${isActive && "active"}`} key={menu.path}>
                                        <i className={menu.icon}></i>
                                        <Link to={menu.path}>{menu.name}</Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='content'>
                        <div className='body'>{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
