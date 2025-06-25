import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get("http://localhost:8080/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsValid(true);
      } catch (err) {
        console.error("Token verification failed", err);
        setIsValid(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) return <div>Loading...</div>;

  if (!isValid || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isManagerRoute = location.pathname.startsWith('/manager-dashboard');
  const isEmployeeRoute = location.pathname.startsWith('/employee-dashboard');

  if (isManagerRoute && user.role !== 'manager') {
    return <Navigate to="/employee-dashboard" replace />;
  }

  if (isEmployeeRoute && user.role !== 'employee') {
    return <Navigate to="/manager-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
