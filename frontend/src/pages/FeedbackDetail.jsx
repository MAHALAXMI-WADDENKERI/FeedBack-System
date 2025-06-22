import React from 'react';

export default function FeedbackDetail({ feedback }) {
  return (
    <div className="border rounded p-4 mb-3 shadow-sm bg-white">
      <p><strong>Employee ID:</strong> {feedback.employee_id}</p>
      <p><strong>Manager ID:</strong> {feedback.manager_id}</p>
      <p><strong>Message:</strong> {feedback.message}</p>
      <p><strong>Sentiment Score:</strong> {feedback.sentiment_score}</p>
    </div>
  );
}
