import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const fetchAllFeedbackData = useCallback(async () => { // <--- Start useCallback here
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      // Fetch current user details to determine role and ID
      const userRes = await axios.get('/api/verify-token', { // Ensure this is '/api/verify-token' or your Vercel backend URL
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(userRes.data);

      // Fetch feedback details
      const feedbackRes = await axios.get(`/api/feedback/${feedbackId}`, { // Ensure this is '/api/feedback/${feedbackId}'
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(feedbackRes.data);

      // Fetch comments for the feedback
      const commentsRes = await axios.get(`/api/feedback/${feedbackId}/comments`, { // Ensure this is '/api/feedback/${feedbackId}/comments'
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(commentsRes.data);

    } catch (err) {
      console.error('Failed to fetch feedback details or user:', err);
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else if (err.response && err.response.status === 403) {
        setError('Forbidden. You do not have access to this feedback.');
      } else if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to load details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [feedbackId]);
  useEffect(() => {
    fetchAllFeedbackData();
  }, [fetchAllFeedbackData]); 
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);
    const token = localStorage.getItem('token');
    if (!token || !currentUser || !feedbackId) {
      setCommentError('Authentication or feedback details missing.');
      setCommentLoading(false);
      return;
    }

    try {
      await axios.post(
        `/api/feedback/${feedbackId}/comments`, // <--- Ensure this is '/api/feedback/${feedbackId}/comments'
        { comment_text: newCommentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewCommentText('');
      // Re-fetch comments to update the list
      await fetchAllFeedbackData(); // <--- Re-fetching data after comment
    } catch (err) {
      console.error('Failed to submit comment:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setCommentError(err.response.data.detail);
      } else {
        setCommentError('Failed to submit comment. Please try again.');
      }
    } finally {
      setCommentLoading(false);
    }
  };


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

  
  const canComment = currentUser && (
    (currentUser.role === 'employee' && feedback.employee_id === currentUser.id) ||
    (currentUser.role === 'manager') 
  );
  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    setPdfError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/feedback/${feedbackId}/download-pdf`, { // <--- Ensure this is '/api/feedback/${feedbackId}/download-pdf'
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for downloading files
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feedback_${feedbackId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setPdfError('Failed to download PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };


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

       
        <div className="flex justify-center mt-4 space-x-5">
          <button
            onClick={handleDownloadPdf}
            className="btn btn-primary"
            disabled={pdfLoading || !feedback}
          >
            {pdfLoading ? 'Generating PDF...' : 'Export as PDF'}
          </button>

          <Link
            to={localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'manager' ? '/manager-dashboard' : '/employee-dashboard'}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </Link>
        </div>

        {pdfLoading && <p className="text-center text-blue-600 mt-2">Generating PDF...</p>}
        {pdfError && <p className="text-center text-red-600 mt-2">Error: {pdfError}</p>}

        
        <div className="mt-5 border-top pt-4">
          <h2 className="h4 mb-3 pb-2 border-bottom">Comments</h2>

          {commentLoading && <p className="text-center text-blue-600">Loading comments...</p>}
          {commentError && <p className="text-center text-red-600">Error: {commentError}</p>}

          {comments.length === 0 ? (
            <p className="text-muted">No comments yet.</p>
          ) : (
            <div className="list-group">
              {comments.map((comment) => (
                <div key={comment.id} className="list-group-item list-group-item-action flex-column align-items-start mb-2 rounded shadow-sm">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1 text-dark">Comment by User ID: {comment.commenter_id}</h5>
                    <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
                  </div>
                  <div className="mb-1">
                    <ReactMarkdown>{comment.comment_text}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        
        {canComment && (
          <div className="mt-4">
            <h3 className="h5 mb-3">Add a Comment</h3>
            <form onSubmit={handleSubmitComment}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Type your comment here..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  disabled={commentLoading}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={commentLoading || !newCommentText.trim()}
              >
                {commentLoading ? 'Submitting...' : 'Submit Comment'}
              </button>
              {commentError && <p className="text-danger mt-2">{commentError}</p>}
            </form>
          </div>
        )}
        

      </div>
    </div>
  );
}