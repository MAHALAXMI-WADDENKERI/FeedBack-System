
// // LoginPage.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate,Link } from 'react-router-dom';

// const Login = ({ setUser }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//  const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await axios.post('http://localhost:8000/login', {
//        username: username,
//        password: password
//     });
//     const { access_token, user } = res.data;
//     localStorage.setItem('token', access_token);
//     localStorage.setItem('user', JSON.stringify(user));

//     if (user.role === 'manager') {
//       navigate('/manager-dashboard');
//     } else if (user.role === 'employee') {
//       navigate('/employee-dashboard');
//     } else {
//       navigate('/dashboard'); 
//     }

//   } catch (error) {
//     alert("Login failed: " + (error.response?.data?.detail || "Unexpected error"));
//   }
// };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-80">
//         <h2 className="text-xl font-bold mb-4">Login</h2>
//         <label htmlFor="usernameInput" className="block mb-1">Enter username</label>
//         <input
//           id="usernameInput"
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full border p-2 mb-4 rounded"
//         />
//         <label htmlFor="passwordInput" className="block mb-1">Password</label>
//         <input
//           id="passwordInput"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border p-2 mb-4 rounded"
//         />

//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
//         >
//           Login
//         </button>
//         <p className="mt-4 text-center text-sm">
//           Don't have an account?{' '}
//           <Link to="/register" className="text-blue-500 hover:underline">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;






// LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    console.log("1. Login button clicked - handleLogin started.");

    // Ensure username and password states are correctly updated and have values
    console.log("2. Attempting login with username:", username, "and password:", password ? "******" : "empty");

    try {
      const res = await axios.post('http://localhost:8000/login', {
         username: username,
         password: password
      });
      console.log("3. Axios POST request sent successfully.");

      const { access_token, user } = res.data;
      console.log("4. Login Success! User data:", user);

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Assuming setUser is passed from App.js to update global state
      if (setUser) {
        setUser(user);
      }

      if (user.role === 'manager') {
        navigate('/manager-dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error("5. Login failed caught in catch block:", error);
      setError(error.response?.data?.detail || "Login failed. Please check your credentials.");
      // alert("Login failed: " + (error.response?.data?.detail || "Unexpected error")); // Replaced with inline error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01] animate-fade-in">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Welcome Back!
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="usernameInput" className="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              id="usernameInput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="passwordInput" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 border border-red-300 p-3 rounded-lg animate-fade-in-up">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold transition-colors duration-200">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;