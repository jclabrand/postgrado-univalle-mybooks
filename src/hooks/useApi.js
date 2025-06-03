import { useState, useCallback } from 'react';

const useApi = (baseUrl, defaultHeaders = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const prepareRequest = useCallback((method, headers = {}, body = null) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...headers
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  }, [defaultHeaders]);

  const fetchApi = useCallback(async (endpoint, options) => {
    const url = `${baseUrl}${endpoint}`;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message || 'Error al realizar la petición');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const get = useCallback((endpoint, headers = {}) => {
    const options = prepareRequest('GET', headers);
    return fetchApi(endpoint, options);
  }, [fetchApi, prepareRequest]);

  const post = useCallback((endpoint, body, headers = {}) => {
    const options = prepareRequest('POST', headers, body);
    return fetchApi(endpoint, options);
  }, [fetchApi, prepareRequest]);

  const put = useCallback((endpoint, body, headers = {}) => {
    const options = prepareRequest('PUT', headers, body);
    return fetchApi(endpoint, options);
  }, [fetchApi, prepareRequest]);

  const del = useCallback((endpoint, headers = {}) => {
    const options = prepareRequest('DELETE', headers);
    return fetchApi(endpoint, options);
  }, [fetchApi, prepareRequest]);

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    delete: del, // Renombramos porque 'delete' es una palabra reservada
    setData,
    setError
  };
};

export default useApi;
