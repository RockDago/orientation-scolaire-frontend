import API from "../api/axios";

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data.utilisateur;
};

/**
 * Mettre à jour les infos personnelles du profil
 * @param {object} profileData - nom, prenom, nom_utilisateur, email, telephone, adresse, code_postal
 */
export const updateProfile = async (profileData) => {
  const response = await API.put("/profile", {
    nom: profileData.nom,
    prenom: profileData.prenom,
    nom_utilisateur: profileData.username,
    email: profileData.email,
    telephone: profileData.telephone,
    adresse: profileData.adresse,
    code_postal: profileData.code_postal,
  });

  const utilisateur = response.data.utilisateur;

  localStorage.setItem("user", JSON.stringify(utilisateur));
  sessionStorage.setItem("user", JSON.stringify(utilisateur));

  return utilisateur;
};

/**
 * Changer le mot de passe
 * @param {string} motDePasseActuel
 * @param {string} nouveauMotDePasse
 */
export const changePassword = async (motDePasseActuel, nouveauMotDePasse) => {
  const response = await API.post("/profile/change-password", {
    mot_de_passe_actuel: motDePasseActuel,
    nouveau_mot_de_passe: nouveauMotDePasse,
  });
  return response.data;
};

/**
 * Récupérer l'utilisateur depuis le localStorage
 */
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
