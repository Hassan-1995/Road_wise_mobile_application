import { create } from "apisauce";

const apiClient = create({
    baseURL: "http://192.168.100.4:8080",
//     timeout: 10000, // 10 seconds
//     headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
});

export default apiClient;