import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';
// import './Login.css'

import './Login.css';

const Login = ({ setToken, setId, setIsAdmin, setUserContext }) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleUserChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };


  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:8080/api/v1/auth/login',
  //       {
  //         username: user.username,
  //         password: user.password,
  //       }
  //     );

  //     const { token, id, role } = response.data;

  //     localStorage.setItem('id', id);
  //     localStorage.setItem('token', token);
  //     localStorage.setItem('isAdmin', role==='ADMIN');
  //     setToken(token);
  //     setId(id);
  //     setIsAdmin(role==='ADMIN');
  //     setUserContext({
  //       id,
  //       token,
  //       isAdmin : role==='ADMIN'
  //     });
  //     navigate('/main');
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     setMessage('Login failed');
  //   }
  // };

  useEffect(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser({
      token: null,
      isAdmin: false,
      id: 0
    });
  }, [])

  const login = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/login',
        {
          username: user.username,
          password: user.password,
        }
      );
      console.log(response)
      setIsSent(true);
      setMessage(response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Login failed');
    }
  }

  const verify = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/verify',
        {
          username: user.username,
          verificationCode: code
        }
      );
      console.log(response)
      const { token, id, role } = response.data;

      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', role === 'ADMIN');
      setToken(token);
      setId(id);
      setIsAdmin(role === 'ADMIN');
      setUserContext({
        id,
        token,
        isAdmin: role === 'ADMIN'
      });
      navigate('/main');
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Login failed');
    }
  }


  return (
    <div className="login">
      <h2>Login</h2>
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
      <button className='login-btn' onClick={() => login()}>Login</button>

      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
      {message !== '' && <div className="error-message">{message}</div>}
      {isSent && <>
        <label htmlFor="">Google Authenticator Verification Code</label>
        <input type='text' name='code' onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => verify()}>Verify</button>
      </>}
    </div>
  );
};

export default Login;
