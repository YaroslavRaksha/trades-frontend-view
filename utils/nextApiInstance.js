import axios from 'axios';

const nextApiInstance = axios.create({
    baseURL: 'http://localhost:3000/', // 'https://trades-frontend.vercel.app'
    headers: {
        'Content-Type': 'application/json',
    }
});

export default nextApiInstance;
