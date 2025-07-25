import React from 'react';
import DoctorLayout from '../components/DoctorLayout'; // Adjust path based on your setup

const AppointmentHistoryPage = () => {
  return (
    <DoctorLayout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Appointment History</h2>
        <p>This page will show all your past appointments.</p>
      </div>
    </DoctorLayout>
  );
};
export default AppointmentHistoryPage;