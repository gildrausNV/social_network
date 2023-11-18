import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import { useState, useEffect, useRef } from 'react';
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
import UsersOnline from './components/Chat/UsersOnline';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import Notifications from './components/notifications/Notifications';
import SidebarMenu from './components/Menu/SidebarMenu';

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

  const [newNotification, setNewNotification] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const notificationStompClient = useRef(null);

  const socketUrl = "http://localhost:8080/ws";

  let wsUri = new URL(socketUrl);
  
      

useEffect(() => {
  async function connectWebSocket() {
    try {
      wsUri.searchParams.append('token', token);
      // Create a WebSocket connection using SockJS
      let Sock = new SockJS(wsUri.toString()); // Adjust the URL as needed

      // Create the Stomp client and connect to the WebSocket server
      const client = await over(Sock);
      notificationStompClient.current = client;

      // Establish the connection
      client.connect({}, () => {
        console.log('Connected to WebSocket for notifications');

        // Subscribe to WebSocket notifications for new followers
        const followNotificationSubscription = client.subscribe(`/user/${id}/follow-notification`, (message) => {
          // Handle the follow notification, e.g., display it to the user
          console.log('Received notification:', message.body);
          const response = JSON.parse(message.body);
          if(response.type === 'NOTIFICATION'){
            setNewNotification(response.message);
          }
          else{
            setNewMessage(response.message);
          }
        });

        return () => {
          // Clean up the subscription and disconnect when the component unmounts
          followNotificationSubscription.unsubscribe();
          client.disconnect();
          console.log('Disconnected from WebSocket for notifications');
        };
      }, notificationOnError); // Handle errors during connection
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  // Call the async function to establish the WebSocket connection
  if(token) connectWebSocket();
}, [id, token]);


  

  const notificationOnError = () => {
    console.log("ERROR")
  }

  return (
    <AuthContext.Provider value={user}>
      <div className='App'>
        <Router>
          <SidebarMenu newNotification={newNotification} newMessage={newMessage}/>
          {/* <div className="main-container"> */}
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
                <Route path='/chat' element={<UsersOnline setNewMessage={setNewMessage}/>}/>
                <Route path='/notifications' element={<Notifications setNewNotification={setNewNotification} newNotification={newNotification}/>}/>
              </Routes>
            </div>
          {/* </div> */}
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
