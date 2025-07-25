import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [authChecked, setAuthChecked] = useState(false); // ✅ local state

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/getUserData',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.removeItem("token");
      console.log(error);
    } finally {
      setAuthChecked(true); // ✅ always mark check complete
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    } else {
      setAuthChecked(true); // ✅ skip loading if user already exists
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const token = localStorage.getItem('token');

  if (!authChecked) {
    // Render nothing or a loading spinner while the authentication check is in progress.
    return null;
  }

  // After the check, if there's no token (it was invalid and removed) or no user data, redirect to login.
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Check if the authenticated user's role (from the server-verified Redux state) is allowed.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the homepage if the role is not authorized, which is better UX than logging out.
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
