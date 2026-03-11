// src/pages/dashboard/view/profileView.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaClock,
  FaEdit,
  FaPhone,
  FaCamera,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaLock,
  FaSave,
  FaUserCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getProfile,
  updateProfile,
  getLocalUser,
} from "../../../services/profile.services";

const ProfileView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // Charger le profil depuis l'API au montage du composant
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Essayer d'abord depuis le localStorage pour un affichage immédiat
        const localUser = getLocalUser();
        if (localUser) setUserData(localUser);

        // Puis récupérer la version fraîche depuis l'API
        const apiUser = await getProfile();
        setUserData(apiUser);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token invalide, rediriger vers login
          setAuthError(true);
          showToast("Session expirée, veuillez vous reconnecter", "error");
          navigate("/login");
          return;
        }
        showToast("Impossible de charger le profil", "error");
        console.error("Erreur chargement profil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("L'image ne doit pas dépasser 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      showToast("Photo de profil mise à jour", "success");
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { key: "personal", label: "Informations" },
    { key: "security", label: "Sécurité" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Chargement du profil...</span>
        </div>
      </div>
    );
  }

  if (!userData && !authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-sm text-gray-500">Profil introuvable.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <ToastContainer />

      <div className="max-w-5xl mx-auto p-6">
        {/* En-tête du profil */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-5">
          <div className="flex items-center gap-5 flex-wrap">
            {/* Avatar avec upload */}
            <div
              className="cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="relative inline-block">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-white">
                      {userData.prenom?.[0]}
                      {userData.nom?.[0]}
                    </span>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                    <FaCamera className="w-[18px] h-[18px] text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="absolute inset-[-3px] rounded-full border-2 border-blue-500/40" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Informations utilisateur */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900 m-0">
                  {userData.prenom} {userData.nom}
                </h1>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium ml-2">
                  {userData.role}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <FaUserCircle className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  @{userData.nom_utilisateur}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block shadow-sm shadow-green-500/20" />
                <span className="text-xs text-gray-500">En ligne</span>
              </div>

              {userData.adresse && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {userData.adresse}
                  </span>
                </div>
              )}
            </div>

            {/* Badge email vérifié */}
            <div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Vérifié
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale avec onglets */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Navigation par onglets */}
          <div className="flex border-b border-gray-200 px-5 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`py-3.5 px-5 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.key
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu de l'onglet */}
          <div className="p-6">
            {activeTab === "personal" && (
              <PersonalInfoForm
                userData={userData}
                setUserData={setUserData}
                showToast={showToast}
              />
            )}
            {activeTab === "security" && (
              <SecurityForm userData={userData} showToast={showToast} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Composant Informations Personnelles ─────────────────────────────────────
const PersonalInfoForm = ({ userData, setUserData, showToast }) => {
  const [editInfo, setEditInfo] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);

  const [formData, setFormData] = useState({
    username: userData.nom_utilisateur || "",
    nom: userData.nom || "",
    prenom: userData.prenom || "",
    email: userData.email || "",
    telephone: userData.telephone || "",
    code_postal: userData.code_postal || "",
    adresse: userData.adresse || "",
    role: userData.role || "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateInfoForm = () => {
    const newErrors = {};
    if (!formData.username?.trim()) newErrors.username = "Requis";
    if (!formData.nom.trim()) newErrors.nom = "Requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email invalide";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (!validateInfoForm()) return;
    setLoadingInfo(true);
    try {
      const updated = await updateProfile(formData);
      setUserData(updated);
      showToast("Informations mises à jour avec succès", "success");
      setEditInfo(false);
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      showToast(message, "error");
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    if (!validateContactForm()) return;
    setLoadingContact(true);
    try {
      const updated = await updateProfile(formData);
      setUserData(updated);
      showToast("Contacts mis à jour avec succès", "success");
      setEditContact(false);
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      showToast(message, "error");
    } finally {
      setLoadingContact(false);
    }
  };

  return (
    <>
      {/* Section Informations personnelles */}
      <form onSubmit={handleSubmitInfo}>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-900 m-0">
              Informations personnelles
            </h3>
            <button
              type="button"
              className="text-blue-600 text-sm font-medium flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => {
                setEditInfo(!editInfo);
                setErrors({});
              }}
            >
              <FaEdit size={12} />
              {editInfo ? "Annuler" : "Modifier"}
            </button>
          </div>

          {!editInfo ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Nom d&apos;utilisateur
                </label>
                <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                  <FaUserCircle className="text-gray-400" size={12} />
                  {userData.nom_utilisateur || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Rôle
                </label>
                <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                  <FaUserTag className="text-gray-400" size={12} />
                  {userData.role || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Nom
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.nom || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Prénom
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.prenom || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Adresse
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.adresse || "—"}
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1 font-medium uppercase tracking-wider">
                  Code postal
                </label>
                <span className="text-sm text-gray-700 font-medium">
                  {userData.code_postal || "—"}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                  Nom d&apos;utilisateur *
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUserCircle size={14} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 pl-8 bg-white border rounded-lg text-sm text-gray-900 transition-all duration-200 ${
                      errors.username ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="nom_utilisateur"
                  />
                </div>
                {errors.username && (
                  <div className="text-[11px] text-red-500 mt-1">
                    {errors.username}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                  Rôle
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUserTag size={14} />
                  </div>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    className="w-full p-2.5 pl-8 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  Non modifiable
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-white border rounded-lg text-sm text-gray-900 transition-all duration-200 ${
                    errors.nom ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Ex: Rakoto"
                />
                {errors.nom && (
                  <div className="text-[11px] text-red-500 mt-1">
                    {errors.nom}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-white border rounded-lg text-sm text-gray-900 transition-all duration-200 ${
                    errors.prenom ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Ex: Jean"
                />
                {errors.prenom && (
                  <div className="text-[11px] text-red-500 mt-1">
                    {errors.prenom}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                  Adresse
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 transition-all duration-200"
                  placeholder="123 Rue Exemple, Antananarivo"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                  Code postal
                </label>
                <input
                  type="text"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 transition-all duration-200"
                  placeholder="101"
                />
              </div>
            </div>
          )}

          {editInfo && (
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                className="px-5 py-2.5 bg-transparent text-gray-500 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-600 transition-all"
                onClick={() => {
                  setEditInfo(false);
                  setErrors({});
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loadingInfo}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50 transition-all"
              >
                {loadingInfo ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaSave size={12} />
                )}
                Enregistrer
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Section Contacts */}
      <form onSubmit={handleSubmitContact}>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-900 m-0">
              Contacts
            </h3>
            <button
              type="button"
              className="text-blue-600 text-sm font-medium flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => {
                setEditContact(!editContact);
                setErrors({});
              }}
            >
              <FaEdit size={12} />
              {editContact ? "Annuler" : "Modifier"}
            </button>
          </div>

          {/* Téléphone */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-200">
            <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaPhone className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                Téléphone
              </div>
              {editContact ? (
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 transition-all duration-200"
                  placeholder="034 12 345 67"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">
                    {userData.telephone || "—"}
                  </span>
                  {userData.telephone && (
                    <span className="w-[18px] h-[18px] bg-green-600 rounded-full inline-flex items-center justify-center text-white text-[10px]">
                      <FaCheck size={8} />
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 py-3">
            <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaEnvelope className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                Email
              </div>
              {editContact ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-white border rounded-lg text-sm text-gray-900 transition-all duration-200 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="votre.email@exemple.com"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">
                    {userData.email || "—"}
                  </span>
                  <span className="w-[18px] h-[18px] bg-green-600 rounded-full inline-flex items-center justify-center text-white text-[10px]">
                    <FaCheck size={8} />
                  </span>
                </div>
              )}
              {editContact && errors.email && (
                <div className="text-[11px] text-red-500 mt-1">
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {editContact && (
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                className="px-5 py-2.5 bg-transparent text-gray-500 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-600 transition-all"
                onClick={() => {
                  setEditContact(false);
                  setErrors({});
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loadingContact}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50 transition-all"
              >
                {loadingContact ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaSave size={12} />
                )}
                Enregistrer
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

// ─── Composant Sécurité ───────────────────────────────────────────────────────
const SecurityForm = ({ userData, showToast }) => {
  const [passwords, setPasswords] = useState({
    passwordCurrent: "",
    passwordNew: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading2FA, setLoading2FA] = useState(false);

  const passwordCriteria = [
    { key: "minLength", regex: /.{8,}/, label: "8 caractères" },
    { key: "uppercase", regex: /[A-Z]/, label: "Majuscule" },
    { key: "lowercase", regex: /[a-z]/, label: "Minuscule" },
    { key: "digit", regex: /\d/, label: "Chiffre" },
    {
      key: "validSymbols",
      regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      label: "Symbole",
    },
  ];

  const validatePasswordCriteria = (p) => ({
    minLength: /.{8,}/.test(p),
    uppercase: /[A-Z]/.test(p),
    lowercase: /[a-z]/.test(p),
    digit: /\d/.test(p),
    validSymbols: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
  });

  const passwordValidation = validatePasswordCriteria(passwords.passwordNew);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch =
    passwords.passwordNew === passwords.passwordConfirm &&
    passwords.passwordConfirm !== "";
  const passwordsDontMatch =
    passwords.passwordNew !== "" &&
    passwords.passwordConfirm !== "" &&
    passwords.passwordNew !== passwords.passwordConfirm;

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwords.passwordCurrent.trim()) newErrors.passwordCurrent = "Requis";
    if (!passwords.passwordNew.trim()) newErrors.passwordNew = "Requis";
    else if (!isPasswordValid) newErrors.passwordNew = "Mot de passe faible";
    if (!passwords.passwordConfirm.trim()) newErrors.passwordConfirm = "Requis";
    else if (passwords.passwordNew !== passwords.passwordConfirm)
      newErrors.passwordConfirm = "Ne correspond pas";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoadingPassword(true);
    try {
      // Import du service ici pour éviter les dépendances circulaires
      const { changePassword } =
        await import("../../../services/profile.services");
      await changePassword(passwords.passwordCurrent, passwords.passwordNew);
      showToast("Mot de passe mis à jour avec succès", "success");
      setPasswords({
        passwordCurrent: "",
        passwordNew: "",
        passwordConfirm: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Erreur lors du changement de mot de passe";
      showToast(message, "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleEnable2FA = () => {
    setLoading2FA(true);
    setTimeout(() => {
      setQrCodeUrl(
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/Orientation:admin%40orientation.local?secret=JBSWY3DPEHPK3PXP&issuer=Orientation",
      );
      setShowQRCode(true);
      setLoading2FA(false);
      showToast("QR Code généré avec succès", "success");
    }, 1000);
  };

  const handleVerify2FA = () => {
    if (verificationCode.length !== 6) {
      showToast("Le code doit contenir 6 chiffres", "error");
      return;
    }
    setLoading2FA(true);
    setTimeout(() => {
      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode("");
      setLoading2FA(false);
      showToast("Authentification à 2 facteurs activée", "success");
    }, 1000);
  };

  const handleDisable2FA = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?",
      )
    ) {
      setLoading2FA(true);
      setTimeout(() => {
        setTwoFactorEnabled(false);
        setShowQRCode(false);
        setVerificationCode("");
        setLoading2FA(false);
        showToast("Authentification à 2 facteurs désactivée", "success");
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Mot de passe */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Changer le mot de passe
        </h3>

        {[
          {
            field: "passwordCurrent",
            label: "Mot de passe actuel *",
            placeholder: "Entrez votre mot de passe actuel",
            visKey: "current",
          },
          {
            field: "passwordNew",
            label: "Nouveau mot de passe *",
            placeholder: "Minimum 8 caractères",
            visKey: "new",
          },
          {
            field: "passwordConfirm",
            label: "Confirmer le nouveau mot de passe *",
            placeholder: "Répétez le nouveau mot de passe",
            visKey: "confirm",
          },
        ].map(({ field, label, placeholder, visKey }) => (
          <div key={field} className="mb-3.5">
            <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
              {label}
            </label>
            <div className="relative">
              <input
                type={showPassword[visKey] ? "text" : "password"}
                name={field}
                value={passwords[field]}
                onChange={handlePasswordChange}
                className={`w-full p-2.5 bg-white border rounded-lg text-sm text-gray-900 pr-10 transition-all duration-200 ${
                  errors[field] ? "border-red-500" : "border-gray-200"
                }`}
                placeholder={placeholder}
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center"
                onClick={() => togglePasswordVisibility(visKey)}
              >
                {showPassword[visKey] ? (
                  <FaEyeSlash size={14} />
                ) : (
                  <FaEye size={14} />
                )}
              </button>
            </div>
            {errors[field] && (
              <div className="text-[11px] text-red-500 mt-1">
                {errors[field]}
              </div>
            )}
          </div>
        ))}

        {/* Critères de sécurité */}
        <div>
          <label className="block text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
            Critères de sécurité
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {passwordCriteria.map((item) => {
              const met = passwordValidation[item.key];
              return (
                <span
                  key={item.key}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                    met
                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                      : "bg-gray-50 text-gray-400 border border-gray-200"
                  }`}
                >
                  <FaCheck size={8} /> {item.label}
                </span>
              );
            })}
          </div>
          {passwordsMatch && (
            <p className="text-[11px] text-green-600 mt-1.5">
              Les mots de passe correspondent.
            </p>
          )}
          {passwordsDontMatch && (
            <p className="text-[11px] text-red-500 mt-1.5">
              Les mots de passe ne correspondent pas.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loadingPassword}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50 transition-all"
          >
            {loadingPassword ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaLock size={12} />
            )}
            Mettre à jour
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-semibold text-gray-900 m-0">
                Authentification à deux facteurs
              </h3>
              <p className="text-xs text-gray-500 mt-2 max-w-[480px]">
                Protégez votre compte en exigeant un code lors de la connexion
                en plus de votre mot de passe.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
                twoFactorEnabled
                  ? "bg-green-500/10 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {twoFactorEnabled ? "Activé" : "Désactivé"}
            </span>
            {twoFactorEnabled ? (
              <button
                type="button"
                onClick={handleDisable2FA}
                disabled={loading2FA}
                className="px-5 py-2.5 bg-transparent text-gray-500 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Désactiver
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEnable2FA}
                disabled={loading2FA}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                Activer le 2FA
              </button>
            )}
          </div>
        </div>

        {showQRCode && (
          <div className="mt-5 grid grid-cols-[160px_1fr] gap-6 p-5 bg-white border border-gray-200 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[140px] h-[140px] bg-white rounded-lg flex items-center justify-center border border-gray-200">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FaClock className="animate-spin text-gray-400" size={24} />
                )}
              </div>
              <p className="text-[11px] text-gray-500 text-center">
                Scannez avec Google Authenticator, Authy, etc.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-500 m-0">
                Entrez le code à 6 chiffres de votre application.
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-center tracking-[4px] text-lg font-mono"
                placeholder="••••••"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleVerify2FA}
                  disabled={loading2FA}
                  className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  {loading2FA && <FaClock className="animate-spin" size={12} />}
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => setShowQRCode(false)}
                  className="px-5 py-2.5 bg-transparent text-gray-500 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
              </div>
              <p className="text-[10px] text-gray-400 m-0">
                Conservez votre code de secours en lieu sûr.
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfileView;
