import './Posts.css';
import likeIcon from '../../icons/heart.png';
import redLikeIcon from '../../icons/heart (1).png';
import likeGif from '../../icons/like.gif';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Comments from './Comments';
import { useContext, useState } from 'react';
import authContext from '../../AuthContext';
import usePostData from '../../customHooks/usePost';
import useFetchData from '../../customHooks/useFetch';


const Post = ({ post, deletePost, isLoggedInUser }) => {
    const postReportUrl = "http://localhost:8080/api/v1/reports/post/" + post.id;
    const postReactionUrl = "http://localhost:8080/api/v1/posts/" + post.id + '/react';
    const getReactionsUrl = "http://localhost:8080/api/v1/posts/" + post.id + '/reactions';
    const user = useContext(authContext);
    const [showReactions, setShowReactions] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const { data: reactions, updateParams, totalPages } = useFetchData(getReactionsUrl, user.token, null);
    console.log(reactions)

    const { loading, error, postDataRequest } = usePostData();

    const handleReportSubmit = () => {
        postDataRequest(postReportUrl, null, user.token);
    }

    const handleReactionSubmit = () => {
        postDataRequest(postReactionUrl, { reactionType: 'LIKE' }, user.token);
        // window.location.reload();
    }

    const handleShowReactions = () => {
        setShowReactions(true);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };


    return (
        <div className="post">
            <div className="post-info">
                <div className="username">
                    <h3>{post.creator.firstname} {post.creator.lastname}</h3>
                </div>
                <div className="delete-button">
                    {isLoggedInUser ? <>
                        <Button variant="outlined" color="error" onClick={() => deletePost(post.id)}>
                            Delete
                        </Button>
                    </> : <>
                        <Button variant="outlined" color="error" onClick={() => handleReportSubmit()}>
                            Report
                        </Button>
                    </>}
                </div>
            </div>
            <p>{post.topic.name}</p>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            <div className="post-buttons">
                <img src={redLikeIcon} alt="" className='like-icon' onClick={() => handleReactionSubmit()} />
                <p onClick={handleShowReactions}>Show reactions ({reactions?.length})</p>
            </div>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Reactions</DialogTitle>
                <DialogContent>
                    <div>
                        {showReactions && reactions.map((reaction) => (
                            <div key={reaction.id}>
                                {reaction.likedByUser.firstname} {reaction.likedByUser.lastname} {reaction.timestamp}
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>
            <div className="post-comments">
                <Comments id={post.id} />
            </div>
        </div>
    );
}

export default Post;