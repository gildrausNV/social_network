import React, { useEffect, useState } from 'react';
import Stomp from 'stompjs';

function WebSocketTest() {
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    console.log('WebSocket connection effect executed.');

    // Create a WebSocket client
    const socket = new WebSocket('ws://localhost:8080/ws-message');

    // Initialize STOMP client
    const stomp = Stomp.over(socket);
    stomp.debug = function (str) {
      console.log(str);
    };

    stomp.connect({}, () => {
      setStompClient(stomp);
    });

    // Clean up when the component unmounts
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient) {
      // Send a message to the WebSocket endpoint
      stompClient.send('/app/ws-message', {}, JSON.stringify({ message: 'Hello, WebSocket!' }));
    }
  };

  useEffect(() => {
    console.log('Subscription effect executed.');

    if (stompClient) {
      // Subscribe to the WebSocket topic
      stompClient.subscribe('/topic/messages', (response) => {
        // Handle incoming messages from the WebSocket
        setMessage(`Received: ${JSON.parse(response.body).message}`);
      });
    }
  }, [stompClient]);

  return (
    <div>
      <h1>WebSocket Test</h1>
      <button onClick={sendMessage}>Send WebSocket Message</button>
      <p>{message}</p>
    </div>
  );
}

export default WebSocketTest;
