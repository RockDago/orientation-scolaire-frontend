// src/pages/dashboard/view/etablissementsView.jsx
import { useState, useEffect } from "react";
import {
  FaPlus, FaEdit, FaTrash, FaSearch,
  FaTimes, FaExclamationTriangle
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllEtablissements,
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
} from "../../../services/etablissement.services";
import { getAllMentions } from "../../../services/mention.services";
import { getAllParcours } from "../../../services/parcours.services";
import { getAllMetiers } from "../../../services/metier.services";

// ── Données statiques Madagascar ───────────────────────────────────────────
const provinceRegions = {
  Antananarivo: ["Analamanga", "Itasy", "Vakinankaratra", "Bongolava"],
  Mahajanga:    ["Boeny", "Sofia", "Betsiboka", "Melaky"],
  Toliara:      ["Atsimo-Andrefana", "Androy", "Anosy", "Menabe"],
  Toamasina:    ["Atsinanana", "Alaotra-Mangoro", "Analanjirofo"],
  Fianarantsoa: [
    "Haute Matsiatra", "Amoron'i Mania", "Vatovavy",
    "Fitovinany", "Atsimo-Atsinanana", "Ihorombe"
  ],
  Antsiranana:  ["Diana", "Sava"],
};

const provinceOptions  = Object.keys(provinceRegions);
const typeOptions      = ["Public", "Privé"];
const niveauOptions    = ["Licence", "Master", "Doctorat"];
const admissionOptions = ["Concours", "Dossier", "Entretien", "Test", "Concours + Dossier"];

const niveauDureeMap = {
  Licence:  "3 ans",
  Master:   "5 ans",
  Doctorat: "8 ans",
};

const emptyForm = {
  nom:       "",
  province:  "",
  region:    "",
  type:      "Public",
  mention:   "",
  parcours:  "",
  metier:    "",
  niveau:    "",
  duree:     "",
  admission: "",
  contact:   "",
};

export default function EtablissementsView() {
  const [etablissements, setEtablissements]   = useState([]);
  const [mentionOptions, setMentionOptions]   = useState([]);
  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [metierOptions, setMetierOptions]     = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [loadingSave, setLoadingSave]         = useState(false);
  const [loadingDelete, setLoadingDelete]     = useState(false);
  const [searchTerm, setSearchTerm]           = useState("");
  const [showModal, setShowModal]             = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId]               = useState(null);
  const [editingId, setEditingId]             = useState(null);
  const [formData, setFormData]               = useState(emptyForm);

  // ── Toast ──────────────────────────────────────────────────────────
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

  // ── Chargement initial ─────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [etablissementsData, mentionsData, parcoursData, metiersData] =
          await Promise.all([
            getAllEtablissements(),
            getAllMentions(),
            getAllParcours(),
            getAllMetiers(),
          ]);
        setEtablissements(etablissementsData);
        setMentionOptions(mentionsData);
        setParcoursOptions(parcoursData);
        setMetierOptions(metiersData);
      } catch {
        showToast("Erreur lors du chargement des données", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Recherche avec debounce ────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const delay = setTimeout(async () => {
      try {
        const data = await getAllEtablissements(searchTerm);
        setEtablissements(data);
      } catch {
        showToast("Erreur lors de la recherche", "error");
      }
    }, 400);
    return () => clearTimeout(delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ── Validation ─────────────────────────────────────────────────────
  const isFormValid = () =>
    formData.nom.trim()     !== "" &&
    formData.province       !== "" &&
    formData.region         !== "" &&
    formData.type           !== "" &&
    formData.mention        !== "" &&
    formData.parcours       !== "" &&
    formData.metier         !== "" &&
    formData.niveau         !== "" &&
    formData.admission      !== "" &&
    formData.contact.trim() !== "";

  // ── Synchro province → reset région ───────────────────────────────
  const handleProvinceChange = (province) => {
    setFormData({ ...formData, province, region: "" });
  };

  // ── Synchro niveau → durée automatique ────────────────────────────
  const handleNiveauChange = (niveau) => {
    setFormData({
      ...formData,
      niveau,
      duree: niveauDureeMap[niveau] ?? "",
    });
  };

  // ── Ouvrir modal ───────────────────────────────────────────────────
  const handleOpenModal = (etab = null) => {
    if (etab) {
      setEditingId(etab.id);
      setFormData({
        nom:       etab.nom,
        province:  etab.province,
        region:    etab.region,
        type:      etab.type,
        mention:   etab.mention,
        parcours:  etab.parcours,
        metier:    etab.metier,
        niveau:    etab.niveau,
        duree:     etab.duree,
        admission: etab.admission,
        contact:   etab.contact,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  // ── Sauvegarder ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!isFormValid()) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    setLoadingSave(true);
    try {
      if (editingId) {
        const updated = await updateEtablissement(editingId, formData);
        setEtablissements(etablissements.map((e) =>
          e.id === editingId ? updated : e
        ));
        showToast("Établissement modifié avec succès", "success");
      } else {
        const created = await createEtablissement(formData);
        setEtablissements([...etablissements, created]);
        showToast("Établissement ajouté avec succès", "success");
      }
      setShowModal(false);
      setFormData(emptyForm);
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de l'enregistrement";
      showToast(message, "error");
    } finally {
      setLoadingSave(false);
    }
  };

  // ── Supprimer ──────────────────────────────────────────────────────
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteEtablissement(deleteId);
      setEtablissements(etablissements.filter((e) => e.id !== deleteId));
      showToast("Établissement supprimé avec succès", "success");
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la suppression";
      showToast(message, "error");
    } finally {
      setLoadingDelete(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // ── Rendu ──────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <ToastContainer />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Établissements</h1>
        <p className="text-gray-500">Gérez les établissements d'enseignement</p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un établissement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Ajouter
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Chargement...</span>
            </div>
          </div>
        ) : etablissements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FaSearch size={32} className="mb-3 opacity-30" />
            <p className="text-sm">
              {searchTerm ? "Aucun résultat trouvé" : "Aucun établissement disponible"}
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Établissement</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Province</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Région</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Mention</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Parcours</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Métier</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Niveau</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Durée</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Admission</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {etablissements.map((etab) => (
                <tr
                  key={etab.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 text-gray-600">{etab.id}</td>
                  <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {etab.nom}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{etab.province}</td>
                  <td className="px-4 py-4 text-gray-600">{etab.region}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${
                      etab.type === "Public"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-purple-100 text-purple-600"
                    }`}>
                      {etab.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{etab.mention}</td>
                  <td className="px-4 py-4 text-gray-600">{etab.parcours}</td>
                  <td className="px-4 py-4 text-gray-600">{etab.metier}</td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold">
                      {etab.niveau}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{etab.duree}</td>
                  <td className="px-4 py-4 text-gray-600">{etab.admission}</td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                    {etab.contact}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(etab)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(etab.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Compteur */}
      {!loading && etablissements.length > 0 && (
        <div className="mt-4 text-xs text-gray-400 text-right">
          {etablissements.length} établissement{etablissements.length > 1 ? "s" : ""} trouvé{etablissements.length > 1 ? "s" : ""}
        </div>
      )}

      {/* ── Modal ajout / modification ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Modifier l'établissement" : "Ajouter un établissement"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              {/* Nom */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'établissement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Université XRAY"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Sélectionner une province</option>
                  {provinceOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Région — dépend de la province */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  disabled={!formData.province}
                  className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                    !formData.province ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Sélectionner une région</option>
                  {(provinceRegions[formData.province] ?? []).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 020 22 000 00"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mention — depuis API */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mention <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.mention}
                  onChange={(e) => setFormData({ ...formData, mention: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Sélectionner une mention</option>
                  {mentionOptions.map((m) => (
                    <option key={m.id} value={m.label}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Parcours — depuis API */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcours <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.parcours}
                  onChange={(e) => setFormData({ ...formData, parcours: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Sélectionner un parcours</option>
                  {parcoursOptions.map((p) => (
                    <option key={p.id} value={p.label}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Métier — depuis API */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Métier <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.metier}
                  onChange={(e) => setFormData({ ...formData, metier: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Sélectionner un métier</option>
                  {metierOptions.map((m) => (
                    <option key={m.id} value={m.label}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Niveau — déclenche synchro durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.niveau}
                  onChange={(e) => handleNiveauChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveauOptions.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Durée — remplie automatiquement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée
                  {formData.niveau && (
                    <span className="ml-2 text-xs text-blue-500 font-normal">← auto</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.duree}
                  readOnly
                  placeholder="Définie selon le niveau"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors cursor-not-allowed ${
                    formData.niveau
                      ? "border-blue-200 bg-blue-50 text-blue-600 font-semibold"
                      : "border-gray-200 bg-gray-50 text-gray-400"
                  }`}
                />
                {formData.niveau && (
                  <p className="mt-1 text-xs text-blue-500">
                    {formData.niveau} → {formData.duree}
                  </p>
                )}
              </div>

              {/* Admission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.admission}
                  onChange={(e) => setFormData({ ...formData, admission: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Sélectionner un mode d'admission</option>
                  {admissionOptions.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loadingSave}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid() || loadingSave}
                className={`flex-1 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  isFormValid() && !loadingSave
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loadingSave ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal confirmation suppression ────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Êtes-vous sûr de vouloir supprimer cet établissement ? Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                disabled={loadingDelete}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loadingDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {loadingDelete ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
