import { useContext, useState } from "react";
import authContext from "../../AuthContext";
import usePostData from "../../customHooks/usePost";
import { Button, TextField } from "@mui/material";

const NewPost = ({handlePostSubmit}) => {
    
    const [newPostContent, setNewPostContent] = useState('');
    const [newTopicName, setNewTopicName] = useState('');


    return ( 
        <div className="new-post-container">
                <div className="new-post">
                    <TextField id="outlined-basic" label="Topic" variant="outlined" onChange={(e) => setNewPostContent(e.target.value)} />
                    <TextField id="outlined-basic" label="Content" variant="outlined" onChange={(e) => setNewTopicName(e.target.value)} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePostSubmit({ content: newPostContent, topic: { name: newTopicName } })}
                    >
                        Post
                    </Button>
                </div>
            </div>
     );
}
 
export default NewPost;