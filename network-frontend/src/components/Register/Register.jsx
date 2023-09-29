import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { AuthContext } from '../../App';
import usePostData from '../../usePostData';

const Register = ({ setId, setIsAdmin, setToken, setUserContext }) => {
  const token = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'MALE',
    username: '',
    password: '',
  });
  const url = "http://localhost:8080/api/v1/auth/register";
  const { response, postDataRequest } = usePostData();
  const postData = {
    username: formData.username,
    password: formData.password,
    firstname: formData.firstName,
    lastname: formData.lastName,
    email: formData.email,
    gender: formData.gender
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = postDataRequest(url, postData);

      const { token, id, role } = response.data;

      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', role==='ADMIN');
      setToken(token);
      setId(id);
      setIsAdmin(role==='ADMIN');
      setUserContext({
        id,
        token,
        isAdmin : role==='ADMIN'
      });
      navigate('/main');

    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === 'MALE'}
                onChange={handleChange}
              /> Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === 'FEMALE'}
                onChange={handleChange}
              /> Female
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
