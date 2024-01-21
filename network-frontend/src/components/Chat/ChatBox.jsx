import { Button } from '@mui/material';
import './Chat.css';
import authContext from '../../AuthContext';
import { useContext, useEffect, useState } from 'react';
import NewMessage from './NewMessage';
import { Paper } from '@mui/material';

const ChatBox = ({ stompClient, userToChat, setNewMessageRecieved, setUserToChat }) => {
    const currentUser = useContext(authContext);
    const token = currentUser.token;
    const id = currentUser.id;
    const fetchOtherUserDataUrl = `http://localhost:8080/api/v1/users/${userToChat?.id}`;
    const [newMessage, setNewMessage] = useState('');
    // const { data: otherUserData } = useFetchData(apiUrlOtherUser, null, token);

    const [chat, setChat] = useState([]);
    const [userData, setUserData] = useState({
        sender: id,
        receiver: userToChat?.id,
        connected: false,
        message: '',
    });

    useEffect(() => {
        // Subscribe to private messages when the component mounts
        if (id) {
            const privateMessageSubscription = stompClient.subscribe(`/user/${id}/private`, onPrivateMessage);
            return () => {
                privateMessageSubscription.unsubscribe();
                // setNewMessageRecieved(false);
            };
        }
        // Clean up the subscription when the component unmounts

    }, [stompClient, userData.sender]);

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        console.log(payloadData)
        setChat((prevChat) => [
            ...prevChat,
            {
                senderId: payloadData.senderId,
                message: payloadData.message,
            },
        ]);
        // setNewMessage('');
        setNewMessageRecieved(true);
    };

    const handleMessageChange = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };

    const sendPrivateMessage = (messageContent) => {
        console.log(`/user/${id}/private`);
        if (stompClient) {
            const chatMessage = {
                senderId: id,
                receiverId: userToChat?.id,
                message: messageContent,
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
                    message: messageContent,
                },
            ]);
            setNewMessageRecieved(false);
        }
    };

    return (
        <div className="message-container">
            <h2>{userToChat?.firstname} {userToChat?.lastname}</h2>
            <div className="messages">
                {chat.map((message) => (
                    // <div className={`message ${message.senderId === currentUser.id ? 'sent' : 'recieved'}`}>
                    //     {message.message}
                    // </div>
                    <Paper
                        // key={index}
                        elevation={3}
                        className={`message ${message.senderId === currentUser.id ? 'sent' : 'recieved'}`}
                    >
                        {message.message}
                    </Paper>
                ))}
            </div>
            <NewMessage sendPrivateMessage={sendPrivateMessage} />
        </div>
    );
}

export default ChatBox;