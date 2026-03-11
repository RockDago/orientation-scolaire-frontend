// src/pages/dashboard/view/metiersView.jsx
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
  FaPlusCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllMetiers,
  createMetier,
  updateMetier,
  deleteMetier,
} from "../../../services/metier.services";
import { getAllMentions } from "../../../services/mention.services";
import { getAllParcours } from "../../../services/parcours.services";
import { getAllSeries } from "../../../services/serie.services";

const niveauOptions = ["Bac+2", "Bac+3", "Bac+4", "Bac+5", "Bac+8"];

const emptyForm = {
  label: "",
  description: "",
  parcours: [], // Parcours d'études possibles (multiple)
  mention: "",
  serie: [], // Série recommandée (multiple)
  niveau: "",
  parcoursFormation: [], // Parcours de formation (multiple)
};

export default function MetiersView() {
  const [metiers, setMetiers] = useState([]);
  const [mentionOptions, setMentionOptions] = useState([]);
  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [serieOptions, setSerieOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [newParcoursFormation, setNewParcoursFormation] = useState("");
  const [newSerieRecommanded, setNewSerieRecommanded] = useState("");
  const [newParcours, setNewParcours] = useState("");

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

  // ── Chargement initial : tout en parallèle ─────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [metiersData, mentionsData, parcoursData, seriesData] =
          await Promise.all([
            getAllMetiers(),
            getAllMentions(),
            getAllParcours(),
            getAllSeries(),
          ]);

        // S'assurer que parcoursFormation, serie et parcours sont toujours des tableaux
        const metiersWithArray = metiersData.map((metier) => ({
          ...metier,
          parcours: metier.parcours
            ? Array.isArray(metier.parcours)
              ? metier.parcours
              : [metier.parcours]
            : [],
          parcoursFormation: metier.parcoursFormation || [],
          serie: metier.serie
            ? Array.isArray(metier.serie)
              ? metier.serie
              : [metier.serie]
            : [],
        }));

        setMetiers(metiersWithArray);
        setMentionOptions(mentionsData);
        setParcoursOptions(parcoursData);
        setSerieOptions(seriesData);
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
        const data = await getAllMetiers(searchTerm);
        // S'assurer que parcoursFormation, serie et parcours sont toujours des tableaux
        const metiersWithArray = data.map((metier) => ({
          ...metier,
          parcours: metier.parcours
            ? Array.isArray(metier.parcours)
              ? metier.parcours
              : [metier.parcours]
            : [],
          parcoursFormation: metier.parcoursFormation || [],
          serie: metier.serie
            ? Array.isArray(metier.serie)
              ? metier.serie
              : [metier.serie]
            : [],
        }));
        setMetiers(metiersWithArray);
      } catch {
        showToast("Erreur lors de la recherche", "error");
      }
    }, 400);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ── Validation ─────────────────────────────────────────────────────
  const isFormValid = () =>
    formData.label.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.parcours.length > 0 && // Au moins un parcours
    formData.mention !== "" &&
    formData.serie.length > 0 && // Au moins une série
    formData.niveau !== "" &&
    formData.parcoursFormation.length > 0; // Au moins un parcours de formation

  // ── Gestion des séries recommandées ───────────────────────────────
  const handleAddSerieRecommanded = () => {
    if (newSerieRecommanded.trim() === "") {
      showToast("Veuillez sélectionner une série", "error");
      return;
    }

    if (formData.serie.includes(newSerieRecommanded.trim())) {
      showToast("Cette série existe déjà", "error");
      return;
    }

    setFormData({
      ...formData,
      serie: [...formData.serie, newSerieRecommanded.trim()],
    });
    setNewSerieRecommanded("");
  };

  const handleRemoveSerieRecommanded = (serieToRemove) => {
    setFormData({
      ...formData,
      serie: formData.serie.filter((s) => s !== serieToRemove),
    });
  };

  // ── Gestion des parcours d'études possibles ──────────────────────────
  const handleAddParcours = () => {
    if (newParcours.trim() === "") {
      showToast("Veuillez sélectionner un parcours", "error");
      return;
    }

    if (formData.parcours.includes(newParcours.trim())) {
      showToast("Ce parcours existe déjà", "error");
      return;
    }

    setFormData({
      ...formData,
      parcours: [...formData.parcours, newParcours.trim()],
    });
    setNewParcours("");
  };

  const handleRemoveParcours = (parcoursToRemove) => {
    setFormData({
      ...formData,
      parcours: formData.parcours.filter((p) => p !== parcoursToRemove),
    });
  };

  // ── Gestion des parcours de formation ─────────────────────────────
  const handleAddParcoursFormation = () => {
    if (newParcoursFormation.trim() === "") {
      showToast("Veuillez saisir un parcours de formation", "error");
      return;
    }

    if (formData.parcoursFormation.includes(newParcoursFormation.trim())) {
      showToast("Ce parcours existe déjà", "error");
      return;
    }

    setFormData({
      ...formData,
      parcoursFormation: [
        ...formData.parcoursFormation,
        newParcoursFormation.trim(),
      ],
    });
    setNewParcoursFormation("");
  };

  const handleRemoveParcoursFormation = (parcoursToRemove) => {
    setFormData({
      ...formData,
      parcoursFormation: formData.parcoursFormation.filter(
        (p) => p !== parcoursToRemove,
      ),
    });
  };

  // ── Ouvrir modal ───────────────────────────────────────────────────
  const handleOpenModal = (metier = null) => {
    if (metier) {
      setEditingId(metier.id);
      setFormData({
        label: metier.label,
        description: metier.description,
        parcours: metier.parcours,
        mention: metier.mention,
        serie: Array.isArray(metier.serie)
          ? metier.serie
          : metier.serie
            ? [metier.serie]
            : [],
        niveau: metier.niveau,
        parcoursFormation: metier.parcoursFormation || [],
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setNewParcoursFormation("");
    setNewSerieRecommanded("");
    setNewParcours("");
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
        const updated = await updateMetier(editingId, formData);
        setMetiers(
          metiers.map((m) =>
            m.id === editingId ? { ...updated, ...formData } : m,
          ),
        );
        showToast("Métier modifié avec succès", "success");
      } else {
        const created = await createMetier(formData);
        setMetiers([...metiers, { ...created, ...formData }]);
        showToast("Métier ajouté avec succès", "success");
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
      await deleteMetier(deleteId);
      setMetiers(metiers.filter((m) => m.id !== deleteId));
      showToast("Métier supprimé avec succès", "success");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Métiers</h1>
        <p className="text-gray-500">Gérez la liste des métiers disponibles</p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un métier..."
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
        ) : metiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FaSearch size={32} className="mb-3 opacity-30" />
            <p className="text-sm">
              {searchTerm ? "Aucun résultat trouvé" : "Aucun métier disponible"}
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Métier
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Parcours d'études possibles
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Mention
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Série recommandée
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Niveau
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Parcours de formation
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {metiers.map((metier) => (
                <tr
                  key={metier.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600">{metier.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {metier.label}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {metier.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(metier.parcours)
                        ? metier.parcours
                        : []
                      ).map((parcours, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {parcours}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{metier.mention}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(metier.serie) ? metier.serie : []).map(
                        (serie, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                          >
                            {serie}
                          </span>
                        ),
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold">
                      {metier.niveau}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(metier.parcoursFormation || []).map(
                        (parcours, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                          >
                            {parcours}
                          </span>
                        ),
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOpenModal(metier)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(metier.id)}
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
      {!loading && metiers.length > 0 && (
        <div className="mt-4 text-xs text-gray-400 text-right">
          {metiers.length} métier{metiers.length > 1 ? "s" : ""} trouvé
          {metiers.length > 1 ? "s" : ""}
        </div>
      )}

      {/* ── Modal ajout / modification ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Modifier le métier" : "Ajouter un métier"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Première rangée : 2 colonnes */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Colonne 1 : Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Informations générales
                </h3>

                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Métier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nom du métier"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Description du métier"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Parcours d'études possibles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parcours d'études possibles{" "}
                    <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      (Vous pouvez ajouter plusieurs parcours)
                    </span>
                  </label>

                  {/* Affichage des parcours sélectionnés */}
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                    {formData.parcours && formData.parcours.length > 0 ? (
                      formData.parcours.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {p}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveParcours(p)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm flex items-center h-full">
                        Aucun parcours sélectionné
                      </span>
                    )}
                  </div>

                  {/* Sélecteur et bouton d'ajout */}
                  <div className="flex gap-2">
                    <select
                      value={newParcours}
                      onChange={(e) => setNewParcours(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">
                        Sélectionner un parcours à ajouter
                      </option>
                      {parcoursOptions
                        .filter((p) => !formData.parcours.includes(p.label))
                        .map((p) => (
                          <option key={p.id} value={p.label}>
                            {p.label}
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddParcours}
                      className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <FaPlusCircle size={16} />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Colonne 2 : Autres informations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Classification
                </h3>

                {/* Mention */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mention <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.mention}
                    onChange={(e) =>
                      setFormData({ ...formData, mention: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Sélectionner une mention</option>
                    {mentionOptions.map((m) => (
                      <option key={m.id} value={m.label}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Niveau */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.niveau}
                    onChange={(e) =>
                      setFormData({ ...formData, niveau: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Sélectionner</option>
                    {niveauOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Deuxième rangée : 2 colonnes pour les sections multiples */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Colonne 1 : Séries recommandées (multiple) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Séries recommandées <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    (Vous pouvez ajouter plusieurs séries)
                  </span>
                </h3>

                {/* Liste des séries ajoutées */}
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-lg">
                  {formData.serie.map((serieCode, index) => {
                    const serieLabel =
                      serieOptions.find((s) => s.code === serieCode)?.label ||
                      serieCode;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
                      >
                        <span className="text-sm text-gray-700">
                          {serieCode}
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveSerieRecommanded(serieCode)
                          }
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    );
                  })}
                  {formData.serie.length === 0 && (
                    <p className="text-sm text-gray-400 italic w-full text-center py-2">
                      Aucune série ajoutée
                    </p>
                  )}
                </div>

                {/* Ajout d'une nouvelle série */}
                <div className="flex gap-2">
                  <select
                    value={newSerieRecommanded}
                    onChange={(e) => setNewSerieRecommanded(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Sélectionner une série</option>
                    {serieOptions
                      .filter((s) => !formData.serie.includes(s.code))
                      .map((s) => (
                        <option key={s.id} value={s.code}>
                          {s.code}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={handleAddSerieRecommanded}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors whitespace-nowrap"
                    type="button"
                  >
                    <FaPlusCircle size={16} />
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Colonne 2 : Parcours de formation (multiple) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Parcours de formation <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    (Vous pouvez ajouter plusieurs parcours)
                  </span>
                </h3>

                {/* Liste des parcours ajoutés */}
                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-lg">
                  {formData.parcoursFormation.map((parcours, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
                    >
                      <span className="text-sm text-gray-700">{parcours}</span>
                      <button
                        onClick={() => handleRemoveParcoursFormation(parcours)}
                        className="text-red-500 hover:text-red-700"
                        type="button"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ))}
                  {formData.parcoursFormation.length === 0 && (
                    <p className="text-sm text-gray-400 italic w-full text-center py-2">
                      Aucun parcours de formation ajouté
                    </p>
                  )}
                </div>

                {/* Ajout d'un nouveau parcours */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Saisir un parcours de formation"
                    value={newParcoursFormation}
                    onChange={(e) => setNewParcoursFormation(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddParcoursFormation();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddParcoursFormation}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors whitespace-nowrap"
                    type="button"
                  >
                    <FaPlusCircle size={16} />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 mt-8 pt-4 border-t">
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
                  Êtes-vous sûr de vouloir supprimer ce métier ? Cette action
                  est irréversible.
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
