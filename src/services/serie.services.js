import API from "../api/axios";

export const getAllSeries = async (search = "") => {
  const params = search ? { search } : {};
  const response = await API.get("/series", { params });
  return response.data.series;
};

export const getSerieById = async (id) => {
  const response = await API.get(`/series/${id}`);
  return response.data.serie;
};

export const createSerie = async (data) => {
  const response = await API.post("/series", {
    code: data.code,
    label: data.label,
    description: data.description,
  });
  return response.data.serie;
};

export const updateSerie = async (id, data) => {
  const response = await API.put(`/series/${id}`, {
    code: data.code,
    label: data.label,
    description: data.description,
  });
  return response.data.serie;
};

export const deleteSerie = async (id) => {
  const response = await API.delete(`/series/${id}`);
  return response.data;
};
