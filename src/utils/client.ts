import axios from 'axios';

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

client.interceptors.response.use((response: any) => {
    if (response.status == 401) {
        document.location = "/401"
    }
    if (response.status == 403) {
        document.location = "/403"
    }
    return response;
}, (error: any) => {
    return error.response;
});

export default client;