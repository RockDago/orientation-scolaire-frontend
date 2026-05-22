import API from "../api/axios";

export const getAllEtablissements = async (params = {}) => {
  const response = await API.get("/etablissements", { params });
  return response.data;
};

export const getEtablissementById = async (id) => {
  const response = await API.get(`/etablissements/${id}`);
  return response.data;
};

export const getEtablissementsByRegion = async (region) => {
  const response = await API.get("/etablissements", {
    params: { region, limit: 9999 },
  });
  return response.data;
};

export const getEtablissementsByMention = async (mention) => {
  const response = await API.get("/etablissements", {
    params: { mention, limit: 9999 },
  });
  return response.data;
};

export const getEtablissementsByRegionAndMention = async (region, mention) => {
  const response = await API.get("/etablissements", {
    params: { region, mention, limit: 9999 },
  });
  return response.data;
};

export const recordEtablissementSelection = async (
  metierLabel,
  region,
  etablissementNom,
  visitorId = null,
  clientInfo = null,
) => {
  const response = await API.post("/track-etablissement-selection", {
    metier_label: metierLabel,
    region,
    etablissement_nom: etablissementNom,
    visitor_id: visitorId,
    client_info: clientInfo,
  });
  return response.data;
};

export const createEtablissement = async (data) => {
  const response = await API.post("/etablissements", {
    nom: data.nom,
    province: data.province,
    region: data.region,
    type: data.type,
    description: data.description,
    email: data.email,
    mention: data.mention,
    domaine: data.domaine,
    parcours: data.parcours,
    metier: data.metier,
    niveau: data.niveau,
    duree: data.duree,
    admission: data.admission,
    contact: data.contact,
  });
  return response.data;
};

export const updateEtablissement = async (id, data) => {
  const response = await API.put(`/etablissements/${id}`, {
    nom: data.nom,
    province: data.province,
    region: data.region,
    type: data.type,
    description: data.description,
    email: data.email,
    mention: data.mention,
    domaine: data.domaine,
    parcours: data.parcours,
    metier: data.metier,
    niveau: data.niveau,
    duree: data.duree,
    admission: data.admission,
    contact: data.contact,
  });
  return response.data;
};

export const deleteEtablissement = async (id) => {
  const response = await API.delete(`/etablissements/${id}`);
  return response.data;
};
