export const AdminSidebarMenu = [
    {
        name: 'Home',
        path: '/admin',
        icon: 'fa-solid fa-house',
    },
    {
        name: 'Manage Patients',
        path: '/admin/users',
        icon: 'fa-solid fa-users',
    },
    {
        name: 'Manage Doctors',
        path: '/admin/doctors',
        icon: 'fa-solid fa-user-doctor',
    },
    {
        name: 'Appointments',
        path: '/admin/appointments',
        icon: 'fa-solid fa-calendar-check',
    },
    {
        name: 'Profile',
        path: '/profile',
        icon: 'fa-solid fa-user',
    },
    {
        name: 'Logout',
        path: 'logout',
        icon: 'fa-solid fa-right-from-bracket',
    },
];

// The 'Home' menu item should be highlighted for '/doctor', '/doctor/home', and '/doctor/home/' routes (see sidebar logic)
export const DoctorSidebarMenu = [
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

export const PatientSidebarMenu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa-solid fa-house',
    },
    {
        name: 'Appointments',
        path: '/appointments',
        icon: 'fa-solid fa-list',
    },
    {
        name: 'Apply Doctor',
        path: '/apply-doctor',
        icon: 'fa-solid fa-user-doctor',
    },
    {
        name: 'Profile',
        path: '/profile',
        icon: 'fa-solid fa-user',
    },
    {
        name: 'Logout',
        path: 'logout',
        icon: 'fa-solid fa-right-from-bracket',
    },
];

// Default export for backward compatibility
export const SidebarMenu = PatientSidebarMenu;