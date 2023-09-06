import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import { AuthContext } from '../../App';

const Register = ({ onSubmit }) => {
  const token = useContext(AuthContext)
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement form submission logic here and call onSubmit function
    // with the form data to handle the registration process.
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
        {/* Add other form fields here */}
        <div className="form-row">
          <div className="form-group">
            <Link to="/login">Already have an account? Log in</Link>
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
      {token}
    </div>
  );
};

export default Register;
