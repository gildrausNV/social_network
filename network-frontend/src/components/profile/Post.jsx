import { useContext, useState } from "react";
import usePostData from "../../usePostData";
import "./Profile.css";
import { AuthContext } from "../../App";

const Post = ({ post }) => {
  const token = useContext(AuthContext);

  const [comment, setComment] = useState();

  const { loading, error, postDataRequest } = usePostData();

  const apiUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/comment";

  const handleNewPostChange = (event) => {
    setComment(event.target.value);
  };

  const handlePostSubmit = () => {
    postDataRequest(apiUrl, { content: comment }, token);
    setComment("");
  };

  return (
    <div className="post">
      <div className="row header">
        <div className="text-container">
          {post?.creator.firstname} {post?.creator.lastname}
        </div>
        <div className="button-container">
          <button className="delete-btn">Delete</button>
        </div>
      </div>
      <div className="row-content">{post?.content}</div>
      <div className="row">
        <div className="button-container">
          <button className="like-btn">Like({})</button>
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
          {/* Move buttons to the right */}
          <button onClick={handlePostSubmit} className="comment-btn">
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
