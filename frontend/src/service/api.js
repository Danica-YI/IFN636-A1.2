import axios from 'axios';

const API = axios.create({
     //baseURL: "http://localhost:5001/"// local server
    baseURL: 'http://16.176.208.163/api',// EC2
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