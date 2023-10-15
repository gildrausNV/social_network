import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import useFetchData2 from '../../useFetchData2';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import ChatBox from './ChatBox';
import './Chat.css';

var stompClient = null;

const UsersOnline = ({ setNewMessage }) => {
    const navigate = useNavigate();
    const user = useContext(AuthContext);
    const currentUserId = user.id;
    const token = user.token;
    const apiUrlCurrentUser = `http://localhost:8080/api/v1/users/${currentUserId}`;
    const socketUrl = `http://localhost:8080/ws`;
    const { data: currentUserData } = useFetchData2(apiUrlCurrentUser, null, token);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [userData, setUserData] = useState({
        sender: currentUserData?.id,
        receiver: 0,
        connected: false,
        message: '',
    });
    const [connected, setConnected] = useState(false); // Track connection state
    const [userIdToChat, setUserIdToChat] = useState(null);

    //   useEffect(() => {
    //     // connect(); // Initiate connection
    //     onConnected();
    //   }, []);

    useEffect(() => {
        setNewMessage(null);
        onConnected(); // Initiate connection

        // Add a beforeunload event listener to disconnect when leaving the page
        window.addEventListener('unload', handleBeforeUnload);

        return () => {
            // Cleanup: remove the event listener when the component unmounts
            window.removeEventListener('unload', handleBeforeUnload);
        };
    }, []);

    const onError = (err) => {
        console.log(err);
    };

    const connect = () => {
        return new Promise((resolve, reject) => {
            // Construct the WebSocket URI by appending the token as a query parameter
            let wsUri = new URL(socketUrl);
            wsUri.searchParams.append('token', token);

            // Establish the WebSocket connection
            let Sock = new SockJS(wsUri.toString());
            stompClient = over(Sock);

            stompClient.connect({}, (frame) => {
                if (frame) {
                    resolve(); // Resolve the promise when the connection is established
                } else {
                    reject(new Error("WebSocket connection failed")); // Reject the promise on connection failure
                }
            }, onError);
        });
    };



    const onConnected = async () => {
        try {
            await connect(); // Wait for the connection to be established
            const systemNotification = {
                senderId: currentUserId,
                message: `${currentUserId} has joined the chat`,
            };
            
            stompClient.send('/app/system-notification', {}, JSON.stringify(systemNotification));
            // stompClient.subscribe('/chatroom/public', onSystemNotification);
            userJoin();
            subscribeToUserListUpdates();
            setConnected(true);
        } catch (error) {
            console.error(error.message);
        }
    };

    // Call onConnected to initiate the connection
    //   onConnected();


    const onSystemNotification = (payload) => {
        // Handle system notifications if needed
    };

    const userJoin = () => {
        const chatMessage = {
            senderId: currentUserId,
            status: 'JOIN',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const disconnect = () => {
        const disconnectMessage = {
            senderId: currentUserId,
            status: 'LEAVE',
        };
        setConnectedUsers([]);
        setUserData({ ...userData, connected: false });
        setConnected(false);
        stompClient.send('/app/disconnect', {}, JSON.stringify(disconnectMessage));
    };

    // Handle the beforeunload event
    const handleBeforeUnload = (event) => {
        disconnect();
        event.returnValue = 'Are you sure you want to leave?';
    };

    const subscribeToUserListUpdates = () => {
        if (stompClient) {
            stompClient.subscribe('/chatroom/user-list', (payload) => {
                const userListData = JSON.parse(payload.body);
                setConnectedUsers(userListData.connectedUsers.filter((user) => user.id != currentUserId));
                console.log("Received user list update: " + userListData.connectedUsers);
            });
        }
    };

    const [usernameToChat, setUsernameToChat] = useState(null);

    function setUser(newUsername, newId){
        setUserIdToChat(newId);
        setUsernameToChat(newUsername);
    }

    return (
        <div className='chat-page'>
            {!connected ? (
                <>Not connected</>
            ) : (
                <div className="users-online">
                    {connectedUsers.map((user) => (
                        <div
                            className={`user ${user.id === userIdToChat ? 'selected' : ''}`}
                            onClick={() => setUser(user.username, user.id)}
                            key={user.id}
                        >
                            <div className="user-info">
                                <div className="green-dot"></div>
                                <div className="user-name">{user.username}</div>
                            </div>
                        </div>
                    ))}
                    <div onClick={() => disconnect()} className='user'><div className='user-info'>Disconnect</div></div>
                </div>


            )}
            {connected && <div className="chat-container">
                
                    <ChatBox
                        userId={userIdToChat}
                        username={usernameToChat}
                        stompClient={stompClient}
                        currentUserId={currentUserId}
                        setNewMessage={setNewMessage}
                    />
            </div>}
        </div>

    );
};

export default UsersOnline;
