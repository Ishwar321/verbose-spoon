import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyDoctor from './pages/ApplyDoctor';
import NotificationPage from './pages/NotificationPage';
import Doctors from './pages/Doctors';
import Users from './pages/Users';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import DoctorHome from './pages/DoctorHome';
import DoctorProfilePage from './pages/DoctorProfilePage';
import DoctorUpcoming from './pages/DoctorUpcoming';
import DoctorApprove from './pages/DoctorApprove';
import DoctorHistory from './pages/DoctorHistory';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import DoctorRoute from './components/DoctorProtectedRoute';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import AdminAppointments from './pages/AdminAppointments';
import PatientDashboard from './pages/PatientDashboard';
import Appointments from './pages/Appointments';
import BookAppointmentPage from './pages/BookAppointmentPage'; // ✅ Updated import

function App() {
  const { loading } = useSelector(state => state.alerts);

  return (
    <>
      <BrowserRouter>
        {loading && <Spinner />}
        <Routes>
          <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
          <Route path="/profile/apply-doctor" element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
          <Route path="/appointments/apply-doctor" element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
          <Route path="/doctors" element={<AdminRoute><Doctors /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/booking/:doctorId" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} /> {/* ✅ Updated route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admin/doctors" element={<AdminRoute><Doctors /></AdminRoute>} />
          <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/doctor" element={<DoctorRoute><DoctorHome /></DoctorRoute>} />
          <Route path="/patient-dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/doctor/profile" element={<DoctorRoute><DoctorProfilePage /></DoctorRoute>} />
          <Route path="/doctor/upcoming-appointments" element={<DoctorRoute><DoctorUpcoming /></DoctorRoute>} />
          <Route path="/doctor/approve-appointments" element={<DoctorRoute><DoctorApprove /></DoctorRoute>} />
          <Route path="/doctor/appointment-history" element={<DoctorRoute><DoctorHistory /></DoctorRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
