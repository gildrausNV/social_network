import React, { useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import useFetchData2 from '../../useFetchData2';
import UsersOnline from './UsersOnline';
import './Chat.css';
import {over} from 'stompjs';

var stompClient = null;

const Chat = () => {
    const { username } = useParams();
    const user = useContext(AuthContext);
    const currentUserId = user.id;
    const token = user.token;
    const apiUrlCurrentUser = `http://localhost:8080/api/v1/users/${currentUserId}`;
    const socketUrl = `http://localhost:8080/ws`;
    const { data: currentUserData } = useFetchData2(apiUrlCurrentUser, null, token);

    const [chat, setChat] = useState([]);
    const [userData, setUserData] = useState({
        sender: currentUserData?.username,
        receiver: username,
        connected: false,
        message: '',
    });

    useEffect(() => {
        setUserData({ ...userData, receiver: username });
        setUserData({ ...userData, sender: currentUserData?.username });
    }, [currentUserData]);

    const connect = () => {
        let Sock = new SockJS(socketUrl);
        stompClient = over(Sock);
        stompClient.connect({ token: token }, onConnected, onError);
    };

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        const systemNotification = {
            senderName: userData.sender,
            message: `${userData.sender} has joined the chat`,
        };
        stompClient.send('/app/system-notification', {}, JSON.stringify(systemNotification));
        stompClient.subscribe(`/user/${userData.sender}/private`, onPrivateMessage);
        stompClient.subscribe('/chatroom/public', onSystemNotification);
        userJoin();
    };

    const onSystemNotification = (payload) => {
        const notificationData = JSON.parse(payload.body);
        console.log(notificationData);
    };

    const userJoin = () => {
        const chatMessage = {
            senderName: userData.sender,
            status: 'JOIN',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        setChat((prevChat) => [
            ...prevChat,
            {
                senderName: payloadData.senderName,
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
                senderName: userData.sender,
                receiverName: userData.receiver,
                message: userData.message,
                status: 'MESSAGE',
            };
    
            if (userData.sender !== userData.receiver) {
                stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
                setUserData({ ...userData, message: '' });
            }
    
            setChat((prevChat) => [
                ...prevChat,
                {
                    senderName: userData.sender,
                    message: userData.message, // Change userData.username to userData.sender
                },
            ]);
        }
    };
    

    const registerUser = () => {
        connect();
    };

    return (
        <div className="chat">
            {userData.connected ? (
                <div className="chat">
                    <UsersOnline />
                    <ul className="chat-messages">
                        {chat.map((message, index) => (
                            <div
                                key={index}
                                className={`message-data-${message.senderName === username ? 'sent' : 'received'}`}
                            >
                                {message.senderName === username ? `${message.senderName}: ${message.message}` : message.message}
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
