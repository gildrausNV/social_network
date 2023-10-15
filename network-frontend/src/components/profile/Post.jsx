import { useContext, useEffect, useState } from "react";
import usePostData from "../../usePostData";
import "./Profile.css";
import { AuthContext } from "../../App";
import Comments from "./Comments";
import Reactions from "./Reactions";
import useFetchData2 from "../../useFetchData2";

const Post = ({ post, deletePost, isCurrentUser }) => {
  const user = useContext(AuthContext);
  const token = user.token;
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState();
  const { loading, error, postDataRequest } = usePostData();
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const [currentPage, setCurrentPage] = useState(0);

  const commentUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/comment";
  const reactionUrl = "http://localhost:8080/api/v1/posts/" + post.id + '/react';
  const reportUrl = "http://localhost:8080/api/v1/reports/post/" + post.id;

  const getReactionsUrl = `http://localhost:8080/api/v1/posts/${post.id}/reactions`;
  const { data: reactions, loading: reactionsLoading, refetchData: refetchReactions, updateUrl: updateReactionsUrl, fetchDataNewUrl: fetchDataNewUrlReactions } = useFetchData2(getReactionsUrl, null, token);
  const getCommentsUrl = `http://localhost:8080/api/v1/posts/${post.id}/comments`;
  const params = isCurrentUser ? { size: 3, currentPage: currentPage } : null;
  const { data: comments, loading: commentsLoading, totalPages, refetchData: refetchComments, updateUrl: updateCommentsUrl, fetchDataNewUrl: fetchDataNewUrlComments, refetchDataParams } = useFetchData2(getCommentsUrl, params, token);

  // console.log(comments)

  useEffect(() => {
    refetchDataParams({
      size: 3,
      page: currentPage
    });
  }, [currentPage]);

  const nextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const handleNewPostChange = (event) => {
    setComment(event.target.value);
  };

  const handleReactionSubmit = (reaction) => {
    postDataRequest(reactionUrl, { reactionType: reaction }, token);
    window.location.reload();
  }

  const handleCommentSubmit = () => {
    postDataRequest(commentUrl, { content: comment }, token);
    setComment("");
    window.location.reload();
  }

  const handleReportSubmit = () => {
    postDataRequest(reportUrl, null, token);
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
        {(isCurrentUser || isAdmin) ? <div className="button-container">
          <button className="delete-btn" onClick={() => deletePost(post.id)}>Delete</button>
        </div> : <div className="button-container">
          <button className="delete-btn" onClick={() => handleReportSubmit()}>Report</button>
        </div>}
      </div>
      {post?.trend.topic && <div className="row-topic">{post?.trend.topic}</div>}
      <div className="row-content">{post?.content}</div>
      <div className="row">
        {!isCurrentUser ? <><div className="button-container">
          <><button className="like-btn" onClick={() => handleReactionSubmit('LIKE')}>👍</button>
            <button className="like-btn" onClick={() => handleReactionSubmit('ANGRY')}>😡</button>
            <button className="like-btn" onClick={() => handleReactionSubmit('LOVE')}>😍</button>
            <button className="like-btn" onClick={() => handleReactionSubmit('SAD')}>😭</button>
          </>
          <div className="text-container" style={{ paddingLeft: '40%' }}>
            <u style={{ color: 'blue' }} onClick={toggleModalReactions}>Show reactions({reactions?.content.length})</u>
          </div>
        </div></> : <><div className="button-container" style={{ width: '1100px', padding: '5px' }}>
          <>
          </>
          <div className="text-container" style={{ paddingLeft: '40%' }}>
            <u style={{ color: 'blue' }} onClick={toggleModalReactions}>Show reactions({reactions?.content.length})</u>
          </div>
        </div></>}


      </div>
      {isCurrentUser ? <>
        <div className="pagination">
          <button
            onClick={previousPage}
            disabled={currentPage === 0}
            className="pagination-button"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="pagination-button"
          >
            Next
          </button>
        </div>
        <div className="comments-container">
          {comments?.content.map((comment, index) => (
            <div className="comment" key={index}>
              <div className="comment-details">
                <p className="comment-content">{comment.creator.username}: {comment.content}</p>
              </div>
            </div>
          ))}
        </div>


      </> : <>
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
              <u style={{ color: 'blue' }} onClick={() => setModalComments(!showComments)}>Show comments({comments?.content.length})</u>
            </div>
          </div>
        </div>
      </>}
      {modalComments && (
        <div className="modal-overlay">
          <div className="modal">
            <h1>Comments</h1>
            <Comments comments={comments.content} />
            <button onClick={toggleModalComments}>Close</button>
          </div>
        </div>
      )}
      {modalReactions && (
        <div className="modal-overlay">
          <div className="modal">
            <h1>Reactions</h1>
            <Reactions reactions={reactions.content} />
            <button onClick={toggleModalReactions}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
