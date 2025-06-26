
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!user || !user.id || !token) {
        setError('User not logged in or user ID missing.');
        setLoading(false);
        return;
      }

      setUserId(user.id); 

      try {
        const response = await axios.get('http://localhost:8080/feedback/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackList(response.data);
      } catch (err) {
        console.error('Error fetching feedback for employee dashboard:', err);
        let errorMessage = 'Failed to load feedback. Please try again later.';
        if (err.response) {
          if (err.response.status === 403) {
            errorMessage = 'You are not authorized to view this content.';
          } else if (err.response.data && err.response.data.detail) {
            errorMessage = err.response.data.detail;
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback(); 
  }, []); 

  if (loading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light fs-4">Loading feedback...</div>;
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-danger-subtle p-4 text-danger">
        <p className="fs-4 fw-semibold mb-4">Error: {error}</p>
        <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light p-4 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4 fw-bold text-dark">Employee Dashboard</h1>
        <LogoutButton className="btn btn-outline-secondary" />
      </div>

      <h2 className="h4 mb-4 pb-2 border-bottom text-dark">Feedback Received for Employee ID: {userId}</h2>

      {feedbackList.length === 0 ? (
        <p className="text-muted fst-italic text-center fs-5">No feedback received yet.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="col">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-dark mb-2">
                    <strong>From:</strong> Manager #{fb.manager_id}
                  </h5>
                  <p className="card-text text-muted mb-3">
                    <strong>Message:</strong> {fb.message.substring(0, 150)}{fb.message.length > 150 ? '...' : ''}
                  </p>
                  <div className="mt-3">
                    <span
                      className={`badge ${
                        fb.sentiment === 'positive'
                          ? 'bg-success'
                          : fb.sentiment === 'negative'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      Sentiment: {fb.sentiment ? fb.sentiment.charAt(0).toUpperCase() + fb.sentiment.slice(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(fb.tags || []).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/feedback/${fb.id}`}
                    className="btn btn-primary btn-sm mt-4"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-5">
        <Link
          to="/dashboard"
          className="btn btn-secondary"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}