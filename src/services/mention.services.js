import API from "../api/axios";

export const getAllMentions = async (params = {}) => {
  const response = await API.get("/mentions", { params });
  return response.data;
};

export const getMentionById = async (id) => {
  const response = await API.get(`/mentions/${id}`);
  return response.data;
};

export const createMention = async (data) => {
  const response = await API.post("/mentions", {
    label: data.label,
    description: data.description,
    domaine_id: data.domaine_id,
  });
  return response.data;
};

export const updateMention = async (id, data) => {
  const response = await API.put(`/mentions/${id}`, {
    label: data.label,
    description: data.description,
    domaine_id: data.domaine_id,
  });
  return response.data;
};

export const deleteMention = async (id) => {
  const response = await API.delete(`/mentions/${id}`);
  return response.data;
};
