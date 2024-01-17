import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import authContext from '../../AuthContext';
import useFetchData from '../../customHooks/useFetch';
import previousIcon from '../../icons/back-arrow.png';
import nextIcon from '../../icons/right-arrow.png';
import NewComment from './NewComment';
import usePostData from '../../customHooks/usePost';


const Comments = ({ id }) => {
    const getCommentsUrl = "http://localhost:8080/api/v1/posts/" + id + '/comments';
    const commentUrl = "http://localhost:8080/api/v1/posts/" + id + '/comment';
    const user = useContext(authContext);

    const { data: comments, updateParams, totalPages } = useFetchData(getCommentsUrl, user.token, null);

    const { loading, error, postDataRequest } = usePostData();


    const handleCommentSubmit = (comment) => {
        postDataRequest(commentUrl, { content: comment }, user.token);
        // window.location.reload();
    }

    return (
        <div className="comments">
            <NewComment handleCommentSubmit={handleCommentSubmit} />
            <div className="comment-list">
                {comments && comments.map((comment) => (
                <div className="comment" key={comment.id}>
                    <div className="comment-content" key={comment.id}>
                        {comment.creator.firstname} {comment.creator.lastname}: {comment.content}
                    </div>
                    <div className="comment-time">
                        {comment.timePosted}
                    </div>
                </div>))}
            </div>
        </div>
    );
}

export default Comments;