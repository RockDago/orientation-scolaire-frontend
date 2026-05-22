import API from "../api/axios";

const persistUser = (utilisateur) => {
  if (!utilisateur) return;

  if (localStorage.getItem("token")) {
    localStorage.setItem("user", JSON.stringify(utilisateur));
  }

  if (sessionStorage.getItem("token")) {
    sessionStorage.setItem("user", JSON.stringify(utilisateur));
  }
};

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/profile", {
    nom: profileData.nom,
    prenom: profileData.prenom,
    nom_utilisateur: profileData.username || profileData.nom_utilisateur,
    email: profileData.email,
    telephone: profileData.telephone,
    adresse: profileData.adresse,
    code_postal: profileData.code_postal,
  });

  persistUser(response.data.utilisateur);
  return response.data;
};

export const changePassword = async (motDePasseActuel, nouveauMotDePasse) => {
  const response = await API.post("/profile/change-password", {
    mot_de_passe_actuel: motDePasseActuel,
    nouveau_mot_de_passe: nouveauMotDePasse,
  });
  return response.data;
};

export const getLocalUser = () => {
  const userData =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};
