import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import useFetchData from '../../useFetchData';
import usePostData from '../../usePostData';
import './Posts.css';
import Post from './Post';
import axios from 'axios';

const Posts = ({ id, isCurrentUser }) => {
  const apiUrl = 'http://localhost:8080/api/v1/posts/users/' + id;
  const apiUrlPost = 'http://localhost:8080/api/v1/posts';
  const token = useContext(AuthContext);
  


  // const { data, loading, error, refetchData } = useFetchData(apiUrl, token);

  const [newPostContent, setNewPostContent] = useState('');

  const { loading: postLoading, error: postError, response, postDataRequest } = usePostData();

  const handleNewPostChange = (event) => {
    setNewPostContent(event.target.value);
  };

  const handlePostSubmit = async () => {
    const x = await postDataRequest(apiUrlPost, { content: newPostContent }, token);
    // console.log(response?.data);
    setNewPostContent('');
    // setPosts([...posts, response?.data])
  };

  // console.log(data)

  // useEffect(() => {
  //   // Fetch data again after a new post is submitted successfully
  //   if (!postLoading && !postError && newPostContent === '') {
  //     refetchData();
  //   }
  // }, [postLoading, postError, newPostContent, refetchData]);

  const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const getPosts = async () => {
          try {
            const response = await axios.get(
              "http://localhost:8080/api/v1/posts/users/" + id,
              {
                params: {
                  size: 1,
                  page: currentPage,
                },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
          } catch (error) {
            console.error("Login failed:", error);
            throw error;
          }
        };
        getPosts();
        
      }, [currentPage]);
      
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  const deletePost = async (id) => {
    try {
        const response = await axios.delete('http://localhost:8080/api/v1/posts/' + id,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        setPosts(posts.filter((post) => post.id!=id))
    } catch (error) {
        console.error('Post failed:', error);
        throw error;
    }
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
    
    {posts!=null && posts?.map((post, index) => (
      <Post post = {post} deletePost={deletePost} isCurrentUser={isCurrentUser} key={index}/>
    ))}
  </div>

  );
};

export default Posts;
