import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';
// import './Login.css'

import './Login.css';

const Login = ({setToken, setId, setIsAdmin}) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const token = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUserChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/login',
        {
          username: user.username,
          password: user.password,
        }
      );

      const { token, id, role } = response.data;

      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', role==='ADMIN');
      setToken(token);
      setId(id);
      setIsAdmin(role==='ADMIN');
      navigate('/main');
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
            name="username"
            value={user.username}
            onChange={handleUserChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleUserChange}
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
