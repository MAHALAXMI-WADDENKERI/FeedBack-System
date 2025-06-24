
// import { jwtDecode } from "jwt-decode";
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import LogoutButton from '../components/LogoutButton';

// export default function Dashboard({ user }) { 
//   const [role, setRole] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setRole(decoded.role);
//       } catch (error) {
//         console.error("Failed to decode token:", error);
//       }
//     }
//   }, []);

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-xl text-center">
//         <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome, {user?.username || user?.name}!</h2>
//         <p className="mb-6 text-gray-700 text-lg">You are logged in as a <span className="font-semibold capitalize">{role}</span>.</p>

//         {role === 'manager' && (
//           <div className="mb-6">
//             <p className="text-gray-700 mb-2">As a manager, you can oversee employee feedback.</p>
//             <Link to="/manager-dashboard" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow">
//               Go to Manager Dashboard
//             </Link>
//           </div>
//         )}

//         {role === 'employee' && (
//           <div className="mb-6">
//             <p className="text-gray-700 mb-2">As an employee, you can view feedback received for you.</p>
//             <Link to="/employee-dashboard" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 shadow">
//               View My Feedback
//             </Link>
//           </div>
//         )}

//         <div className="mt-8">
//           <LogoutButton />
//         </div>
//       </div>
//     </div>
//   );
// }









// Dashboard.jsx
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function Dashboard({ user }) {
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-2xl w-full transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4 tracking-tight">
          Welcome, <span className="text-blue-600">{user?.username || user?.name}!</span>
        </h2>
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          You are logged in as a <span className="font-bold capitalize text-indigo-700">{role}</span>.
          Let's get things done!
        </p>

        {role === 'manager' && (
          <div className="mb-6 bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-inner">
            <p className="text-gray-800 mb-4 text-lg">
              As a manager, you can oversee employee feedback and manage your team's performance.
            </p>
            <Link
              to="/manager-dashboard"
              className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:-translate-y-1"
            >
              Go to Manager Dashboard
            </Link>
          </div>
        )}

        {role === 'employee' && (
          <div className="mb-6 bg-indigo-50 p-6 rounded-lg border border-indigo-200 shadow-inner">
            <p className="text-gray-800 mb-4 text-lg">
              As an employee, you can view the feedback received for your work and track your growth.
            </p>
            <Link
              to="/employee-dashboard"
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:-translate-y-1"
            >
              Go to Employee Dashboard
            </Link>
          </div>
        )}

        <div className="mt-8">
          <LogoutButton
            className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition duration-200 shadow-md"
          />
        </div>
      </div>
    </div>
  );
}