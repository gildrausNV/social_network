import React, { useContext, useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import { AuthContext } from './App';
import useFetchData2 from './useFetchData2';

var stompClient = null;

function WebSocketTest() {
    const { username } = useParams();
    const user = useContext(AuthContext);
    const currentUserId = user.id;
    const token = user.token;
    const apiUrlCurrentUser = 'http://localhost:8080/api/v1/users/' + currentUserId;
    const socketUrl = `http://localhost:8080/ws`;
    const { data: currentUserData } = useFetchData2(apiUrlCurrentUser, null, token);

    const [chat, setChat] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: currentUserData?.username,
        receivername: username,
        connected: false,
        message: ''
    });

    useEffect(() => {
        setUserData({ ...userData, "receivername": username });
        setUserData({ ...userData, "username": currentUserData?.username });
    }, [currentUserData]);
    
    const connect = () => {
        let Sock = new SockJS(socketUrl);
        stompClient = over(Sock);
        stompClient.connect({ token: token }, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        setChat((prevChat) => [
            ...prevChat,
            {
                senderName: payloadData.senderName,
                message: payloadData.message
            }
        ]);
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: userData.receivername,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== userData.receivername) {
                stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                setUserData({ ...userData, "message": "" });
            }

            setChat((prevChat) => [
                ...prevChat,
                {
                    senderName: userData.username,
                    message: userData.message
                }
            ]);
        }
    }

    const registerUser = () => {
        connect();
    }

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <ul className="chat-messages">
                        {chat.map((message, index) => (
                                message.senderName===username ? <div className="message-data-sent" key={index}>{message.senderName}:{message.message}</div> :
                                <div className="message-data-received" key={index}>{message.message}</div>
                        ))}
                    </ul>
                    <div className="send-message">
                        <input
                            type="text"
                            className="input-message"
                            placeholder="enter the message"
                            value={userData.message}
                            onChange={handleMessage}
                        />
                        <button
                            type="button"
                            className="send-button"
                            onClick={sendPrivateValue}
                        >
                            send
                        </button>
                    </div>
                </div>
                :
                <div className="register">
                    <button type="button" onClick={registerUser}>
                        connect
                    </button>
                </div>}
        </div>
    );
}

export default WebSocketTest;
