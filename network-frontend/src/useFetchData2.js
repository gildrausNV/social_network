import axios from "axios";
import { useEffect, useState } from "react";

const useFetchData2 = (initialUrl, params = null, token) => {
    const [url, setUrl] = useState(initialUrl);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            return response;
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const fetchDataNewUrl = async (newUrl) => {
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
            setLoading(false);
            // console.log(newUrl + response.data);
            return response;
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(params);
    }, [token, params]);

    const refetchData = (newParams) => {
        fetchData(newParams);
    };

    const updateUrl = (newUrl) => {
        setUrl(newUrl);
    };

    return { data, loading, error, refetchData, updateUrl, fetchDataNewUrl };
}

export default useFetchData2;