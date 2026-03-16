import API from "../api/axios";

export const getAllDomaines = async (search = "") => {
  const params = search ? { search, limit: 9999 } : { limit: 9999 };
  const response = await API.get("/domaines", { params });
  return (
    response.data.domaines ||
    response.data.data     ||
    response.data          ||
    []
  );
};

export const getDomaineById = async (id) => {
  const response = await API.get(`/domaines/${id}`);
  return response.data.domaine || response.data || null;
};

export const createDomaine = async (data) => {
  const response = await API.post("/domaines", {
    label: data.label,
    description: data.description,
  });
  return response.data.domaine;
};

export const updateDomaine = async (id, data) => {
  const response = await API.put(`/domaines/${id}`, {
    label: data.label,
    description: data.description,
  });
  return response.data.domaine;
};

export const deleteDomaine = async (id) => {
  const response = await API.delete(`/domaines/${id}`);
  return response.data;
};
