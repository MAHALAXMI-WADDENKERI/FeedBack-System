
import React, { useState } from 'react';
import axios from 'axios';

export default function FeedbackForm({ employeeId, onSuccess, onCancel }) {
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [message, setMessage] = useState('');
  const [sentiment, setSentiment] = useState('neutral');
  const [sentimentScore, setSentimentScore] = useState('');
  const [tags, setTags] = useState(''); 
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
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    try {
      const payload = {
        employee_id: employeeId,
        strengths,
        areas_to_improve: improvements,
        message,
        sentiment,
        tags: tagsArray
      };

      await axios.post('http://localhost:8080/feedback', payload, {
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
      <div>
        <label htmlFor="sentimentScore" className="block text-sm font-medium text-gray-700">Sentiment Score (0-100, Optional):</label>
        <input
          type="number"
          id="sentimentScore"
          value={sentimentScore}
          onChange={(e) => setSentimentScore(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          min="0"
          max="100"
        />
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="e.g., communication, teamwork, leadership"
        />
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
          className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
}