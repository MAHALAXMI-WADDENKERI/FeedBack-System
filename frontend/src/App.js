
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useEffect, useState } from 'react';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { jwtDecode } from "jwt-decode";
import Dashboard from './pages/Dashboard';
import FeedbackDetail from './pages/FeedbackDetail';
import './index.css'; 
import axios from 'axios';
import EmployeeFeedbackList from './pages/EmployeeFeedbackList';

axios.defaults.baseURL = 'http://localhost:8080';
function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
    return <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light fs-4">Loading application...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          user ? (
            user.role === 'manager' ? (
              <Navigate to="/manager-dashboard" />
            ) : (
              <Navigate to="/employee-dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["manager", "employee"]}>
            <Dashboard user={user} />
          </ProtectedRoute>
        } />

        <Route path="/manager-dashboard" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/employee-dashboard" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />

        <Route path="/feedback/:feedbackId" element={
          <ProtectedRoute allowedRoles={["manager", "employee"]}>
            <FeedbackDetail />
          </ProtectedRoute>
        } />


        <Route path="/feedback/employee/:employeeId" element={
          <ProtectedRoute allowedRoles={["manager", "employee"]}>
            <EmployeeFeedbackList />
          </ProtectedRoute>
        } />

        
        <Route path="*" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;