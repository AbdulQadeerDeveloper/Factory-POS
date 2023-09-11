import { useState, useEffect } from 'react';
import axios from '../Components/AxiosInstance'

const useAxios = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (url, method, body = null) => {
    try {
      setLoading(true);
      const response = await axios({
        method,
        url,
        data: body,
      });
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const post = async (url, body) => {
    await fetchData(url, 'post', body);
  };

  const put = async (url, body) => {
    await fetchData(url, 'put', body);
  };

  const remove = async (url) => {
    await fetchData(url, 'delete');
  };

  return { data, loading, error, post, put, remove };
};

export default useAxios;
