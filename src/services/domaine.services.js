import API from "../api/axios";

export const getAllDomaines = async (params = {}) => {
  const response = await API.get("/domaines", { params });
  return response.data;
};

export const getDomaineById = async (id) => {
  const response = await API.get(`/domaines/${id}`);
  return response.data;
};

export const createDomaine = async (data) => {
  const response = await API.post("/domaines", {
    label: data.label,
    description: data.description,
  });
  return response.data;
};

export const updateDomaine = async (id, data) => {
  const response = await API.put(`/domaines/${id}`, {
    label: data.label,
    description: data.description,
  });
  return response.data;
};

export const deleteDomaine = async (id) => {
  const response = await API.delete(`/domaines/${id}`);
  return response.data;
};
