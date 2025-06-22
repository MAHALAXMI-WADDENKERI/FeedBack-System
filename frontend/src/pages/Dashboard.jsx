import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

export default function Dashboard({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get("http://localhost:8000/feedback/user/7", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setFeedback(response.data);
//     } catch (error) {
//       console.error("Failed to fetch feedback:", error);
//     }
//   };

//   fetchData();
// }, []);
const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Welcome, {user?.name}</h2>
      <ul>
        {feedbacks.map(f => (
          <li key={f.id} className="mb-2 border p-2">
            <p>Strengths: {f.strengths}</p>
            <p>Improvements: {f.improvement}</p>
            <p>Sentiment: {f.sentiment}</p>
            <Link to={`/feedback/${f.id}`} className="text-blue-500">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
