import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './Chat.css';
import UsersOnline from './UsersOnline';
import { useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import authContext from '../../AuthContext';
import useFetchData2 from '../../customHooks/useFetchWithoutParams';
import ChatBox from './ChatBox';

var stompClient = null;

const Chat = ({ showChat, setShowChat, setNewMessageRecieved }) => {
    const user = useContext(authContext);
    const currentUserId = user.id;
    const socketUrl = `http://localhost:8080/ws`;
    const apiUrl = 'http://localhost:8080/api/v1/users/' + user.id;
    // const { data, loading, error } = useFetchData2(apiUrl, null, user.token);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [userData, setUserData] = useState({
        sender: currentUserId,
        receiver: 0,
        connected: false,
        message: '',
    });
    const [connected, setConnected] = useState(false);
    const [userToChat, setUserToChat] = useState(null);

    useEffect(() => {
        onConnected();
        // setNewMessageRecieved(false);
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
            let wsUri = new URL(socketUrl);
            wsUri.searchParams.append('token', user.token);

            let Sock = new SockJS(wsUri.toString());
            stompClient = over(Sock);

            stompClient.connect({}, (frame) => {
                if (frame) {
                    resolve();
                } else {
                    reject(new Error("WebSocket connection failed"));
                }
            }, onError);
        });
    };



    const onConnected = async () => {
        try {
            await connect();
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
        setShowChat(false);
        setUserToChat(null);
    };

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


    return (
        <>
            {showChat && <Dialog open={true} fullWidth maxWidth="md">
                <DialogTitle>
                    <div className="title-dialog">
                        <div className="title">
                            Chat
                        </div>
                        <div className="close-button">
                            <Button onClick={disconnect}>Close Chat</Button>
                        </div>
                    </div>

                </DialogTitle>
                <DialogContent>
                    <UsersOnline connectedUsers={connectedUsers} setUserToChat={setUserToChat} />
                    {userToChat ? <ChatBox stompClient={stompClient} userToChat={userToChat} setNewMessageRecieved={setNewMessageRecieved} setUserToChat={setUserToChat}/> : <div className='message-container'></div>}
                </DialogContent>

            </Dialog>}
        </>
    );
}

export default Chat;