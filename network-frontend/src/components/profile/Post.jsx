import { useContext, useEffect, useState } from "react";
import usePostData from "../../usePostData";
import "./Profile.css";
import { AuthContext } from "../../App";
import axios from "axios";
import useFetchData from "../../useFetchData";

const Post = ({ post, deletePost, isCurrentUser }) => {
  const token = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState();
  const { loading, error, postDataRequest } = usePostData();
  const [comments, setComments] = useState();

  const getCommentsUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/comments";
  const commentUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/comment";
  const likeUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/like";

  // const { data } = useFetchData(getCommentsUrl, token);
  // console.log(data)

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
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    };
    getComments();
  }, [comment]);

  // console.log(comments);

  const handleNewPostChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    postDataRequest(commentUrl, { content: comment }, token);
    setComment("");
  };

  // const handleLikeClick = () => {
  //   postDataRequest(apiUrl, { content: comment }, token);
  //   setComment("");
  // };


  return (
    <div className="post">
      <div className="row header">
        <div className="text-container">
          {post?.creator.firstname} {post?.creator.lastname}
        </div>
        {isCurrentUser ? <div className="button-container">
          <button className="delete-btn" onClick={() => deletePost(post.id)}>Delete</button>
        </div> : <div className="button-container">
          <button className="delete-btn" onClick={() => alert(post.id + " dodaj funkciju za report")}>Report</button>
        </div>}
      </div>
      <div className="row-content">{post?.content}</div>
      <div className="row">
        <div className="button-container">
          <button className="like-btn">👍</button>
          <button className="like-btn">😂</button>
          <button className="like-btn">😡</button>
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
          <div className="text-container" style={{ paddingLeft: '60%' }}>
            <u style={{ color: 'blue' }} onClick={() => setShowComments(!showComments)}>Show comments</u>
          </div>
        </div>
        {showComments &&
          <div className="comments">
              {comments && comments?.map((comment) => (
                <div className="comment">
                  {comment.creator.username} : {comment.content}
                </div>
              ))}
          </div>
        }
      </div>
    </div>
  );
};

export default Post;
