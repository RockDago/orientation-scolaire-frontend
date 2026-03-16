import { useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getMetierById, getAllMetiersCache } from "../../../services/metier.services";

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 opacity-90 scale-110 lg:scale-125 origin-top-right">
        <svg width="260" height="240" viewBox="0 0 260 240" fill="none">
          <path d="M130 38 L232 94 L130 150 L28 94 Z" stroke="white" strokeWidth="2.6" fill="none" strokeLinejoin="round"/>
          <path d="M52 108 Q52 160 130 188 Q208 160 208 108" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <line x1="232" y1="94" x2="232" y2="148" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
          <circle cx="232" cy="155" r="7" fill="white"/>
          <line x1="130" y1="150" x2="130" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4"/>
          <circle cx="130" cy="94" r="5" fill="white"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="50"  y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function Section11({ metier, onRetour, onVoirFormations }) {
  const navigate = useNavigate();
  const [metierDetails, setMetierDetails] = useState(metier || null);
  const [loading,        setLoading]       = useState(false);
  const [metiersSimilaires, setMetiersSimilaires] = useState([]);


  useEffect(() => {
    if (!metier) return;

    const loadDetails = async () => {
      if (metier.parcoursFormation?.length > 0) {
        setMetierDetails(metier);
      } else if (metier.id && typeof metier.id === "number") {
        setLoading(true);
        try {
          const details = await getMetierById(metier.id);
          setMetierDetails(details);
        } catch (err) {
          console.error("Erreur chargement détails métier:", err);
          setMetierDetails(metier);
        } finally {
          setLoading(false);
        }
      } else {
        setMetierDetails(metier);
      }

      // Charger les métiers du même domaine
      try {
        const tous = await getAllMetiersCache();
        const domaine = normalize(metier.domaine || metier.mention);
        const filtrés = tous.filter(other => 
          other.id !== metier.id && 
          (normalize(other.domaine) === domaine || normalize(other.mention) === domaine)
        ).slice(0, 4);
        setMetiersSimilaires(filtrés);
      } catch (err) {
        console.error("Erreur chargement métiers similaires:", err);
      }
    };

    const normalize = (str) => (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    loadDetails();
  }, [metier?.id, metier?.domaine, metier?.mention]);

  const m = metierDetails;

  const parcours =
    m?.parcoursFormation?.length > 0
      ? m.parcoursFormation
      : m?.parcours?.length > 0
      ? m.parcours
      : ["Aucun parcours disponible pour ce métier."];

  const handleVoirFormations = () => {
    if (!m) return;
    onVoirFormations?.({
      id:          m.id,
      label:       m.label,
      mention:     m.mention,
      niveau:      m.niveau,
      description: m.description,
      serie:       m.serie       || null,
      parcours:    m.parcours    || null,
      categorie:   m.categorie   || null,
    });
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
        <GradBg />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" />
          </div>
          <p className="text-white font-black text-xl">Chargement du parcours…</p>
          <p className="text-white/60 text-sm">{metier?.label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <GradBg />

      <div className="relative z-10 flex flex-col h-full w-full px-5 sm:px-8 pt-5 pb-4">

        {/* Retour */}
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors flex items-center justify-center p-0"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={42} />
        </button>

        {/* Zone scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto py-2 scrollbar-hide">

          {/* Badge */}
          <span
            className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mt-2 mb-2"
            style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
          >
            Parcours de formation
          </span>

          {/* Formation sélectionnée */}
          <div className="mb-8">
            <p className="text-sm text-white/70 font-semibold mb-2 uppercase tracking-wider">Formation sélectionnée :</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight break-words">
              {m?.label || "—"}
            </h1>
          </div>

          {/* Badge mention */}
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-5">
            {m?.mention || "—"}
          </span>

          {/* Badge niveau */}
          {m?.niveau && (
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 ml-2">
              {m.niveau}
            </span>
          )}

          {/* ✅ Étapes du parcours — depuis parcoursFormation BDD */}
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-2xl flex flex-col gap-0 mb-6">
              {parcours.map((etape, i) => (
                <div key={i} className="flex items-stretch gap-4">

                  {/* Numéro + ligne verticale */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 z-10"
                      style={{
                        background: i === parcours.length - 1 ? "white" : "rgba(255,255,255,0.25)",
                        color:      i === parcours.length - 1 ? "#1250c8" : "white",
                        border:     "2px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < parcours.length - 1 && (
                      <div
                        className="w-0.5 flex-1 my-1"
                        style={{ background: "rgba(255,255,255,0.3)", minHeight: "20px" }}
                      />
                    )}
                  </div>

                  {/* Contenu de l'étape */}
                  <div
                    className="flex-1 rounded-2xl px-4 py-3"
                    style={{
                      background: i === parcours.length - 1
                        ? "rgba(255,255,255,0.20)"
                        : "rgba(255,255,255,0.10)",
                      border: i === parcours.length - 1
                        ? "1px solid rgba(255,255,255,0.45)"
                        : "1px solid rgba(255,255,255,0.18)",
                      marginBottom: i < parcours.length - 1 ? "8px" : "0",
                    }}
                  >
                    <p className="text-sm sm:text-base font-semibold text-white leading-snug break-words">
                      {etape}
                    </p>
                    {i === parcours.length - 1 && (
                      <div className="flex items-center gap-1 mt-1">
                        <FiCheckCircle size={12} style={{ color: "#1a3ea8" }} />
                        <span className="text-[11px] font-semibold" style={{ color: "#1a3ea8" }}>
                          Objectif final
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Autres métiers du même domaine */}
          {metiersSimilaires.length > 0 && (
            <div className="w-full max-w-2xl mx-auto mt-8 mb-10">
              <h3 className="text-white font-bold text-lg mb-4 px-1">Autres métiers dans ce domaine</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {metiersSimilaires.map(sim => (
                  <button
                    key={sim.id}
                    onClick={() => onVoirFormations?.(sim)}
                    className="flex items-center justify-between gap-3 p-4 rounded-2xl transition-all"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div className="flex-1 text-left">
                      <p className="text-white font-bold text-sm leading-tight">{sim.label}</p>
                      <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mt-1">{sim.niveau}</p>
                    </div>
                    <FiArrowRight size={14} className="text-white/60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Boutons bas */}
        <div className="shrink-0 flex flex-col items-center gap-4 pt-3">
          {/* ✅ Bouton → Section5 (carte avec établissements) */}
          <button
            onClick={handleVoirFormations}
            className="w-full max-w-xs py-4 rounded-full font-bold text-sm transition-all inline-flex items-center justify-center gap-2 bg-[#1a3ea8] hover:bg-[#122d88] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Voir l'établissement
            <FiArrowRight size={16} />
          </button>

          {/* Home */}
          <button
            onClick={() => navigate("/acceuil/orientation")}
            className="text-white hover:text-white/80 transition-colors"
            aria-label="Accueil"
          >
            <HiOutlineHome size={30} />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
