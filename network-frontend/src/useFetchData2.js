import axios from "axios";
import { useEffect, useState } from "react";

const useFetchData2 = (initialUrl, params = null, token) => {
    const [url, setUrl] = useState(initialUrl);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const fetchData = async (params) => {
        try {
            const response = await axios.get(url, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
            setLoading(false);
            setTotalPages(response.data.totalPages);
            // console.log(response);
            // console.log(url);
            // console.log(response.data.content);
            return response;
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const fetchDataNewUrl = async (newUrl, params = null) => {
        try {
            const response = await axios.get(newUrl, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
            setLoading(false);
            setTotalPages(response.data.totalPages);
            // console.log(newUrl + response.data);
            return response;
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(params);
    }, []);

    const refetchData = () => {
        fetchData(null);
    };

    const refetchDataParams = (params) => {
        fetchData(params);
    };

    const updateUrl = (newUrl) => {
        setUrl(newUrl);
    };

    return { data, loading, error, totalPages, refetchData, refetchDataParams, updateUrl, fetchDataNewUrl, fetchData };
}

export default useFetchData2;