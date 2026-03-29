import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
});

//adding JWT token automatically on each request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;