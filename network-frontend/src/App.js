import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import { useState, useEffect } from 'react';
import React from 'react';
import Profile from './components/profile/Profile';
import Navbar from './components/Menu/Navbar';
import CurrentUserProfile from './components/profile/CurrentUserProfile';
import MainPage from './components/main/MainPage';
import Users from './components/users/Users';

export const AuthContext = React.createContext();

function App() {  
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <AuthContext.Provider value={token}>
      <div className='App'>
        <Router>
          <Navbar />
          <div className='page'>
          <Routes>
              <Route path='/' element={<Login setToken={setToken} />} />
              <Route path='/login' element={<Login setToken={setToken} />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile' element={<CurrentUserProfile />} />
              <Route path='/main' element={<MainPage />} />
              <Route path='/users' element={<Users />} />
          </Routes>
          </div>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
