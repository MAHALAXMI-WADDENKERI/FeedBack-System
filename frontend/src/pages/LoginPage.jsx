import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
   //Redirect if already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       if (res.data.user.role === 'manager') {
//   navigate('/manager-dashboard');
// } else if (res.data.user.role === 'employee') {
//   navigate('/employee-dashboard');
// }

//     }
//   }, []);

  const handleLogin = async (e) => {
        e.preventDefault();
    console.log("Trying to log in...");
  try {
    const res = await axios.post('http://localhost:8000/login', {
       username: username,
    password: password
    });
    const token = localStorage.getItem("token");
     const { access_token, user } = res.data;
    console.log("Response received:", res);

    console.log("Login Success", res.data);
    if(res.status===200){
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    if(token){
    if (res.data.user.role === 'manager') {
      navigate('/manager-dashboard');
    } 
    else if(res.data.user.role === 'employee'){
      navigate('/employee-dashboard');
    }
    else {
      navigate('/feedback');
    }
  }
}
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed: " + (error.response?.data?.detail || "Unexpected error"));
  }
};




  return (
  
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <h1>LOginnn</h1>
        <label className="block mb-1">Enter username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <br></br>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <br></br>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
