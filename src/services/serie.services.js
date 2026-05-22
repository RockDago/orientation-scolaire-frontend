import API from "../api/axios";

export const getAllSeries = async (params = {}) => {
  const response = await API.get("/series", { params });
  return response.data;
};

export const getSerieById = async (id) => {
  const response = await API.get(`/series/${id}`);
  return response.data;
};

export const createSerie = async (data) => {
  const response = await API.post("/series", {
    code: data.code,
    label: data.label,
    description: data.description,
  });
  return response.data;
};

export const updateSerie = async (id, data) => {
  const response = await API.put(`/series/${id}`, {
    code: data.code,
    label: data.label,
    description: data.description,
  });
  return response.data;
};

export const deleteSerie = async (id) => {
  const response = await API.delete(`/series/${id}`);
  return response.data;
};
