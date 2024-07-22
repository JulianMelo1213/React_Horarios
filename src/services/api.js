// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5074/api', // Ajusta la URL base según tu API
});

export default api;
