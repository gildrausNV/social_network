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
import Sidebar from './components/Sidebar/Sidebar';
import Trends from './components/Trends/Trends';
import WebSocketTest from './WebSocketTest';
import Chat from './components/Chat/Chat';

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState({
    token: localStorage.getItem('token') || null,
    id: localStorage.getItem('id') || null,
    isAdmin: localStorage.getItem('isAdmin') || null
  })
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [id, setId] = useState(localStorage.getItem('id') || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') || null);

  return (
    <AuthContext.Provider value={user}>
      <div className='App'>
        <Router>
          <Navbar />
          <div className="main-container">
            <div className="left-container">
              {token && <Sidebar />}
              <div className="recommendations-container">
              </div>
            </div>

            <div className='page'>
              <Routes>
                <Route path='/' element={<Login setToken={setToken} setId={setId} setIsAdmin={setIsAdmin} setUserContext={setUser}/>} />
                <Route path='/login' element={<Login setToken={setToken} setId={setId} setIsAdmin={setIsAdmin} setUserContext={setUser}/>} />
                <Route path='/register' element={<Register setToken={setToken} setId={setId} setIsAdmin={setIsAdmin} setUserContext={setUser} />} />
                <Route path='/profile' element={<CurrentUserProfile />} />
                <Route path='/profile/:id' element={<OtherUserProfile />} />
                <Route path='/main' element={<MainPage />} />
                <Route path='/users' element={<Users />} />
                <Route path='/reports' element={<Reports />} />
                {/* <Route path='/chat/:username' element={ <WebSocketTest/>}/> */}
                <Route path='/chat/:username' element={ <Chat />}/>
                {/* <Route path='/chat' element={<Chat/>}/> */}
              </Routes>
            </div>
            <div className="trends-container">
              {/* <Trends /> */}
            </div>
          </div>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
