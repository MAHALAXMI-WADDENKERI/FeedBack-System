
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function EmployeeFeedbackList() {
  const { employeeId } = useParams();
  const [employeeName, setEmployeeName] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeFeedback = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      if (!employeeId) {
        setError('Employee ID not provided in URL.');
        setLoading(false);
        return;
      }

      try {
        try {
            const userRes = await axios.get(`http://localhost:8080/feedback/users/${employeeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployeeName(userRes.data.name || `Employee ${employeeId}`);
        } catch (nameErr) {
            console.warn(`Could not fetch name for employee ${employeeId}:`, nameErr);
            setEmployeeName(`Employee ${employeeId}`);
        }

        const feedbackRes = await axios.get(`http://localhost:8080/feedback/user/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackList(feedbackRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch employee feedback:', err);
        setError(err.response?.data?.detail || 'Failed to load feedback. Please try again.');
        setLoading(false);
      }
    };

    fetchEmployeeFeedback();
  }, [employeeId]);

  if (loading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light fs-4">Loading employee feedback...</div>;
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-danger-subtle p-4 text-danger">
        <p className="fs-4 fw-semibold mb-4">Error: {error}</p>
        <Link to="/manager-dashboard" className="btn btn-secondary">Back to Manager Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light p-4 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4 fw-bold text-dark">Feedback for {employeeName}</h1>
        <LogoutButton className="btn btn-outline-secondary" />
      </div>

      <div className="card shadow-sm p-4">
        <h2 className="card-title h4 mb-4 pb-2 border-bottom text-dark">Feedback Received</h2>
        {feedbackList.length === 0 ? (
          <p className="text-muted fst-italic text-center fs-5">No feedback received for this employee yet.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {feedbackList.map((fb) => (
              <li key={fb.id} className="list-group-item bg-light mb-2 rounded-2 shadow-sm">
                <p className="mb-1 fw-bold text-dark">
                  From Manager: #{fb.manager_id}
                </p>
                <p className="text-muted mb-2">
                  {fb.message ?
                    `"${fb.message.substring(0, 150)}${fb.message.length > 150 ? '...' : ''}"`
                    :
                    "(No feedback message)"
                  }
                </p>
                <p className="text-muted mb-3">
                  <strong>Sentiment:</strong>{' '}
                  <span className={`fw-semibold ${
                    fb.sentiment === 'positive' ? 'text-success' :
                    fb.sentiment === 'negative' ? 'text-danger' :
                    'text-warning'
                  }`}>
                    {fb.sentiment ? fb.sentiment.charAt(0).toUpperCase() + fb.sentiment.slice(1) : 'N/A'}
                  </span>
                </p>
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
                  className="btn btn-primary btn-sm"
                >
                  View Full Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center mt-5">
        <Link
          to="/manager-dashboard"
          className="btn btn-secondary"
        >
          Back to Manager Dashboard
        </Link>
      </div>
    </div>
  );
}