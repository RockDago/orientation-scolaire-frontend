import API from "../api/axios";

export const getAllUsers = async (params = {}) => {
  const response = await API.get("/users", {
    params: { limit: 9999, ...params },
  });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await API.post("/users", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

export const toggleUserStatus = async (id, estActif) => {
  const response = await API.patch(`/users/${id}/status`, {
    est_actif: estActif ? 1 : 0,
  });
  return response.data;
};

export const resetUserPassword = async (id, password) => {
  const response = await API.patch(`/users/${id}/password`, {
    mot_de_passe: password,
  });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};
