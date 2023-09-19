import { useContext, useEffect, useState } from "react";
import usePostData from "../../usePostData";
import "./Profile.css";
import { AuthContext } from "../../App";
import axios from "axios";
import useFetchData from "../../useFetchData";
import Comments from "./Comments";
import Reactions from "./Reactions";

const Post = ({ post, deletePost, isCurrentUser }) => {
  const token = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState();
  const { loading, error, postDataRequest } = usePostData();
  const [comments, setComments] = useState();
  const [reactions, setReactions] = useState();

  const getCommentsUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/comments";
  const getReactionsUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/reactions";
  const commentUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/comment";
  const reactionUrl = "http://localhost:8080/api/v1/posts/" + post.id + '/react';
  const reportUrl = "http://localhost:8080/api/v1/reports/post/" + post.id;

  useEffect(() => {
    const getComments = async () => {

      try {
        const response = await axios.get(
          getCommentsUrl,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComments(response.data.content);
        console.log(response.data.content)
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    };
    getComments();
  }, [comment]);

  useEffect(() => {
    const getReactions = async () => {

      try {
        const response = await axios.get(
          getReactionsUrl,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReactions(response.data.content);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    };
    getReactions();
  }, []);


  const handleNewPostChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    postDataRequest(commentUrl, { content: comment }, token);
    setComment("");
  };

  const handleReportSubmit = () => {
    postDataRequest(reportUrl, null, token);
  }

  const handleReactionSubmit = (reaction) => {
    postDataRequest(reactionUrl, { reactionType: reaction }, token);
  }

  const [modalComments, setModalComments] = useState(false);

  const toggleModalComments = () => {
    setModalComments(!modalComments);
  }

  const [modalReactions, setModalReactions] = useState(false);

  const toggleModalReactions = () => {
    setModalReactions(!modalReactions);
  }

  return (
    <div className="post">
      <div className="row header">
        <div className="text-container">
          {post?.creator.firstname} {post?.creator.lastname}
        </div>
        {isCurrentUser ? <div className="button-container">
          <button className="delete-btn" onClick={() => deletePost(post.id)}>Delete</button>
        </div> : <div className="button-container">
          <button className="delete-btn" onClick={() => handleReportSubmit()}>Report</button>
        </div>}
      </div>
      <div className="row-content">{post?.content}</div>
      <div className="row">
        <div className="button-container">
          {!isCurrentUser && <>
            <button className="like-btn" onClick={() => handleReactionSubmit('LIKE')}>👍</button>
            <button className="like-btn" onClick={() => handleReactionSubmit('ANGRY')}>😡</button>
            <button className="like-btn" onClick={() => handleReactionSubmit('LOVE')}>😍</button>
            <button className="like-btn" onClick={() => handleReactionSubmit('SAD')}>😭</button></>
          }
          <div className="text-container" style={{ paddingLeft: '40%' }}>
            <u style={{ color: 'blue' }} onClick={toggleModalReactions}>Show reactions({reactions?.length})</u>
          </div>
        </div>

      </div>
      <div className="row">
        <textarea
          name="comment"
          id=""
          cols="30"
          rows="10"
          onChange={handleNewPostChange}
        />
      </div>
      <div className="row">
        <div className="button-container">
          <button onClick={handleCommentSubmit} className="comment-btn">
            Comment
          </button>
          <div className="text-container" style={{ paddingLeft: '55%' }}>
            <u style={{ color: 'blue' }} onClick={() => setModalComments(!showComments)}>Show comments({comments?.length})</u>
          </div>
        </div>
      </div>
      {modalComments && (
        <div className="modal-overlay">
          <div className="modal">
          <h1>Comments</h1>
            <Comments comments={comments} />
            <button onClick={toggleModalComments}>Close</button>
          </div>
        </div>
      )}
      {modalReactions && (
        <div className="modal-overlay">
          <div className="modal">
          <h1>Reactions</h1>
            <Reactions reactions={reactions} />
            <button onClick={toggleModalReactions}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
