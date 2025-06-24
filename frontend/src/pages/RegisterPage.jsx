
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// const RegisterPage = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [role, setRole] = useState('employee');
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError(''); 

//     console.log('2. Attempting registration with:', { username, email, password: password ? '******' : 'empty', role });

//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     try {
    
//       const res = await axios.post('http://localhost:8000/register', {
//         username,
//         email,
//         password,
//         role,
//       });

      
//       alert('Registration successful! Please log in with your new credentials.');
//       navigate('/login');
    

//     } catch (err) {
//       setError(err.response?.data?.detail || 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Sign Up</h2>

//         <form onSubmit={handleRegister} className="space-y-4">
//           <div>
//             <label htmlFor="usernameInput" className="block text-gray-700 text-sm font-bold mb-2">
//               Username
//             </label>
//             <input
//               id="usernameInput"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="emailInput" className="block text-gray-700 text-sm font-bold mb-2">
//               Email 
//             </label>
//             <input
//               id="emailInput"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div>
//             <label htmlFor="roleSelect" className="block text-gray-700 text-sm font-bold mb-2">
//               Role
//             </label>
//             <select
//               id="roleSelect"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             >
//               <option value="employee">Employee</option>
//               <option value="manager">Manager</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="passwordInput" className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               id="passwordInput"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="confirmPasswordInput" className="block text-gray-700 text-sm font-bold mb-2">
//               Confirm Password
//             </label>
//             <input
//               id="confirmPasswordInput"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>

//           {error && <p className="text-red-500 text-center text-sm">{error}</p>}

//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//           >
//             Register
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="text-blue-500 hover:underline">
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;














// RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('employee'); // Default role
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    console.log('2. Attempting registration with:', { username, email, password: password ? '******' : 'empty', role });

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      console.log('4. Attempting axios.post to /register...');
      const res = await axios.post('http://localhost:8000/register', {
        username,
        email,
        password,
        role,
      });

      console.log('5. axios.post successful. Response data:', res.data);
      alert('Registration successful! Please log in with your new credentials.');
      navigate('/login');

    } catch (err) {
      console.error('9. Registration failed in catch block:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      console.log('10. Error message set.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01] animate-fade-in">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="usernameInput" className="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              id="usernameInput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label htmlFor="emailInput" className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id="emailInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="roleSelect" className="block text-gray-700 text-sm font-semibold mb-2">
              Role
            </label>
            <select
              id="roleSelect"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPasswordInput" className="block text-gray-700 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPasswordInput"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 placeholder-gray-400"
              placeholder="Confirm your password"
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
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-800 transition duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Register
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline font-semibold transition-colors duration-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;