import api from "./axios";

export const createProduct = async (productData) => {
    const response = await api.post("/seller/product", productData);
    return response.data;
};

export const getProductById = async (productId) => {
    const response = await api.get(`/seller/product/${productId}`);
    return response.data;
};

export const updateProduct = async (productId, payload) => {
    const response = await api.patch(`/seller/product/${productId}`, payload);
    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await api.delete(`/seller/product/${productId}`);
    return response.data;
};

// Promotions
export const listPromotions = async (productId) => {
    const response = await api.get(`/seller/product/${productId}/promotions`);
    return response.data;
};

export const createPromotion = async (productId, payload) => {
    const response = await api.post(`/seller/product/${productId}/promotions`, payload);
    return response.data;
};

export const deletePromotion = async (productId, promoId) => {
    const response = await api.delete(`/seller/product/${productId}/promotions/${promoId}`);
    return response.data;
};

export const getMyProducts = async () => {
    const response = await api.get("/seller/product/mine");
    return response.data;
};

export const updateProductAvailability = async (productId, isActive) => {
    const response = await api.patch(`/seller/product/${productId}/availability`, { isActive });
    return response.data;
};

export const uploadProductImages = async (productId, files) => {
    const formData = new FormData();
    formData.append("productId", productId);
    files.forEach((file) => formData.append("images", file));

    const response = await api.post("/seller/products/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};
