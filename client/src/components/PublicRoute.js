import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    // If a user is logged in, redirect them to the homepage.
    // The main app layout will handle directing them to the correct dashboard.
    return <Navigate to="/" />;
  }
  return children;
};

export default PublicRoute;
