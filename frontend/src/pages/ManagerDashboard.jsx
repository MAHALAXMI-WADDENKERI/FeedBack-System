import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FeedbackDetail from './FeedbackDetail';
import LogoutButton from '../components/LogoutButton';

export default function ManagerDashboard() {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/feedback/manager-only', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackData(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={feedbackData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="employee_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sentiment_score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Feedback Details</h2>
        {feedbackData.map((fb) => (
          <FeedbackDetail key={fb.id} feedback={fb} />
        ))}
      </div>
      <div className="flex justify-end">
  <LogoutButton />
</div>
    </div>
  );
}
