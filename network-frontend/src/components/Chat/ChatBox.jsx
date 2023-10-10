import React, { useContext, useEffect, useState } from 'react';
import useFetchData2 from '../../useFetchData2';
import { AuthContext } from '../../App';


const ChatBox = ({ userId, username, stompClient, currentUserId }) => {
    const user = useContext(AuthContext);
    const token = user.token;
    const id = user.id;
    const apiUrlOtherUser = `http://localhost:8080/api/v1/users/${userId}`;
    const { data: otherUserData } = useFetchData2(apiUrlOtherUser, null, token);

    const [chat, setChat] = useState([]);
    const [userData, setUserData] = useState({
        sender: id,
        receiver: userId,
        connected: false,
        message: '',
    });

    useEffect(() => {
        // Subscribe to private messages when the component mounts
        if(userId){
            const privateMessageSubscription = stompClient.subscribe(`/user/${userData.sender}/private`, onPrivateMessage);
            return () => {
            privateMessageSubscription.unsubscribe();
        };
        }
        // Clean up the subscription when the component unmounts
        
    }, [stompClient, userData.sender]);

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

    const handleMessageChange = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };

    const sendPrivateMessage = () => {
        if (stompClient) {
            const chatMessage = {
                senderId: id,
                receiverId: userId,
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

    return (
        <div className="chat-box">
            <div className="chat-header">
                <span>{otherUserData?.username}</span>
            </div>
            <div className="chat">
                <ul className="chat-messages">
                    {chat?.map((message, index) => (
                        <div
                            key={index}
                            className={`message-data-${currentUserId === message.senderId ? 'sent' : 'received'}`}
                        >
                            {currentUserId !== message.senderId ? `${otherUserData?.username}: ${message.message}` : message.message}
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
                    
                    <button type="button" className="send-button" onClick={sendPrivateMessage} disabled={userId==null}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
