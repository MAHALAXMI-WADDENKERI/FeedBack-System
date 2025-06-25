import React, { useEffect, useState } from "react";
import axios from "axios";

function ManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8080/users/")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFeedbackSubmit = (userId) => {
    const data = {
      strengths: feedback[userId]?.strengths || "",
      areas_to_improve: feedback[userId]?.areas_to_improve || "",
      sentiment: feedback[userId]?.sentiment || "neutral",
      employee_id: userId,
      manager_id: 1 
    };
    axios.post("http://localhost:8080/feedback/", data)
      .then(() => alert("Feedback submitted!"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>
      {users.map(user => (
        <div key={user.id} style={{ border: "1px solid gray", padding: 10, margin: 10 }}>
          <h4>{user.name}</h4>
          <textarea
            placeholder="Strengths"
            onChange={(e) => setFeedback({ ...feedback, [user.id]: { ...feedback[user.id], strengths: e.target.value } })}
          />
          <textarea
            placeholder="Areas to Improve"
            onChange={(e) => setFeedback({ ...feedback, [user.id]: { ...feedback[user.id], areas_to_improve: e.target.value } })}
          />
          <select
            onChange={(e) => setFeedback({ ...feedback, [user.id]: { ...feedback[user.id], sentiment: e.target.value } })}
          >
            <option value="neutral">Neutral</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
          <button onClick={() => handleFeedbackSubmit(user.id)}>Submit Feedback</button>
        </div>
      ))}
    </div>
  );
}

export default ManagerDashboard;
