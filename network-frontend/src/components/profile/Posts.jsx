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

  const { loading: postLoading, error: postError, response, postDataRequest } = usePostData();

  const { deleteRequest } = useDeleteData();

  const handleNewPostChange = (event) => {
    setNewPostContent(event.target.value);
  };

  const handlePostSubmit = async () => {
    await postDataRequest(apiUrlPost, { content: newPostContent }, token);
    setNewPostContent('');
  };


  const [currentPage, setCurrentPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const { data: posts, error, loading, updateUrl, fetchDataNewUrl, refetchDataParams } = useFetchData2(apiUrl, {
    size: 2,
    page: currentPage
  }, token);

  useEffect(() => {
    refetchDataParams({
      size: 2,
      page: currentPage
    });
    setTotalPages(posts?.totalPages);
  }, [currentPage]);

  useEffect(() => {
    if (!isMainPage) {
      updateUrl('http://localhost:8080/api/v1/posts/users/' + id);
      refetchDataParams({
        size: 2,
        page: currentPage
      });
    }
  }, [id])


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
    <div className="posts">
      {isCurrentUser && <div className="new-post">
        Share your thoughts:
        <textarea
          name="content"
          id="content"
          cols="30"
          rows="10"
          value={newPostContent}
          onChange={handleNewPostChange}
        />
        <button onClick={handlePostSubmit} disabled={postLoading} className='comment-btn'>
          {postLoading ? 'Posting...' : 'Post'}
        </button>
        {postError && <div>Error: {postError.message}</div>}
      </div>}
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
      {posts != null && posts?.content.map((post, index) => (
        <Post post={post} deletePost={deletePost} isCurrentUser={isCurrentUser} key={index} />
      ))}
    </div>

  );
};

export default Posts;
