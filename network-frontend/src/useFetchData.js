import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (initialUrl, token) => {
  const [url, setUrl] = useState(initialUrl);
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

  const fetchWithParams = (params) => {
    const newUrl = new URL(url);
    Object.keys(params).forEach((key) => {
      newUrl.searchParams.set(key, params[key]);
    });
    setUrl(newUrl.toString());
  };

  const fetchWithoutParams = () => {
    // Reset the URL to its initial state (without query parameters)
    setUrl(initialUrl);
  };

  return {
    data,
    loading,
    error,
    refetchData,
    fetchData,
    fetchWithParams,
    fetchWithoutParams, // Add the fetchWithoutParams function
  };
};

export default useFetchData;
