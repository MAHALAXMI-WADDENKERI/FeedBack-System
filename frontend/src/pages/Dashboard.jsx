
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function Dashboard({ user }) {
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-lg p-5 text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title display-5 fw-bold mb-4 text-dark">Welcome, {user?.username || user?.name}!</h2>
          <p className="card-text fs-5 mb-5 text-muted">You are logged in as a <span className="fw-bold text-capitalize text-primary">{role}</span>.</p>

          {role === 'manager' && (
            <div className="mb-4 p-4 bg-primary-subtle border border-primary-subtle rounded-3">
              <p className="text-dark mb-3 fs-5">
                As a manager, you can oversee employee feedback, assign tasks, and monitor team performance.
              </p>
              <Link
                to="/manager-dashboard"
                className="btn btn-primary btn-lg"
              >
                Go to Manager Dashboard
              </Link>
            </div>
          )}

          {role === 'employee' && (
            <div className="mb-4 p-4 bg-info-subtle border border-info-subtle rounded-3">
              <p className="text-dark mb-3 fs-5">
                As an employee, you can view the feedback received for your work and track your growth.
              </p>
              <Link
                to="/employee-dashboard"
                className="btn btn-info btn-lg"
              >
                Go to Employee Dashboard
              </Link>
            </div>
          )}

          <div className="mt-5">
            <LogoutButton className="btn btn-outline-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}