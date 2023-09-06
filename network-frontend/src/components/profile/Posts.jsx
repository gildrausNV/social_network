import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import useFetchData from '../../useFetchData';
import usePostData from '../../usePostData';
import './Profile.css';
import Post from './Post';

const Posts = ({ id }) => {
  const apiUrl = 'http://localhost:8080/api/v1/posts/users/' + id;
  const apiUrlPost = 'http://localhost:8080/api/v1/posts';
  const token = useContext(AuthContext);

  const { data, loading, error, refetchData } = useFetchData(apiUrl, token);

  const [newPostContent, setNewPostContent] = useState('');

  const { loading: postLoading, error: postError, postDataRequest } = usePostData();

  const handleNewPostChange = (event) => {
    setNewPostContent(event.target.value);
  };

  const handlePostSubmit = () => {
    postDataRequest(apiUrlPost, { content: newPostContent }, token);
    setNewPostContent('');
  };

  // useEffect(() => {
  //   // Fetch data again after a new post is submitted successfully
  //   if (!postLoading && !postError && newPostContent === '') {
  //     refetchData();
  //   }
  // }, [postLoading, postError, newPostContent, refetchData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="posts">
      <div className="new-post">
        <textarea
          name="content"
          id="content"
          cols="30"
          rows="10"
          value={newPostContent}
          onChange={handleNewPostChange}
        />
        <button onClick={handlePostSubmit} disabled={postLoading}>
          {postLoading ? 'Posting...' : 'Post'}
        </button>
        {postError && <div>Error: {postError.message}</div>}
      </div>

    {data?.content.map((post, index) => (
      <Post post = {post} key={index}/>
    ))}
  </div>

  );
};

export default Posts;
