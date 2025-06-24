
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, Link } from 'react-router-dom';

// export default function FeedbackDetail() {
//   const { feedbackId } = useParams(); 
//   const [feedback, setFeedback] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Authentication token not found.');
//         setLoading(false);
//         return;
//       }

//       try {
        
//         const res = await axios.get(`http://localhost:8000/feedback/detail/${feedbackId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFeedback(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to fetch feedback details:', err); 
//         setError(err.response?.data?.detail || 'Failed to load feedback details. Please try again.');
//         setLoading(false);
//       }
//     };

//     if (feedbackId) { 
//       fetchFeedback();
//     } else {
//       setError("Feedback ID not provided in URL.");
//       setLoading(false);
//     }
//   }, [feedbackId]); 

//   if (loading) {
//     return <div className="p-6 text-center">Loading feedback details...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-red-600 text-center">{error}</div>;
//   }

//   if (!feedback) {
//     return <div className="p-6 text-gray-600 text-center">Feedback not found or loaded.</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Feedback Detail (ID: {feedback.id})</h1>
//       <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5">
//         <p className="text-lg font-medium text-gray-900 mb-2">
//           <strong>For Employee:</strong> #{feedback.employee_id}
//         </p>
//         <p className="text-lg font-medium text-gray-900 mb-2">
//           <strong>From Manager:</strong> #{feedback.manager_id}
//         </p>
//         <p className="text-gray-700 mb-2">
//           <strong>Strengths:</strong> {feedback.strengths}
//         </p>
//         <p className="text-gray-700 mb-2">
//           <strong>Areas to Improve:</strong> {feedback.areas_to_improve}
//         </p>
//         <p className="text-gray-700 mb-2">
//           <strong>Message:</strong> {feedback.message}
//         </p>
//         <p className="text-gray-600 text-sm mb-3">
//           <strong>Sentiment:</strong> {feedback.sentiment || 'N/A'}
//         </p>
//         <p className="text-gray-600 text-sm mb-3">
//           <strong>Sentiment Score:</strong> {feedback.sentiment_score || 'N/A'}
//         </p>
//       </div>
      
//       <div className="mt-6">
//         <Link to="/employee-dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
//           Back to Dashboard
//         </Link>
//       </div>
//     </div>
//   );
// }












// FeedbackDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // Assuming you have this

export default function FeedbackDetail() {
  const { feedbackId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/feedback/detail/${feedbackId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedback(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch feedback details:', err);
        setError(err.response?.data?.detail || 'Failed to load feedback details. Please try again.');
        setLoading(false);
      }
    };

    if (feedbackId) {
      fetchFeedback();
    } else {
      setError("Feedback ID not provided in URL.");
      setLoading(false);
    }
  }, [feedbackId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-4">
        <div className="text-center text-teal-700 text-xl font-semibold">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4 mx-auto"></div>
          Loading feedback details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <Link to="/dashboard" className="mt-6 inline-block bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return <div className="p-6 text-center text-gray-700 font-semibold">Feedback not found or loaded.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 tracking-tight">
          Feedback Detail <span className="text-green-600">(ID: {feedback.id})</span>
        </h1>
        <LogoutButton
          className="bg-red-500 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-8 max-w-3xl mx-auto relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-t-xl"></div>

        <p className="text-lg font-semibold text-gray-900 mb-3 mt-2">
          <span className="text-teal-700">For Employee:</span> #{feedback.employee_id}
        </p>
        <p className="text-lg font-semibold text-gray-900 mb-4">
          <span className="text-teal-700">From Manager:</span> #{feedback.manager_id}
        </p>

        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
          <div>
            <strong className="text-gray-800">Strengths:</strong>
            <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 italic">{feedback.strengths || 'N/A'}</p>
          </div>
          <div>
            <strong className="text-gray-800">Areas to Improve:</strong>
            <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 italic">{feedback.areas_to_improve || 'N/A'}</p>
          </div>
          <div>
            <strong className="text-gray-800">Message:</strong>
            <p className="bg-gray-50 p-3 rounded-lg border border-gray-200">{feedback.message || 'N/A'}</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mt-6 mb-4">
          <strong className="text-gray-800">Sentiment:</strong>{' '}
          <span className={`font-semibold ${
            feedback.sentiment === 'positive' ? 'text-green-600' :
            feedback.sentiment === 'negative' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {feedback.sentiment ? feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1) : 'N/A'}
          </span>
          {feedback.sentiment_score && ` (Score: ${feedback.sentiment_score.toFixed(2)})`}
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/dashboard"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition duration-200 shadow-md"
          >
            Back to Dashboard
          </Link>
          {/* Add a link back to manager/employee dashboard based on user role if needed */}
          {/* <Link
            to={localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'manager' ? '/manager-dashboard' : '/employee-dashboard'}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200 shadow-md"
          >
            Back to Dashboard
          </Link> */}
        </div>
      </div>
    </div>
  );
}