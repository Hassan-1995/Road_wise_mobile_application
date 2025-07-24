import { create } from "apisauce";

const apiClient = create({
    baseURL: "http://192.168.100.4:3000",
});

export default apiClient;