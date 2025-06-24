
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import LogoutButton from '../components/LogoutButton'; 
// import { Link } from 'react-router-dom';

// export default function EmployeeDashboard() {
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     const token = localStorage.getItem('token');

//     if (user && user.id && token) {
//       setUserId(user.id);
//       axios
//         .get(`http://localhost:8000/feedback/user/${user.id}`, { 
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setFeedbackList(res.data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error('Failed to fetch feedback:', err);
//           setError('Failed to load feedback. Please try again.');
//           setLoading(false);
//         });
//     } else {
//       setError('User not logged in or user ID missing.');
//       setLoading(false);
//     }
//   }, []); 

//   if (loading) {
//     return <div className="p-6 text-center">Loading feedback...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-red-600 text-center">{error}</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Employee Dashboard</h1>
//       <h2 className="text-xl font-semibold mb-4 text-gray-700">Feedback Received for Employee ID: {userId}</h2>
      
//       {feedbackList.length === 0 ? (
//         <p className="text-gray-600 italic">No feedback received yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {feedbackList.map((fb) => (
//             <div key={fb.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-5 transition-transform transform hover:scale-105 hover:shadow-lg">
//               <p className="text-lg font-medium text-gray-900 mb-2">
//                 <strong>From:</strong> Manager #{fb.manager_id}
//               </p>
//               <p className="text-gray-700 mb-2">
//                 <strong>Message:</strong> {fb.message.substring(0, 100)}... 
//               </p>
//               <p className="text-gray-600 text-sm mb-3">
//                 <strong>Sentiment:</strong> {fb.sentiment || 'N/A'}
//               </p>
//               <Link
//                 to={`/feedback/${fb.id}`}
//                 className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 text-sm"
//               >
//                 View Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
      
//       <div className="mt-10 flex justify-end">
//         <LogoutButton />
//       </div>
//     </div>
//   );
// }







// EmployeeDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && user.id && token) {
      setUserId(user.id);
      axios
        .get(`http://localhost:8000/feedback/user/${user.id}`, { // Corrected API endpoint for employee's own feedback
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFeedbackList(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch feedback:', err);
          setError('Failed to load feedback. Please try again.');
          setLoading(false);
        });
    } else {
      setError('User not logged in or user ID missing.');
      setLoading(false);
    }
  }, []); // Empty dependency array means it runs once on mount

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
        <div className="text-center text-indigo-700 text-xl font-semibold">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mb-4 mx-auto"></div>
          Loading feedback...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <Link to="/login" className="mt-6 inline-block bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 tracking-tight">Employee Dashboard</h1>
        <LogoutButton
          className="bg-red-500 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Feedback Received for Employee ID: <span className="text-blue-600">{userId}</span></h2>

      {feedbackList.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-gray-600 italic text-xl">No feedback received yet. Keep up the great work!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-t-xl"></div>
              <p className="text-lg font-semibold text-gray-900 mb-2 mt-2">
                <span className="text-blue-700">From:</span> Manager #{fb.manager_id}
              </p>
              <p className="text-gray-700 mb-3 text-base leading-relaxed">
                <strong className="text-gray-800">Message:</strong> {fb.message.substring(0, 100)}{fb.message.length > 100 ? '...' : ''}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <strong className="text-gray-800">Sentiment:</strong>{' '}
                <span className={`font-semibold ${
                  fb.sentiment === 'positive' ? 'text-green-600' :
                  fb.sentiment === 'negative' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {fb.sentiment ? fb.sentiment.charAt(0).toUpperCase() + fb.sentiment.slice(1) : 'N/A'}
                </span>
              </p>
              <Link
                to={`/feedback/${fb.id}`}
                className="inline-block bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition duration-200 text-sm font-medium shadow"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          to="/dashboard"
          className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition duration-200 shadow-md"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}