import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientAppointments.css'; // Create a CSS file for styling

const PatientAppointments = () => {
 const [pendingAppointments, setPendingAppointments] = useState([]);
 const [upcomingAppointments, setUpcomingAppointments] = useState([]);
 const [historyAppointments, setHistoryAppointments] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchAppointments = async () => {
 try {
 setLoading(true);
 const res = await axios.get('/api/v1/user/appointments', { // Assuming this endpoint returns all appointments for the user
 headers: {
 Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your actual token retrieval method
 },
 });

 const appointments = res.data.appointments || [];

 // Separate appointments into pending, upcoming, and history
 setPendingAppointments(appointments.filter(appointment => appointment.status === 'pending'));
 setUpcomingAppointments(appointments.filter(appointment => appointment.status === 'accepted'));
 setHistoryAppointments(appointments.filter(appointment => ['completed', 'rejected', 'cancelled'].includes(appointment.status)));
 } catch (error) {
 console.error('Error fetching appointments:', error);
 // Handle error appropriately (e.g., display an error message)
 } finally {
 setLoading(false);
 }
 };

 fetchAppointments();
 }, []);

 return (
 <div className="patient-appointments-container">
 <h2>My Appointments</h2>
 {loading ? (
 <p>Loading appointments...</p>
 ) : (
 <>

 <div className="appointments-section">
   <h3>Pending Appointments</h3>
   {pendingAppointments.length === 0 ? (
     <p>No pending appointments.</p>
   ) : (
     <ul className="appointments-list">
       {pendingAppointments.map(appointment => (
         <li key={appointment._id} className="appointment-item">
           <p><strong>Doctor:</strong> {appointment.doctorName}</p>
           <p><strong>Date:</strong> {appointment.date}</p>
           <p><strong>Time:</strong> {appointment.time}</p>
           <p><strong>Status:</strong> Pending</p>
         </li>
       ))}
     </ul>
   )}
 </div>

 <div className="appointments-section">
   <h3>Upcoming Appointments</h3>
   {upcomingAppointments.length === 0 ? (
     <p>No upcoming appointments.</p>
   ) : (
     <ul className="appointments-list">
       {upcomingAppointments.map(appointment => (
         <li key={appointment._id} className="appointment-item">
           <p><strong>Doctor:</strong> {appointment.doctorName}</p>
           <p><strong>Date:</strong> {appointment.date}</p>
           <p><strong>Time:</strong> {appointment.time}</p>
           <p><strong>Status:</strong> Upcoming</p>
         </li>
       ))}
     </ul>
   )}
 </div>

 <div className="appointments-section">
   <h3>Appointment History</h3>
   {historyAppointments.length === 0 ? (
     <p>No past appointments.</p>
   ) : (
     <ul className="appointments-list">
       {historyAppointments.map(appointment => (
         <li key={appointment._id} className="appointment-item">
           <p><strong>Doctor:</strong> {appointment.doctorName}</p>
           <p><strong>Date:</strong> {appointment.date}</p>
           <p><strong>Time:</strong> {appointment.time}</p>
           <p><strong>Status:</strong> {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
         </li>
       ))}
     </ul>
   )}
 </div>
 </>
 )}
 </div>
 );
};

export default PatientAppointments;