import API from "../api/axios";

export const login = async (identifiant, motDePasse) => {
  const response = await API.post("/login", {
    nom_utilisateur: identifiant,
    mot_de_passe: motDePasse,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userRole");
};

export const getCurrentUser = () => {
  const userData =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return Boolean(token);
};

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/profile", profileData);
  return response.data;
};
