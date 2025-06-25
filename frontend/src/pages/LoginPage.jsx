
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8080/login', {
         username: username,
         password: password
      });
      const { access_token, user } = res.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'manager') {
        navigate('/manager-dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
      console.error("Login error:", error);

    let errorMessage = "Login failed: Unexpected error";
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail
            .map(err => err.msg)
            .join('; ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else {
          errorMessage = JSON.stringify(error.response.data.detail);
        }
      } else {
        errorMessage = `Login failed: ${error.response.status} ${error.response.statusText}`;
      }
    } else if (error.request) {
      errorMessage = "Login failed: No response from server. Please check if the backend is running.";
    } else {
      errorMessage = error.message;
    }
    
    setError(errorMessage); 
  }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-primary">Welcome Back!</h2>
          <form onSubmit={handleLogin}>
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;