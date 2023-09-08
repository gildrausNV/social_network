import { useState } from 'react';
import axios from 'axios';

const usePostData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postDataRequest = async (url, postData, token = null) => {
    setLoading(true);
    setError(null);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(url, postData, { headers });

      setLoading(false);
      
      console.log(response.data);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.log(error)
    }
  };

  return { loading, error, postDataRequest };
};

export default usePostData;
