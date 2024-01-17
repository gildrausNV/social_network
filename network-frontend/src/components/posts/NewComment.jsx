import { Button, TextField } from "@mui/material";
import { useState } from "react";

const NewComment = ({ handleCommentSubmit }) => {
    const [comment, setComment] = useState('');

    return (
        <div className="new-comment">
            <TextField id="outlined-basic" label="Comment" variant="outlined" style={{ width: 800, paddingBottom: '10px' }} onChange={(e) => setComment(e.target.value)} />
            <div className="new-comment-button">
                <Button
                    variant="contained"
                    color="primary"
                    style={{ width: 150 }}
                    onClick={() => handleCommentSubmit(comment)}
                >
                    Comment
                </Button>
            </div>
        </div>
    );
}

export default NewComment;