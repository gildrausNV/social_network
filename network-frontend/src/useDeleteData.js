import { useState } from 'react';
import axios from 'axios';

const useDeleteData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');

  const deleteRequest = async (url, token = null) => {
    setLoading(true);
    setError(null);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.delete(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          });
        //   setPosts(posts.filter((post) => post.id != id))
        console.log(response)
        } catch (error) {
          console.error('Post failed:', error);
          throw error;
    }
  };

  return { loading, error, response, deleteRequest };
};

export default useDeleteData;
