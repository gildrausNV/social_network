import chatIcon from './icons/chat.png';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/login/Register';
import Home from './components/home/Home';
import Chat from './components/chat/Chat';
import { useContext, React, useState, useEffect } from 'react';
import authContext from './AuthContext';
import Users from './components/users/Users';
import Notifications from './components/notifications/Notifications';
import Report from './components/report/Report';
import Profile from './components/profile/Profile';
import CurrentUserProfile from './components/profile/CurrentUserProfile';
import OtherUserProfile from './components/profile/OtherUserProfile';
import { Button, Badge } from '@mui/material';

// export const AuthContext = React.createContext();

function App() {
  const authContext1 = useContext(authContext);
  const [showChat, setShowChat] = useState(false);
  const [newMessageRecieved, setNewMessageRecieved] = useState(false);

  const [user, setUser] = useState({
    token: localStorage.getItem('token') || null,
    id: localStorage.getItem('id') || null,
    isAdmin: localStorage.getItem('isAdmin') || null
  })
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [id, setId] = useState(localStorage.getItem('id') || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') || null);

  return (
    <authContext.Provider value={user}>
      <BrowserRouter>
        <div className="App">
          <Sidebar />
          <div className="page">
            <Badge
              color="secondary"
              variant="dot"
              invisible={!newMessageRecieved}
              style={{
                position: 'absolute',
                top: '10px',  
                right: '10px', 
              }}
            >
              <Button onClick={() => setShowChat(true)}>
                <img src={chatIcon} alt="Chat" className='icon' />
              </Button>
            </Badge>

            <Routes>
              <Route path='/' element={<Login setToken={setToken} setId={setId} setIsAdmin={setIsAdmin} setUserContext={setUser} />} />
              <Route path='/login' element={<Login setToken={setToken} setId={setId} setIsAdmin={setIsAdmin} setUserContext={setUser} />} />
              <Route path='/register' element={<Register />} />
              <Route path='/home' element={<Home />} />
              <Route path='/notifications' element={<Notifications />} />
              <Route path='/users' element={<Users />} />
              <Route path='/reports' element={<Report />} />
              <Route path='/profile' element={<CurrentUserProfile />} />
              <Route path='/profile/:id' element={<OtherUserProfile />} />
            </Routes>

            <Chat showChat={showChat} setShowChat={setShowChat} setNewMessageRecieved={setNewMessageRecieved} />
          </div>
        </div>
      </BrowserRouter>
    </authContext.Provider>
  );
}

export default App;
