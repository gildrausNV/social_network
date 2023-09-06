import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url, token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, token]);

  const refetchData = () => {
    fetchData();
  };

  return { data, loading, error, refetchData };
};

export default useFetchData;
