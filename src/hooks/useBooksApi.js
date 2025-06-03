import useApi from './useApi';

const useBooksApi = () => {
  const baseUrl = 'https://reactnd-books-api.udacity.com';
  
  const defaultHeaders = {
    'Authorization': 'Bearer zVMvdQMqZ2vjRH3Z284h3gf_bz699sK530',
  };
  
  const api = useApi(baseUrl, defaultHeaders);
  
  const getAllBooks = () => api.get('/books');
  
  const getBookById = (id) => api.get(`/books/${id}`);
  
  const createBook = (bookData) => api.post('/books', bookData);
  
  const updateBook = (id, bookData) => api.put(`/books/${id}`, bookData);
  
  const deleteBook = (id) => api.delete(`/books/${id}`);
  
  const searchBooks = (query) => api.get(`/search?q=${encodeURIComponent(query)}`);
  
  return {
    ...api, // Incluimos todas las propiedades y métodos del hook base
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks
  };
};

export default useBooksApi;
