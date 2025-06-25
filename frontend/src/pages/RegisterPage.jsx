
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/register', {
        username,
        email,
        password,
        role,
      });

      alert('Registration successful! Please log in with your new credentials.');
      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-info">Join Us!</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="usernameInput" className="form-label">
                Username
              </label>
              <input
                id="usernameInput"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">
                Email
              </label>
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPasswordInput" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPasswordInput"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="roleSelect" className="form-label">
                Register as:
              </label>
              <select
                id="roleSelect"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-info w-100 mt-3"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-info text-decoration-none">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;