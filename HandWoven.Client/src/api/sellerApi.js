import axios from "axios";

const API_URL = "http://localhost:5057/api/seller";

export const registerSeller = async (sellerData) => {
    const token = localStorage.getItem("token");

    return axios.post(`${API_URL}/register`, sellerData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};