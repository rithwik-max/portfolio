import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend.onrender.com/api'
});

export default api;