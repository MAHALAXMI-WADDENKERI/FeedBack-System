
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function FeedbackDetail() {
  const { feedbackId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); 
  const [newCommentText, setNewCommentText] = useState(''); 
  const [commentLoading, setCommentLoading] = useState(false); 
  const [commentError, setCommentError] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); 


  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const userRes = await axios.get('http://localhost:8080/verify-token', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(userRes.data);

        const feedbackRes = await axios.get(`http://localhost:8080/feedback/detail/${feedbackId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedback(feedbackRes.data);

        const commentsRes = await axios.get(`http://localhost:8080/feedback/${feedbackId}/comments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(commentsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch feedback details or comments:', err);
        let displayErrorMessage = 'Failed to load feedback details. Please try again.';
        if (err.response) {
            if (err.response.status === 403) {
                displayErrorMessage = 'You do not have permission to view this feedback.';
            } else if (err.response.status === 404) {
                displayErrorMessage = 'Feedback not found.';
            } else if (err.response.data && err.response.data.detail) {
                displayErrorMessage = err.response.data.detail;
            }
        }
        setError(displayErrorMessage);
        setLoading(false);
      }
    };

    if (feedbackId) {
      fetchFeedback();
    } else {
      setError("Feedback ID not provided in URL.");
      setLoading(false);
    }
  }, [feedbackId]);

  if (loading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light fs-4">Loading feedback details...</div>;
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-danger-subtle p-4 text-danger">
        <p className="fs-4 fw-semibold mb-4">Error: {error}</p>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  if (!feedback) {
    return <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light fs-4">Feedback not found or loaded.</div>;
  }

  return (
    <div className="container-fluid bg-light p-4 d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: '700px', width: '100%' }}>
        <div className="card-body">
          <h1 className="card-title h3 mb-4 pb-2 border-bottom text-dark text-center">Feedback Details (ID: {feedback.id})</h1>
          <div className="mb-3">
            <p className="fw-bold mb-1">For Employee:</p>
            <p className="card-text text-primary fs-5">#{feedback.employee_id}</p>
          </div>
          <div className="mb-3">
            <p className="fw-bold mb-1">From Manager:</p>
            <p className="card-text text-info fs-5">#{feedback.manager_id}</p>
          </div>
          <div className="mb-3">
            <p className="fw-bold mb-1">Strengths:</p>
            <p className="card-text alert alert-success-subtle border border-success-subtle rounded-3 p-3">{feedback.strengths || 'N/A'}</p>
          </div>
          <div className="mb-3">
            <p className="fw-bold mb-1">Areas to Improve:</p>
            <p className="card-text alert alert-danger-subtle border border-danger-subtle rounded-3 p-3">{feedback.areas_to_improve || 'N/A'}</p>
          </div>
          <div className="mb-3">
            <p className="fw-bold mb-1">Message:</p>
            <p className="card-text alert alert-light border border-secondary-subtle rounded-3 p-3">{feedback.message || 'N/A'}</p>
          </div>
          <p className="text-muted mt-4">
            <strong className="text-dark">Sentiment:</strong>{' '}
            <span className={`fw-semibold ${
              feedback.sentiment === 'positive' ? 'text-success' :
              feedback.sentiment === 'negative' ? 'text-danger' :
              'text-warning'
            }`}>
              {feedback.sentiment ? feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1) : 'N/A'}
            </span>
            {feedback.sentiment_score && ` (Score: ${feedback.sentiment_score.toFixed(2)})`}
          </p>
          <div className="mt-4">
            <strong className="text-gray-700 text-sm">Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {(feedback.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link
            to={localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'manager' ? '/manager-dashboard' : '/employee-dashboard'}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}