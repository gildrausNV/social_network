import { Button, TextField } from '@mui/material';
import './Chat.css';
import { useState } from 'react';

const NewMessage = ({ sendPrivateMessage }) => {
    const [messageContent, setMessageContent] = useState('');

    return (
        <div className="input-box-container">
            <TextField id="outlined-basic" fullWidth label="Send a message" variant="outlined" onChange={(e) => setMessageContent(e.target.value)} />
            <Button variant="outlined" onClick={() => sendPrivateMessage(messageContent)}>
                Send
            </Button>
        </div>
    );
}

export default NewMessage;