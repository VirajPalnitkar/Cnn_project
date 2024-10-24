// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulated authentication check
    if (username === 'admin' && password === 'password') {
      navigate('/dashboard',{replace:true});
    } else {
      setError('Invalid username or password');
    }
  };

  function handleFocus(){
    document.getElementsByClassName('title')[0].innerHTML='';
    document.querySelector('.login-container').style.float="left";
    document.querySelector('.login-container').style.marginLeft="200px";
  }

  return (
    <div className="login-page">
    <div className="title">
      <h1>Multilevel face recognition system</h1>
    </div>
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input className="input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={handleFocus}
          required
        />
        <input className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
  );
};

export default Login;
