import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import { AuthContext } from '../../App';

const Register = ({ onSubmit }) => {
  const token = useContext(AuthContext)
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <Link to="/login">Already have an account? Log in</Link>
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
