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
import OtherUserProfile from './components/profile/OtherUserProfile';
import MainPage from './components/main/MainPage';
import Users from './components/users/Users';
import Reports from './components/reports/Reports';

export const AuthContext = React.createContext();

function App() {  
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [id, setId] = useState(localStorage.getItem('id') || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin') || null);

  useEffect(() => {
    // localStorage.setItem('token', token);
    // localStorage.setItem('id', id);
    // localStorage.setItem('isAdmin', isAdmin);
  }, [token]);

  return (
    <AuthContext.Provider value={token}>
      <div className='App'>
        <Router>
          <Navbar isAdmin={isAdmin}/>
          <div className='page'>
          <Routes>
              <Route path='/' element={<Login setToken={setToken} setId={setId} setIsAdmin={setIsAdmin}/>} />
              <Route path='/login' element={<Login setToken={setToken} setId={setId} setIsAdmin={setIsAdmin}/>} />
              <Route path='/register' element={<Register setToken={setToken} setId={setId} setIsAdmin={setIsAdmin}/>} />
              <Route path='/profile' element={<CurrentUserProfile />} />
              <Route path='/profile/:id' element={<OtherUserProfile />} />
              <Route path='/main' element={<MainPage />} />
              <Route path='/users' element={<Users />} />
              <Route path='/reports' element={<Reports />} />
          </Routes>
          </div>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
