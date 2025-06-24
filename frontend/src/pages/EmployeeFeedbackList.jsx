// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, Link } from 'react-router-dom';
// import LogoutButton from '../components/LogoutButton';
// export default function EmployeeFeedbackList() {
//   const { employeeId } = useParams(); 
//   const [employeeName, setEmployeeName] = useState(''); 
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEmployeeFeedback = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Authentication token not found.');
//         setLoading(false);
//         return;
//       }

//       if (!employeeId) {
//         setError('Employee ID not provided in URL.');
//         setLoading(false);
//         return;
//       }

//       try {
        
//         try {
//             const userRes = await axios.get(`http://localhost:8000/users/${employeeId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setEmployeeName(userRes.data.username || `Employee ${employeeId}`); 
//         } catch (nameErr) {
//             console.warn(`Could not fetch name for employee ${employeeId}:`, nameErr);
//             setEmployeeName(`Employee ${employeeId}`);
//         }


       
//         const feedbackRes = await axios.get(`http://localhost:8000/feedback/employee/${employeeId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFeedbackList(feedbackRes.data);
//         setLoading(false);
//       } catch (err) {
//         console.error(`Failed to fetch feedback for employee ${employeeId}:`, err);
//         setError(err.response?.data?.detail || 'Failed to load feedback. Please try again.');
//         setLoading(false);
//       }
//     };

//     fetchEmployeeFeedback();
//   }, [employeeId]); 

//   if (loading) {
//     return <div className="p-6 text-center text-lg">Loading feedback for {employeeName || `Employee ID: ${employeeId}`}...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-red-600 text-center text-lg">{error}</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-4xl font-extrabold mb-8 text-blue-700 text-center">
//         Feedback for {employeeName}
//       </h1>

//       <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Received Feedback</h2>
//         {feedbackList.length === 0 ? (
//           <p className="text-gray-600 italic">No feedback received for this employee yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {feedbackList.map((fb) => (
//               <li key={fb.id} className="border-b pb-3 last:border-b-0">
//                 <p className="text-md text-gray-800">
//                   <strong>From Manager:</strong> #{fb.manager_id}
//                 </p>
//                 <p className="text-gray-700 text-sm">
//                   {fb.message ?
//                     `"${fb.message.substring(0, 150)}${fb.message.length > 150 ? '...' : ''}"`
//                     :
//                     "(No feedback message)"
//                   }
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   <strong>Sentiment:</strong> {fb.sentiment || 'N/A'}
//                 </p>
//                 <Link
//                   to={`/feedback/detail/${fb.id}`}
//                   className="text-blue-500 hover:underline text-sm mt-1 inline-block"
//                 >
//                   View Full Details
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="mt-8 flex justify-center space-x-4">
//         <Link 
//           to="/manager-dashboard" 
//           className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
//         >
//           Back to Dashboard
//         </Link>
//         <LogoutButton />
//       </div>
//     </div>
//   );
// }








// src/pages/EmployeeFeedbackList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function EmployeeFeedbackList() {
  const { employeeId } = useParams();
  const [employeeName, setEmployeeName] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeFeedback = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      if (!employeeId) {
        setError('Employee ID not provided in URL.');
        setLoading(false);
        return;
      }

      try {
        try {
            const userRes = await axios.get(`http://localhost:8000/users/${employeeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployeeName(userRes.data.username || `Employee ${employeeId}`);
        } catch (nameErr) {
            console.warn(`Could not fetch name for employee ${employeeId}:`, nameErr);
            setEmployeeName(`Employee ${employeeId}`);
        }

        const feedbackRes = await axios.get(`http://localhost:8000/feedback/user/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackList(feedbackRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch employee feedback:', err);
        setError(err.response?.data?.detail || 'Failed to load employee feedback. Please try again.');
        setLoading(false);
      }
    };

    fetchEmployeeFeedback();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="text-center text-purple-700 text-xl font-semibold">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4 mx-auto"></div>
          Loading employee feedback...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <Link to="/manager-dashboard" className="mt-6 inline-block bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
            Back to Manager Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 tracking-tight">
          Feedback for <span className="text-pink-600">{employeeName}</span>
        </h1>
        <LogoutButton
          className="bg-red-500 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
        />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl">
        {feedbackList.length === 0 ? (
          <p className="text-gray-600 italic text-xl text-center">No feedback received for this employee yet.</p>
        ) : (
          <ul className="space-y-6">
            {feedbackList.map((fb) => (
              <li key={fb.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-400 to-pink-500 rounded-r-full"></div>
                <div className="pl-4">
                  <p className="text-lg text-gray-800 font-semibold mb-1">
                    <strong>From Manager:</strong> <span className="text-blue-700">#{fb.manager_id}</span>
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed mb-2">
                    {fb.message ?
                      `"${fb.message.substring(0, 150)}${fb.message.length > 150 ? '...' : ''}"`
                      :
                      "(No feedback message)"
                    }
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    <strong>Sentiment:</strong>{' '}
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
                    className="inline-block bg-purple-500 text-white px-5 py-2 rounded-full hover:bg-purple-600 transition duration-200 text-sm font-medium shadow"
                  >
                    View Full Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 flex justify-center space-x-4">
        <Link
          to="/manager-dashboard"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition duration-200 shadow-md"
        >
          Back to Manager Dashboard
        </Link>
      </div>
    </div>
  );
}