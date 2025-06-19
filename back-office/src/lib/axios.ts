import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
export const axiosAuthInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// "use client";

// import axios from "axios";
// import { jwtDecode } from "jwt-decode";


// export const axiosAuthInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
//   withCredentials: true,
// });

// export const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL,
//     withCredentials: true
// });

// const getAccessToken = () => {
//     return sessionStorage.getItem('token');
// };

// const setAccessToken = (token : string) => {
//     sessionStorage.setItem('token', token);
// };

// axiosInstance.interceptors.request.use(async (config) => {
//     let token = getAccessToken();
//     if (!token) return config;

//     try {
//         const decoded = jwtDecode<{exp:number}>(token);
//         const currentTime = Date.now() / 1000;
        
//         if (decoded.exp < currentTime) {
//             const response = await axiosAuthInstance.get('/refresh-token');
//             setAccessToken(response.data.accessToken);
//             token = response.data.accessToken;
//         }
//     } catch (error) {
//         console.error('Error decoding token:', error);
//     }
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

