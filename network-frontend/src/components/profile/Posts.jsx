import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import useFetchData2 from '../../useFetchData2';
import usePostData from '../../usePostData';
import './Posts.css';
import Post from './Post';
import useDeleteData from '../../useDeleteData';

const Posts = ({ id, isCurrentUser, isFollowing, isMainPage }) => {
  const apiUrlPost = 'http://localhost:8080/api/v1/posts';
  const apiUrlUserPosts = 'http://localhost:8080/api/v1/posts/users/' + id;
  const apiUrl = isMainPage ? apiUrlPost : apiUrlUserPosts

  const user = useContext(AuthContext);
  const token = user.token;

  const [newPostContent, setNewPostContent] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');

  const { loading: postLoading, error: postError, response, postDataRequest } = usePostData();

  const { deleteRequest } = useDeleteData();

  const handleNewPostChange = (event) => {
    setNewPostContent(event.target.value);
  };

  const handlePostSubmit = async () => {
    await postDataRequest(apiUrlPost, { content: newPostContent, topic: { name: newTopicContent } }, token);
    setNewPostContent('');
    refetchDataParams({
      size: 2,
      page: currentPage
    });
  };

  const handleNewTopicChange = (event) => {
    setNewTopicContent(event.target.value);
  };


  const [currentPage, setCurrentPage] = useState(0);

  const { data: posts, totalPages, error, loading, updateUrl, fetchDataNewUrl, refetchDataParams } = useFetchData2(apiUrl, {
    size: 2,
    page: currentPage
  }, token);

  useEffect(() => {
    if (!isMainPage) {
      updateUrl('http://localhost:8080/api/v1/posts/users/' + id);
      refetchDataParams({
        size: 2,
        page: currentPage
      });
    }
    refetchDataParams({
      size: 2,
      page: currentPage
    });
  }, [currentPage, id]);

  const deletePost = async (id) => {
    const url = "http://localhost:8080/api/v1/posts/" + id;
    deleteRequest(url, localStorage.getItem("token"));
    refetchDataParams({
      size: 1,
      page: currentPage
    });
  };


  const nextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  return (
    <>
      {(posts?.content.length === 0 && isMainPage) ? <div className='message'>No posts from users you follow</div> : <div className="posts">
        {isCurrentUser && <div className="new-post">
          <div className="topic">
            <label htmlFor="name">Topic:</label>
            <textarea
              className='topic-content'
              name="name"
              id="name"
              cols="30"
              rows="10"
              value={newTopicContent}
              onChange={handleNewTopicChange}
            />
          </div>
          <div className="content">
            <label htmlFor="content">Share your thoughts:</label>
            <textarea
              className='post-content'
              name="content"
              id="content"
              cols="30"
              rows="10"
              value={newPostContent}
              onChange={handleNewPostChange}
            />
          </div>
          <button onClick={handlePostSubmit} disabled={postLoading} className='comment-btn'>
            {postLoading ? 'Posting...' : 'Post'}
          </button>
          {postError && <div>Error: {postError.message}</div>}
        </div>}

        {(posts?.content.length !== 0) && <><div className="pagination">
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

          {posts && posts?.content.map((post, index) => (
            <Post post={post} deletePost={deletePost} isCurrentUser={isCurrentUser} key={index} />
          ))}</>}

        {(!isCurrentUser && posts?.content.length === 0) && <div className='message1'>This user didnt post anything</div>}

        {(isCurrentUser && posts?.content.length === 0) && <div className='message1'>Post something!</div>}

      </div>}</>
  );
};

export default Posts;
