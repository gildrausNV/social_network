import React, { useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import useFetchData2 from '../../useFetchData2';
import UsersOnline from './UsersOnline';
import './Chat.css';
import { over } from 'stompjs';

var stompClient = null;

const Chat = () => {
    const { id } = useParams();
    const user = useContext(AuthContext);
    const currentUserId = user.id;
    const token = user.token;
    const apiUrlCurrentUser = `http://localhost:8080/api/v1/users/${currentUserId}`;
    const apiUrlOtherUser = `http://localhost:8080/api/v1/users/${id}`;
    const socketUrl = `http://localhost:8080/ws`;
    const { data: currentUserData } = useFetchData2(apiUrlCurrentUser, null, token);
    const { data: otherUserData } = useFetchData2(apiUrlOtherUser, null, token);

    const [chat, setChat] = useState([]);
    const [userData, setUserData] = useState({
        sender: currentUserData?.id,
        receiver: id,
        connected: false,
        message: '',
    });

    const [connectedUsers, setConnectedUsers] = useState([]); // State to store connected users

    useEffect(() => {
        setUserData({ ...userData, receiver: id });
        setUserData({ ...userData, sender: currentUserData?.id });
        setChat([]);
        console.log(id)
        console.log(userData)
        // Subscribe to user list updates when the component mounts
        subscribeToUserListUpdates();
    }, [currentUserData, id]);

    const connect = () => {
        let Sock = new SockJS(socketUrl);
        stompClient = over(Sock);
        stompClient.connect({ token: token }, onConnected, onError);
    };

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        const systemNotification = {
            senderId: userData.sender,
            message: `${userData.sender} has joined the chat`,
        };
        stompClient.send('/app/system-notification', {}, JSON.stringify(systemNotification));
        stompClient.subscribe(`/user/${userData.sender}/private`, onPrivateMessage);
        stompClient.subscribe('/chatroom/public', onSystemNotification);
        userJoin();
        subscribeToUserListUpdates();
    };

    const onSystemNotification = (payload) => {
        // const notificationData = JSON.parse(payload.body);
        // if (notificationData.status === 'JOIN' && notificationData.receiverId !== 0) {
        //     // Update the list of connected users
        //     setConnectedUsers(notificationData.connectedUsers);
        //     console.log("Users updated: " + notificationData.connectedUsers);
        // }
    };

    const userJoin = () => {
        const chatMessage = {
            senderId: userData.sender,
            status: 'JOIN',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        setChat((prevChat) => [
            ...prevChat,
            {
                senderId: payloadData.senderId,
                message: payloadData.message,
            },
        ]);
    };

    const onError = (err) => {
        console.log(err);
    };

    const handleMessageChange = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };

    const sendPrivateMessage = () => {
        if (stompClient) {
            const chatMessage = {
                senderId: userData.sender,
                receiverId: id,
                message: userData.message,
                status: 'MESSAGE',
            };

            if (userData.sender !== userData.receiver) {
                stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
                setUserData({ ...userData, message: '' });
            } else {
                console.log("Sender and receiver are the same user.");
            }

            setChat((prevChat) => [
                ...prevChat,
                {
                    senderId: userData.sender,
                    message: userData.message,
                },
            ]);
        }
    };

    const registerUser = () => {
        connect();
    };

    // const onSystemNotification = (payload) => {
        // const notificationData = JSON.parse(payload.body);
        // // console.log("Notification" + JSON.stringify(notificationData));
    
        // if (notificationData.status === 'JOIN' && notificationData.receiverId !== 0) {
        //     // Update the list of connected users
        //     setConnectedUsers(notificationData.connectedUsers);
        //     console.log("Users updated: " + notificationData.connectedUsers);
        // }
        // // setConnectedUsers(notificationData.connectedUsers);
        // console.log("Connected users:" + notificationData.connectedUsers);
    // };
    
    // Function to subscribe to user list updates
    const subscribeToUserListUpdates = () => {
        if (stompClient) {
            stompClient.subscribe('/chatroom/user-list', (payload) => {
                const userListData = JSON.parse(payload.body);
                // Update the state with the received list of connected users
                setConnectedUsers(userListData.connectedUsers);
                console.log("Received user list update: " + userListData.connectedUsers);
            });
        }
    };
    

    return (
        <div className="chat">
            {userData.connected ? (
                <div className="chat">
                    <ul className="chat-messages">
                        {chat.map((message, index) => (
                            <div
                                key={index}
                                className={`message-data-${message.senderId !== userData.sender ? 'sent' : 'received'}`}
                            >
                                {message.senderId !== userData.sender ? `${otherUserData?.username}: ${message.message}` : message.message}
                            </div>
                        ))}
                    </ul>
                    <div className="send-message">
                        <input
                            type="text"
                            className="input-message"
                            placeholder="Enter the message"
                            value={userData.message}
                            onChange={handleMessageChange}
                        />
                        <button type="button" className="send-button" onClick={sendPrivateMessage}>
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={registerUser}>Connect</button>
            )}
        </div>
    );
};

export default Chat;
