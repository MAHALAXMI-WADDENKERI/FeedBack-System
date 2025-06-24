
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import LogoutButton from '../components/LogoutButton';
// import FeedbackForm from '../components/FeedbackForm'; 
// export default function ManagerDashboard() {
//   const [employees, setEmployees] = useState([]);
//   const [feedbackList, setFeedbackList] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showFeedbackFormFor, setShowFeedbackFormFor] = useState(null); 

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Authentication token not found.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const employeesRes = await axios.get('http://localhost:8000/users/employees', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEmployees(employeesRes.data);

//         const feedbackRes = await axios.get('http://localhost:8000/feedback/all', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFeedbackList(feedbackRes.data);
//         setLoading(false);
//       } catch (err) { 
//     console.error('Error fetching manager data:', err); 

//     let displayErrorMessage = 'Failed to fetch data. Please try again.';

//     if (err) {
//       if (err.response && err.response.data) { 

//       } else if (err.message) {
//         displayErrorMessage = `Network Error: ${err.message}`;
//       } else {
//         displayErrorMessage = 'An unexpected error occurred.';
//       }
//     }

//     setError(displayErrorMessage); 
//     setLoading(false);
//   }
//     };

//     fetchData();
//   }, []);

//   const handleFeedbackSubmitted = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const feedbackRes = await axios.get('http:/localhost/8000/feedback/all', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFeedbackList(feedbackRes.data);
//       setShowFeedbackFormFor(null); 
//     } catch (err) {
//       console.error('Failed to refresh feedback after submission:', err);
//     }
//   };


//   if (loading) {
//     return <div className="p-6 text-center text-lg">Loading manager dashboard...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-red-600 text-center text-lg">{error}</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-4xl font-extrabold mb-8 text-blue-700 text-center">Manager Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="bg-white rounded-lg shadow-xl p-6">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">My Employees</h2>
//           {employees.length === 0 ? (
//             <p className="text-gray-600 italic">No employees found.</p>
//           ) : (
//             <ul className="space-y-4">
//               {employees.map((employee) => (
//                 <li key={employee.id} className="border-b pb-3 last:border-b-0 flex justify-between items-center">
//                   <span className="text-lg font-medium text-gray-900">{employee.name} (ID: {employee.id})</span>
//                   <div className="space-x-2">
//                     <button
//                       onClick={() => setShowFeedbackFormFor(employee.id)}
//                       className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200 text-sm"
//                     >
//                       Give Feedback
//                     </button>
//                     <Link
//                       to={`/feedback/employee/${employee.id}`}
//                       className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition duration-200 text-sm"
//                     >
//                       View All Feedback
//                     </Link>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="bg-white rounded-lg shadow-xl p-6">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Overall Feedback Overview</h2>
//           {feedbackList.length === 0 ? (
//             <p className="text-gray-600 italic">No feedback entries available.</p>
//           ) : (
//             <ul className="space-y-4">
//               {feedbackList.map((fb) => (
//                 <li key={fb.id} className="border-b pb-3 last:border-b-0">
//                   <p className="text-md text-gray-800">
//                     <strong>For:</strong> Employee #{fb.employee_id} &mdash; <strong>From:</strong> Manager #{fb.manager_id}
//                   </p>
//                   <p className="text-gray-700 text-sm">
//                     {fb.message ?
//                       `"${fb.message.substring(0, 70)}${fb.message.length > 70 ? '...' : ''}"`
//                       :
//                       "(No feedback message)" 
//                     }
//                   </p>
//                   <Link
//                     to={`/feedback/${fb.id}`}
//                     className="text-blue-500 hover:underline text-sm"
//                   >
//                     View Details
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//       {showFeedbackFormFor && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg">
//             <h3 className="text-2xl font-bold mb-5 text-gray-800">Give Feedback to Employee ID: {showFeedbackFormFor}</h3>
//             <FeedbackForm
//               employeeId={showFeedbackFormFor}
//               onSuccess={handleFeedbackSubmitted}
//               onCancel={() => setShowFeedbackFormFor(null)}
//             />
//           </div>
//         </div>
//       )}

//       <div className="mt-10 flex justify-center">
//         <LogoutButton />
//       </div>
//     </div>
//   );
// }







// ManagerDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import FeedbackForm from '../components/FeedbackForm'; // New component for adding feedback

export default function ManagerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]); // All feedback for context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedbackFormFor, setShowFeedbackFormFor] = useState(null); // employee ID for form

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log("Token sent for /users/employees:", token);
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        // Fetch all employees
        const employeesRes = await axios.get('http://localhost:8000/users/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employeesRes.data);

        // Fetch all feedback (for manager's overview)
        const feedbackRes = await axios.get('http://localhost:8000/feedback/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbackList(feedbackRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching manager data:', err);
        let displayErrorMessage = 'Failed to fetch data. Please try again.';
        if (err.response) {
            if (err.response.status === 401 || err.response.status === 403) {
                displayErrorMessage = 'You are not authorized to view this page. Please log in.';
            } else if (err.response.data && err.response.data.detail) {
                displayErrorMessage = err.response.data.detail;
            }
        }
        setError(displayErrorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFeedbackSubmitted = () => {
    // Re-fetch all data to update lists after feedback submission
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/users/employees', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setEmployees(res.data))
        .catch(err => console.error('Failed to re-fetch employees:', err));

      axios.get('http://localhost:8000/feedback/all', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setFeedbackList(res.data))
        .catch(err => console.error('Failed to re-fetch feedback:', err));
    }
    setShowFeedbackFormFor(null); // Close the form
    alert('Feedback submitted successfully!'); // Provide user feedback
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="text-center text-emerald-700 text-xl font-semibold">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mb-4 mx-auto"></div>
          Loading manager dashboard...
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 tracking-tight">Manager Dashboard</h1>
        <LogoutButton
          className="bg-red-500 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Employees List Section */}
        <div className="bg-white p-8 rounded-xl shadow-xl border border-green-200">
          <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
            <svg className="w-8 h-8 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            Our Employees
          </h2>
          {employees.length === 0 ? (
            <p className="text-gray-600 italic">No employees found.</p>
          ) : (
            <ul className="space-y-4">
              {employees.map((employee) => (
                <li key={employee.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-transform hover:translate-x-1 hover:shadow-md">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{employee.name} (ID: {employee.id})</p>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowFeedbackFormFor(employee.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition duration-200 shadow"
                    >
                      Give Feedback
                    </button>
                    <Link
                      to={`/feedback/employee/${employee.id}`}
                      className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-600 transition duration-200 shadow"
                    >
                      View Feedback
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Feedback Section */}
        <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-200">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zm-5.466 2.327l4.316 3.636 6.536-4.575a1 1 0 011.056.287l1.043 1.159c.475.526-.065 1.488-.89 1.488H8.892a1 1 0 01-.73-.346L5.334 11.2a1 1 0 01-.19-.481l-.348-.846a.5.5 0 00-.916.486z"></path></svg>
            Recent Feedback
          </h2>
          {feedbackList.length === 0 ? (
            <p className="text-gray-600 italic">No feedback submitted yet.</p>
          ) : (
            <ul className="space-y-4">
              {feedbackList.slice(0, 5).map((fb) => ( // Show only recent 5 feedback
                <li key={fb.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm flex flex-col transition-transform hover:scale-[1.01] hover:shadow-md">
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    <span className="text-blue-700">For:</span> Employee #{fb.employee_id} &mdash; <span className="text-purple-700">From:</span> Manager #{fb.manager_id}
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    {fb.message ?
                      `"${fb.message.substring(0, 70)}${fb.message.length > 70 ? '...' : ''}"`
                      :
                      "(No feedback message)"
                    }
                  </p>
                  <p className="text-gray-600 text-xs mt-auto">
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
                    className="text-blue-500 hover:underline text-sm font-medium mt-2 self-start"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Feedback Form Modal/Section */}
      {showFeedbackFormFor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transform scale-95 animate-scale-in">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">Give Feedback to Employee ID: <span className="text-blue-600">{showFeedbackFormFor}</span></h3>
            <FeedbackForm
              employeeId={showFeedbackFormFor}
              onSuccess={handleFeedbackSubmitted}
              onCancel={() => setShowFeedbackFormFor(null)}
            />
          </div>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          to="/dashboard"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition duration-200 shadow-md"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}