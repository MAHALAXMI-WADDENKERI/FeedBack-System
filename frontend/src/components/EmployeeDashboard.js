import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EmployeeDashboard() {
  const { id } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/feedback/employee/${id}`)
      .then(res => setFeedbackList(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div>
      <h2>Employee Feedback Timeline</h2>
      {feedbackList.map((fb, index) => (
        <div key={index} style={{ border: "1px solid gray", padding: 10, margin: 10 }}>
          <p><strong>Strengths:</strong> {fb.strengths}</p>
          <p><strong>Improvements:</strong> {fb.areas_to_improve}</p>
          <p><strong>Sentiment:</strong> {fb.sentiment}</p>
        </div>
      ))}
    </div>
  );
}

export default EmployeeDashboard;
