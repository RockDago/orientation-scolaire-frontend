import API from "../api/axios";

export const getAllParcours = async (params = {}) => {
  const response = await API.get("/parcours", { params });
  return response.data;
};

export const getParcoursById = async (id) => {
  const response = await API.get(`/parcours/${id}`);
  return response.data;
};

export const createParcours = async (data) => {
  const response = await API.post("/parcours", {
    label: data.label,
    mention: data.mention,
    mentionId: data.mentionId,
    duree: data.duree,
    niveau: data.niveau,
    conditions: data.conditions,
    description: data.description,
    objectifs: data.objectifs,
    debouches: data.debouches,
  });
  return response.data;
};

export const updateParcours = async (id, data) => {
  const response = await API.put(`/parcours/${id}`, {
    label: data.label,
    mention: data.mention,
    mentionId: data.mentionId,
    duree: data.duree,
    niveau: data.niveau,
    conditions: data.conditions,
    description: data.description,
    objectifs: data.objectifs,
    debouches: data.debouches,
  });
  return response.data;
};

export const deleteParcours = async (id) => {
  const response = await API.delete(`/parcours/${id}`);
  return response.data;
};
