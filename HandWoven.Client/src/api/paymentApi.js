// import axios from "axios";
import api from "./axios";

export const createPaymentIntent = async(amount) => {
    const amountInCents = Math.round(amount * 100);
    const res = await api.post("/payment/create-intent",
        { amount: amountInCents },
        { withCredentials: true }
    );

    return res.data;
};