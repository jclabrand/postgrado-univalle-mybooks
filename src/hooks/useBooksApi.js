import useApi from './useApi';

const useBooksApi = () => {
  const baseUrl = 'https://reactnd-books-api.udacity.com';
  
  const defaultHeaders = {
    'Authorization': 'Bearer zVMvdQMqZ2vjRH3Z284h3gf_bz699sK530',
  };
  
  const api = useApi(baseUrl, defaultHeaders);
  
  const getAllBooks = () => api.get('/books');
  
  const getBookById = (id) => api.get(`/books/${id}`);
  
  const searchBooks = (query) => api.post('/search', { query });
  
  return {
    ...api, // Incluimos todas las propiedades y métodos del hook base
    getAllBooks,
    getBookById,
    searchBooks
  };
};

export default useBooksApi;
