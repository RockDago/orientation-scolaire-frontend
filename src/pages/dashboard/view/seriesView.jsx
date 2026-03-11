// src/pages/dashboard/view/seriesView.jsx
import { useState, useEffect } from "react";
import {
  FaPlus, FaEdit, FaTrash, FaSearch,
  FaTimes, FaExclamationTriangle
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllSeries,
  createSerie,
  updateSerie,
  deleteSerie,
} from "../../../services/serie.services";

export default function SeriesView() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    label: "",
    description: "",
  });

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

  // ── Chargement initial depuis l'API ────────────────────────────────
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getAllSeries();
        setSeries(data);
      } catch (error) {
        showToast("Erreur lors du chargement des séries", "error");
        console.error("Erreur chargement séries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // ── Recherche en temps réel (locale + API) ─────────────────────────
  useEffect(() => {
    // Éviter l'appel API au premier rendu (géré par useEffect ci-dessus)
    if (loading) return;

    const delaySearch = setTimeout(async () => {
      try {
        const data = await getAllSeries(searchTerm);
        setSeries(data);
      } catch {
        showToast("Erreur lors de la recherche", "error");
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(delaySearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ── Validation ─────────────────────────────────────────────────────
  const isFormValid = () =>
    formData.code.trim() !== "" &&
    formData.label.trim() !== "" &&
    formData.description.trim() !== "";

  // ── Ouvrir modal ───────────────────────────────────────────────────
  const handleOpenModal = (s = null) => {
    if (s) {
      setEditingId(s.id);
      setFormData({ code: s.code, label: s.label, description: s.description });
    } else {
      setEditingId(null);
      setFormData({ code: "", label: "", description: "" });
    }
    setShowModal(true);
  };

  // ── Sauvegarder (créer ou modifier) ───────────────────────────────
  const handleSave = async () => {
    if (!isFormValid()) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    setLoadingSave(true);
    try {
      if (editingId) {
        const updated = await updateSerie(editingId, formData);
        setSeries(series.map((s) => (s.id === editingId ? updated : s)));
        showToast("Série modifiée avec succès", "success");
      } else {
        const created = await createSerie(formData);
        setSeries([...series, created]);
        showToast("Série ajoutée avec succès", "success");
      }
      setShowModal(false);
      setFormData({ code: "", label: "", description: "" });
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
      await deleteSerie(deleteId);
      setSeries(series.filter((s) => s.id !== deleteId));
      showToast("Série supprimée avec succès", "success");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Séries</h1>
        <p className="text-gray-500">Gérez les séries scolaires disponibles</p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une série..."
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
        ) : series.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FaSearch size={32} className="mb-3 opacity-30" />
            <p className="text-sm">
              {searchTerm ? "Aucun résultat trouvé" : "Aucune série disponible"}
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Série</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600">{s.id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-lg font-semibold">
                      {s.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{s.label}</td>
                  <td className="px-6 py-4 text-gray-600">{s.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOpenModal(s)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(s.id)}
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
      {!loading && series.length > 0 && (
        <div className="mt-4 text-xs text-gray-400 text-right">
          {series.length} série{series.length > 1 ? "s" : ""} trouvée{series.length > 1 ? "s" : ""}
        </div>
      )}

      {/* ── Modal ajout / modification ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Modifier la série" : "Ajouter une série"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: A, B, C"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength="2"
                />
              </div>

              {/* Libellé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Libellé <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Libellé de la série"
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
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                />
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
                  Êtes-vous sûr de vouloir supprimer cette série ? Cette action est irréversible.
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
