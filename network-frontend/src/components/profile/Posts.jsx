import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import useFetchData from '../../useFetchData';
import useFetchData2 from '../../useFetchData2';
import usePostData from '../../usePostData';
import './Posts.css';
import Post from './Post';
import axios from 'axios';
import useDeleteData from '../../useDeleteData';

const Posts = ({ id, isCurrentUser, isFollowing }) => {
  const apiUrl = 'http://localhost:8080/api/v1/posts/users/' + id;
  const apiUrlPost = 'http://localhost:8080/api/v1/posts';
  const token = useContext(AuthContext);

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


  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [params, setParams] = useState({
    size: 1,
    page: currentPage,
  });

  const { data, refetchData } = useFetchData2(apiUrl, params, token);

  useEffect(() => {
    refetchData({
      size: 1,
      page: currentPage,
    });
    console.log(data);
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      setPosts(data.content);
      console.log(data.content)
      setTotalPages(data.totalPages);
    }
  }, [data]);


  const deletePost = async (id) => {
    const url = "http://localhost:8080/api/v1/posts/" + id;
    deleteRequest(url, localStorage.getItem("token"));
    setPosts(posts.filter((post) => post.id != id))
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

      {posts != null && posts?.map((post, index) => (
        <Post post={post} deletePost={deletePost} isCurrentUser={isCurrentUser} key={index} />
      ))}
    </div>

  );
};

export default Posts;
