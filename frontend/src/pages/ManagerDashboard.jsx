
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import FeedbackForm from '../components/FeedbackForm';

export default function ManagerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedbackFormFor, setShowFeedbackFormFor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        const employeesRes = await axios.get('http://localhost:8080/feedback/users/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employeesRes.data);

        const feedbackRes = await axios.get('http://localhost:8080/feedback/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackList(feedbackRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching manager data:', err);
        let displayErrorMessage = 'Failed to fetch data. Please try again.';
        if (err.response && err.response.status === 403) {
          displayErrorMessage = 'You do not have permission to view this page. (Managers only)';
        } else if (err.response && err.response.data && err.response.data.detail) {
          displayErrorMessage = err.response.data.detail;
        }
        setError(displayErrorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFeedbackSubmitted = () => {
    setShowFeedbackFormFor(null);
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/feedback/all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setFeedbackList(res.data))
      .catch(err => console.error('Failed to re-fetch feedback:', err));
    }
  };

  if (loading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light fs-4">Loading manager dashboard...</div>;
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
        <h1 className="display-4 fw-bold text-dark">Manager Dashboard</h1>
        <LogoutButton className="btn btn-outline-secondary" />
      </div>

      <div className="row g-4">
        
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="card-title h4 mb-4 pb-2 border-bottom text-dark">Our Employees</h2>
              {employees.length === 0 ? (
                <p className="text-muted fst-italic">No employees found.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {employees.map((employee) => (
                    <li key={employee.id} className="list-group-item d-flex justify-content-between align-items-center bg-light mb-2 rounded-2 shadow-sm">
                      <div>
                        <p className="mb-1 fw-bold text-dark">{employee.username} (ID: {employee.id})</p>
                        <p className="mb-0 text-muted">{employee.email}</p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => setShowFeedbackFormFor(employee.id)}
                          className="btn btn-success btn-sm"
                        >
                          Give Feedback
                        </button>
                        <Link
                          to={`/feedback/employee/${employee.id}`}
                          className="btn btn-info btn-sm"
                        >
                          View Feedback
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

       
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="card-title h4 mb-4 pb-2 border-bottom text-dark">All Feedback Given</h2>
              {feedbackList.length === 0 ? (
                <p className="text-muted fst-italic">No feedback has been recorded yet.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {feedbackList.map((fb) => (
                    <li key={fb.id} className="list-group-item bg-light mb-2 rounded-2 shadow-sm">
                      <p className="mb-1 fw-bold text-dark">
                        For: Employee #{fb.employee_id} &mdash; From: Manager #{fb.manager_id}
                      </p>
                      <p className="text-muted mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                        {fb.message ?
                          `" ${fb.message.substring(0, 100)}${fb.message.length > 100 ? '...' : ''}"`
                          :
                          "(No feedback message)"
                        }
                      </p>
                      <span className={`badge ${
                        fb.sentiment === 'positive' ? 'bg-success' :
                        fb.sentiment === 'negative' ? 'bg-danger' :
                        'bg-warning text-dark'
                      } mb-2`}>
                        Sentiment: {fb.sentiment ? fb.sentiment.charAt(0).toUpperCase() + fb.sentiment.slice(1) : 'N/A'}
                      </span>
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
                        className="btn btn-link btn-sm p-0 d-block text-start"
                      >
                        View Details
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

     
      {showFeedbackFormFor && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Give Feedback to Employee ID: <span className="text-primary">{showFeedbackFormFor}</span></h5>
                <button type="button" className="btn-close" onClick={() => setShowFeedbackFormFor(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <FeedbackForm
                  employeeId={showFeedbackFormFor}
                  onSuccess={handleFeedbackSubmitted}
                  onCancel={() => setShowFeedbackFormFor(null)}
                />
              </div>
            </div>
          </div>
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