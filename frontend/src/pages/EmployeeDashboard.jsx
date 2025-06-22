import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';

export default function EmployeeDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user) {
      setUserId(user.id);

      axios
        .get(`http://localhost:8000/feedback/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setFeedbackList(res.data))
        .catch((err) => console.error('Failed to fetch feedback:', err));
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <h2 className="text-lg mb-2">Feedback Received</h2>
      <ul className="list-disc list-inside">
        {feedbackList.map((fb) => (
          <li key={fb.id}>
            <strong>From:</strong> Manager #{fb.manager_id} — <strong>Feedback:</strong> {fb.message}
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
  <LogoutButton />
</div>
    </div>
    
  );
}
