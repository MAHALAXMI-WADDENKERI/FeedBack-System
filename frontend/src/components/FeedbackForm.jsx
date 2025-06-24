
import React, { useState } from 'react';
import axios from 'axios';

export default function FeedbackForm({ employeeId, onSuccess, onCancel }) {
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [message, setMessage] = useState('');
  const [sentiment, setSentiment] = useState('neutral');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        employee_id: employeeId,
        strengths,
        areas_to_improve: improvements,
        message,
        sentiment,
      };

      await axios.post('http://localhost:8000/feedback', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Feedback submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError(err.response?.data?.detail || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="strengths" className="block text-sm font-medium text-gray-700">Strengths:</label>
        <textarea
          id="strengths"
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows="3"
        ></textarea>
      </div>
      <div>
        <label htmlFor="improvements" className="block text-sm font-medium text-gray-700">Areas to Improve:</label>
        <textarea
          id="improvements"
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows="3"
        ></textarea>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Overall Message (Required):</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows="4"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="sentiment" className="block text-sm font-medium text-gray-700">Sentiment:</label>
        <select
          id="sentiment"
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="neutral">Neutral</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
}