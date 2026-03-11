import { useMemo, useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import {
  FiX,
  FiMapPin,
  FiPhone,
  FiBook,
  FiAward,
  FiClock,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  getAllEtablissementsCache,
  recordEtablissementSelection,
} from "../../../services/etablissement.services";

const TYPES  = ["Tous", "Public", "Privé"];
const NIVEAUX = ["Tous", "Licence", "Master", "Doctorat"];

const REGION_LABELS = {
  diana:               "Diana",
  sava:                "Sava",
  sofia:               "Sofia",
  boeny:               "Boeny",
  analanjirofo:        "Analanjirofo",
  betsiboka:           "Betsiboka",
  "alaotra-mangoro":   "Alaotra Mangoro",
  melaky:              "Melaky",
  bongolava:           "Bongolava",
  itasy:               "Itasy",
  analamanga:          "Analamanga",
  atsinanana:          "Atsinanana",
  menabe:              "Menabe",
  vakinankaratra:      "Vakinankaratra",
  "amoron-i-mania":    "Amoron'i Mania",
  vatovavy:            "Vatovavy",
  "haute-matsiatra":   "Haute Matsiatra",
  fitovinany:          "Fitovinany",
  ihorombe:            "Ihorombe",
  "atsimo-atsinanana": "Atsimo-Atsinanana",
  "atsimo-andrefana":  "Atsimo-Andrefana",
  androy:              "Androy",
  anosy:               "Anosy",
};

/* ─── FICHE MODAL ─────────────────────────────────────────────────────────── */
function FicheModal({ fiche, metier, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!fiche) return null;

  const getDuree = (niveau) => {
    if (!niveau) return "Variable";
    const n = niveau.toLowerCase();
    if (n.includes("doctorat"))                          return "7 à 11 ans (Bac +7 à +11)";
    if (n.includes("ingénieur") || n.includes("master")) return "5 ans (Bac +5)";
    if (n.includes("licence") && n.includes("master"))   return "3 à 5 ans (Bac +3 à +5)";
    if (n.includes("licence"))                           return "3 ans (Bac +3)";
    if (n.includes("dut") || n.includes("bts"))          return "2 ans (Bac +2)";
    if (n.includes("diplôme d'état"))                    return "3 ans (Bac +3)";
    return niveau;
  };

  const getAdmission = (type) =>
    type === "Public" ? "Concours d'entrée" : "Sur dossier / entretien";

  const fields = [
    { icon: <FiBook size={15} />,  label: "Établissement", value: fiche.nom },
    { icon: <FiAward size={15} />, label: "Mention",       value: fiche.mention },
    { icon: <FiBook size={15} />,  label: "Parcours",      value: fiche.parcours },
    { icon: <FiAward size={15} />, label: "Niveau",        value: fiche.niveau },
    {
      icon:  <FiClock size={15} />,
      label: "Durée",
      value: fiche.duree || getDuree(fiche.niveau),
    },
    {
      icon:  <FiUsers size={15} />,
      label: "Admission",
      value: fiche.admission || getAdmission(fiche.type),
    },
    { icon: <FiPhone size={15} />,  label: "Contact",      value: fiche.contact },
    {
      icon:  <FiMapPin size={15} />,
      label: "Localisation",
      value: `${fiche.ville || fiche.region || fiche.province}, Madagascar`,
    },
  ];

  if (metier) {
    if (metier.label) {
      fields.unshift({ icon: <FiAward size={15} />, label: "Métier",          value: metier.label });
    }
    if (metier.serie) {
      fields.push({    icon: <FiBook size={15} />,  label: "Série",           value: metier.serie });
    }
    if (metier.parcours) {
      fields.push({    icon: <FiBook size={15} />,  label: "Parcours Métier", value: metier.parcours });
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background:
          "linear-gradient(160deg,#0f1e50 0%,#0e3a6e 30%,#0a6655 65%,#2a7a10 100%)",
      }}
    >
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg,#1250c8,#28b090,#a0d820)" }}
      />
      <div
        className="flex-shrink-0 px-4 sm:px-6 lg:px-10 pt-5 pb-4 flex items-center justify-between gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="min-w-0 flex-1">
          <span
            className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full mb-2"
            style={{
              background: "rgba(255,255,255,0.15)",
              color:      "rgba(255,255,255,0.9)",
            }}
          >
            Fiche établissement
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug break-words">
            {fiche.nom}
          </h2>
          <div className="flex items-start gap-1.5 mt-1.5 text-white/60 text-xs">
            <FiMapPin size={12} className="mt-0.5 flex-shrink-0" />
            <span>{fiche.ville || fiche.region || fiche.province}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <FiX size={16} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-5 custom-scrollbar-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {fields.map(({ icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{
                background: "rgba(255,255,255,0.08)",
                border:     "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <span className="text-white/80">{icon}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                  {label}
                </p>
              </div>
              <p className="text-sm font-semibold text-white leading-snug break-words">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 9999px; }
      `}</style>
    </div>
  );
}

export default function Section4({ metier, selectedRegion, reponseDomaine, onRetour }) {
  const navigate = useNavigate();
  const [selectedEtab, setSelectedEtab] = useState(null);
  const [filterType,   setFilterType]   = useState("Tous");
  const [filterNiveau, setFilterNiveau] = useState("Tous");
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadEtablissements = async () => {
      setLoading(true);
      try {
        const tous = await getAllEtablissementsCache();

        const metierLabel = metier?.label || "";
        const regionLabel = selectedRegion
          ? REGION_LABELS[selectedRegion] || selectedRegion
          : null;

        const data = tous.filter((e) => {   
          if (metierLabel) {
            if (e.metier?.toLowerCase() !== metierLabel.toLowerCase()) return false;
          } else if (reponseDomaine) {
            if (e.mention?.toLowerCase() !== reponseDomaine.toLowerCase()) return false;
          }  
          if (regionLabel) {
            if (e.region !== regionLabel && e.province !== regionLabel) return false;
          }
          return true;
        });

        setEtablissements(data);
      } catch (error) {
        console.error("Erreur chargement établissements:", error);
        setEtablissements([]);
      } finally {
        setLoading(false);
      }
    };

    loadEtablissements();
  }, [metier?.label, selectedRegion, reponseDomaine]);

  const etablissementsFiltres = useMemo(() => {
    return etablissements.filter((e) => {
      if (filterType   !== "Tous" && e.type   !== filterType)                              return false;
      if (filterNiveau !== "Tous" && !e.niveau?.toLowerCase().includes(filterNiveau.toLowerCase())) return false;
      return true;
    });
  }, [etablissements, filterType, filterNiveau]);

  const mentionLabel = metier ? metier.mention || metier.label : "Formation";
  const regionLabel  = selectedRegion
    ? REGION_LABELS[selectedRegion] || selectedRegion
    : null;

  const handleSelectEtablissement = async (etab) => {
    try {
      await recordEtablissementSelection(
        metier?.label || "Formation",
        regionLabel   || "Non spécifiée",
        etab.nom,
      );
    } catch (error) {
      console.error("Erreur tracking établissement:", error);
    }
    setSelectedEtab(etab);
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden font-['Sora'] flex items-center justify-center bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] to-[#c2e832]">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Chargement des établissements…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden font-['Sora'] flex"
      style={{
        background:
          "linear-gradient(135deg,#1250c8 0%,#1a6dcc 20%,#28b090 55%,#a0d820 80%,#c2e832 100%)",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* ── Déco SVG haut droite ── */}
      <div className="absolute top-0 right-0 pointer-events-none z-0 opacity-70 origin-top-right">
        <svg width="220" height="200" viewBox="0 0 260 240" fill="none">
          <path d="M130 38 L232 94 L130 150 L28 94 Z" stroke="white" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
          <path d="M52 108 Q52 160 130 188 Q208 160 208 108" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <line x1="232" y1="94"  x2="232" y2="148" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="232" cy="155" r="7" fill="white" />
          <line x1="130" y1="150" x2="130" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4" />
          <circle cx="130" cy="94" r="5" fill="white" />
        </svg>
      </div>

      {/* ── Silhouette ville bas ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="90" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="10"  y="55" width="30" height="45" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="50"  y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="100" y="50" width="25" height="50" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="240" y="55" width="28" height="45" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="370" y="60" width="25" height="40" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* ── Vague centrale ── */}
      <div className="absolute top-[45%] left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* ══ Colonne gauche — Titre + Filtres + Liste ══ */}
      <div className="relative z-10 flex flex-col h-full w-full lg:w-[55%] xl:w-[52%] px-6 sm:px-10 lg:px-12 xl:px-14 pt-8 pb-4">

        {/* Bouton retour */}
        <button
          onClick={onRetour}
          className="self-start text-white/80 hover:text-white transition-colors w-11 h-11 flex items-center justify-center mb-3 shrink-0"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={38} />
        </button>

        {/* Titre */}
        <div className="shrink-0 mb-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-3">
            UNIVERSITÉS<br />&amp; INSTITUTS
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block bg-white/90 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-gray-800">
              {mentionLabel}
            </span>
            {regionLabel && (
              <span className="inline-flex items-center gap-1.5 bg-black/15 border border-white/30 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
                <FiMapPin size={11} />
                {regionLabel}
              </span>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="shrink-0 mb-4 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-white/70 font-semibold mr-1">Type :</span>
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  filterType === t
                    ? { background: "white", color: "#1250c8" }
                    : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }
                }
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-white/70 font-semibold mr-1">Niveau :</span>
            {NIVEAUX.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFilterNiveau(n)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  filterNiveau === n
                    ? { background: "white", color: "#1250c8" }
                    : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }
                }
              >
                {n}
              </button>
            ))}
            {(filterType !== "Tous" || filterNiveau !== "Tous") && (
              <button
                type="button"
                onClick={() => { setFilterType("Tous"); setFilterNiveau("Tous"); }}
                className="text-xs text-white/60 hover:text-white underline underline-offset-2 ml-1"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Compteur */}
        <p className="shrink-0 text-xs text-white/60 mb-3 font-medium">
          {etablissementsFiltres.length} établissement
          {etablissementsFiltres.length !== 1 ? "s" : ""}
        </p>

        {/* Liste scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin-white space-y-2.5 pr-1 pb-4">
          {etablissementsFiltres.length > 0 ? (
            etablissementsFiltres.map((etab, i) => (
              <button
                key={etab.id || i}
                type="button"
                onClick={() => handleSelectEtablissement(etab)}
                className="group w-full text-left rounded-2xl px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background:    "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(8px)",
                  border:        "1px solid rgba(255,255,255,0.7)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{
                    background:
                      etab.type === "Public"
                        ? "linear-gradient(135deg,#1250c8,#28b090)"
                        : "linear-gradient(135deg,#28b090,#a0d820)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-gray-900 leading-snug break-words">
                      {etab.nom}
                    </span>
                    <FiChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: etab.type === "Public" ? "rgba(18,80,200,0.12)" : "rgba(40,176,144,0.12)",
                        color:      etab.type === "Public" ? "#1250c8"              : "#0a6655",
                      }}
                    >
                      {etab.type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-0.5">
                      <FiMapPin size={9} />
                      {etab.ville || etab.region || etab.province}
                    </span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div
              className="rounded-2xl px-5 py-8 text-center text-sm text-gray-500"
              style={{ background: "rgba(255,255,255,0.85)" }}
            >
              Aucun établissement trouvé pour ce métier dans cette région.
            </div>
          )}
        </div>

        {/* Home */}
        <div className="shrink-0 flex justify-center pt-3">
          <button
            onClick={() => navigate("/acceuil/orientation")}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Accueil"
          >
            <HiOutlineHome size={26} />
          </button>
        </div>
      </div>

      {/* ══ Colonne droite — Panneau info glassmorphism ══ */}
      <div className="hidden lg:flex relative z-10 flex-1 flex-col items-center justify-center px-10 xl:px-14 py-12 h-full">
        <div
          className="w-full max-w-sm rounded-3xl p-8 text-center"
          style={{
            background:          "rgba(255,255,255,0.12)",
            backdropFilter:      "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border:              "1px solid rgba(255,255,255,0.25)",
            boxShadow:           "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background:     "rgba(255,255,255,0.15)",
              border:         "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            <FiBook size={28} className="text-white" />
          </div>

          <h2 className="text-white font-black text-3xl mb-1 drop-shadow">
            {etablissementsFiltres.length}
          </h2>
          <p className="text-white/85 text-sm font-semibold mb-6 drop-shadow">
            établissement{etablissementsFiltres.length !== 1 ? "s" : ""}{" "}
            disponible{etablissementsFiltres.length !== 1 ? "s" : ""}
          </p>

          <div className="space-y-3 text-left">
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background:          "rgba(255,255,255,0.12)",
                border:              "1px solid rgba(255,255,255,0.18)",
                backdropFilter:      "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-0.5">Métier</p>
              <p className="text-white text-sm font-semibold drop-shadow">{metier?.label || "—"}</p>
            </div>

            {regionLabel && (
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background:          "rgba(255,255,255,0.12)",
                  border:              "1px solid rgba(255,255,255,0.18)",
                  backdropFilter:      "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-0.5">Région</p>
                <p className="text-white text-sm font-semibold drop-shadow">{regionLabel}</p>
              </div>
            )}

            <div
              className="rounded-xl px-4 py-3"
              style={{
                background:          "rgba(255,255,255,0.12)",
                border:              "1px solid rgba(255,255,255,0.18)",
                backdropFilter:      "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-0.5">Mention</p>
              <p className="text-white text-sm font-semibold drop-shadow">{mentionLabel}</p>
            </div>
          </div>

          <p className="text-white/55 text-xs mt-6 leading-relaxed drop-shadow">
            Cliquez sur un établissement<br />pour voir sa fiche complète
          </p>
        </div>
      </div>

      {/* Fiche Modal */}
      {selectedEtab && (
        <FicheModal
          fiche={selectedEtab}
          metier={metier}
          onClose={() => setSelectedEtab(null)}
        />
      )}

      <style>{`
        .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
      `}</style>
    </div>
  );
}
