import api from "./axios";

export const getMyProfile = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

export const updateMyProfile = async (payload) => {
  const response = await api.patch("/user/me", payload);
  return response.data;
};

export const uploadMyProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/user/me/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
