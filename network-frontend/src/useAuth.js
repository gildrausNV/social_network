import { useState } from 'react';
import axios from 'axios';

const usePostData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');

  const authRequest = async (url, postData) => {
    setLoading(true);
    setError(null);

    try {
        {}
      const response = await axios.post(url, postData);

      setLoading(false);
      
      console.log(response.data);
      setResponse(response);
    //   return response;
    } catch (error) {
      setError(error);
      setLoading(false);
      console.log(error)
    }
  };

  return { loading, error, response, authRequest };
};

export default usePostData;
