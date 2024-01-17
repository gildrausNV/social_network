import axios from "axios";
import { useEffect, useState } from "react";

const useFetchData = (initialUrl, token, initialParams) => {
  const [params, setParams] = useState(initialParams);
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (params, cancelToken) => {
    try {
      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken,
      });
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    const fetchDataAndHandleUnmount = async () => {
      await fetchData(params, cancelTokenSource.token);
    };

    fetchDataAndHandleUnmount();

    // Cleanup function
    return () => {
      // Cancel the ongoing request when the component unmounts
      cancelTokenSource.cancel("Component unmounted");
    };
  }, [url, token, params]);

  const updateUrl = (newUrl) => {
    setUrl(newUrl);
  };

  const updateParams = async (newParams) => {
    setParams(newParams);
  };

  return { data, loading, error, totalPages, updateUrl, updateParams, fetchData };
};

export default useFetchData;
