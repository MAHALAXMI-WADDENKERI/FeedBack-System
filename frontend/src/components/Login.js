import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('employee');

  const handleLogin = () => {
    console.log("Logging in with", username, password);

    if (!username) return alert("Enter username");
    onLogin({ username, role });
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
      </select>
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
