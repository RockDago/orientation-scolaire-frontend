import API from "../api/axios";
import { trackMetierSearch } from "./dashboard.services";

export const getAllMetiers = async (params = {}) => {
  const response = await API.get("/metiers", { params });
  return response.data;
};

export const getMetierById = async (id) => {
  const response = await API.get(`/metiers/${id}`);
  return response.data;
};

export const searchMetier = async (metierId, metierLabel) =>
  trackMetierSearch(metierId, metierLabel);

export const createMetier = async (data) => {
  const response = await API.post("/metiers", {
    label: data.label,
    description: data.description,
    parcours: data.parcours,
    mention: data.mention,
    domaine: data.domaine,
    serie: data.serie,
    niveau: data.niveau,
    parcoursFormation: data.parcoursFormation,
  });
  return response.data;
};

export const updateMetier = async (id, data) => {
  const response = await API.put(`/metiers/${id}`, {
    label: data.label,
    description: data.description,
    parcours: data.parcours,
    mention: data.mention,
    domaine: data.domaine,
    serie: data.serie,
    niveau: data.niveau,
    parcoursFormation: data.parcoursFormation,
  });
  return response.data;
};

export const deleteMetier = async (id) => {
  const response = await API.delete(`/metiers/${id}`);
  return response.data;
};
