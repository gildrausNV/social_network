import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';
// import './Login.css'

import './Login.css';

const Login = ({setToken}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/login',
        {
          username,
          password,
        }
      );

      const { token } = response.data;

      localStorage.setItem('token', token);
      setToken(token);

      setUsername('');
      setPassword('');
      
      navigate('/profile');
      
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Login failed');
    }
  };

  useEffect(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, [])

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className='login-btn'>Login</button>
        {message}
      </form>
      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
