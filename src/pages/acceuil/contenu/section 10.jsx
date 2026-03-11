import { useState, useRef, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllMetiers } from "../../../services/metier.services";

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 opacity-90 scale-110 lg:scale-125 origin-top-right">
        <svg width="260" height="240" viewBox="0 0 260 240" fill="none">
          <path
            d="M130 38 L232 94 L130 150 L28 94 Z"
            stroke="white"
            strokeWidth="2.6"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M52 108 Q52 160 130 188 Q208 160 208 108"
            stroke="white"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
          <line
            x1="232"
            y1="94"
            x2="232"
            y2="148"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="232" cy="155" r="7" fill="white" />
          <line
            x1="130"
            y1="150"
            x2="130"
            y2="188"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5 4"
          />
          <circle cx="130" cy="94" r="5" fill="white" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg
          width="100%"
          height="100"
          viewBox="0 0 400 100"
          preserveAspectRatio="xMidYMax meet"
          fill="none"
        >
          <rect
            x="50"
            y="35"
            width="40"
            height="65"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="135"
            y="30"
            width="50"
            height="70"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="195"
            y="45"
            width="35"
            height="55"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="278"
            y="38"
            width="42"
            height="62"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="330"
            y="50"
            width="30"
            height="50"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg
          width="100%"
          height="60"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

const NIVEAUX_COURTS = ["Bac+2", "Bac+3"];
const NIVEAUX_LONGS = ["Bac+4", "Bac+5", "Bac+6", "Bac+7", "Bac+8"];

function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filtrerMetiers(metiers, reponseDomaine, reponseEtudes) {
  return metiers.filter((metier) => {
  
    if (reponseDomaine) {
      const domaineNorm = normalize(reponseDomaine);
      const mentionNorm = normalize(metier.mention);
      if (mentionNorm !== domaineNorm) return false;
    }
  
    if (reponseEtudes) {
      const niveau = (metier.niveau || "").trim(); 
      if (reponseEtudes === "court") {
        if (!NIVEAUX_COURTS.includes(niveau)) return false;
      } else if (reponseEtudes === "long") {
        if (!NIVEAUX_LONGS.includes(niveau)) return false;
      }
    }

    return true;
  });
}

export default function Section10({
  reponseDomaine,
  reponseEtudes,
  onRetour,
  onVoirParcours,
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [metiersFiltres, setMetiersFiltres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(
    "Connexion à la base de données…",
  );
  const touchStartX = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadEtFiltrer = async () => {
      setLoading(true);
      setMetiersFiltres([]);
      setIndex(0);
      setLoadingText("Connexion à la base de données…");

      try {
        const tous = await getAllMetiers();
        if (cancelled) return;

        setLoadingText("Application des filtres…");

        if (process.env.NODE_ENV === "development") {
          console.log("reponseDomaine:", reponseDomaine);
          console.log("reponseEtudes:", reponseEtudes);
          console.log("Exemple métier BDD:", tous[0]);
          console.log("Total avant filtre:", tous.length);
        }

        const filtres = filtrerMetiers(tous, reponseDomaine, reponseEtudes);

        if (process.env.NODE_ENV === "development") {
          console.log("Total après filtre:", filtres.length);
        }

        if (!cancelled) setMetiersFiltres(filtres);
      } catch (err) {
        console.error("Erreur chargement métiers:", err);
        if (!cancelled) setMetiersFiltres([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEtFiltrer();
    return () => {
      cancelled = true;
    };
  }, [reponseDomaine, reponseEtudes]);

  const total = metiersFiltres.length;
  const metier = metiersFiltres[index] ?? null;

  const handlePrev = () => setIndex((i) => (i - 1 + total) % total);
  const handleNext = () => setIndex((i) => (i + 1) % total);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? handleNext() : handlePrev();
    touchStartX.current = null;
  };

  const handleVoirParcours = () => {
    if (!metier) return;
    onVoirParcours?.({
      id: metier.id,
      label: metier.label,
      mention: metier.mention,
      niveau: metier.niveau,
      description: metier.description,
      serie: metier.serie || null,
      parcours: metier.parcours || null,
      categorie: metier.categorie || null,
    });
  };

  return (
    <div
      className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(135deg,#1250c8 0%,#1a6dcc 20%,#28b090 55%,#a0d820 80%,#c2e832 100%)",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <GradBg />

      {/* ✅ Page de chargement plein écran */}
      {loading && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
          style={{
            background:
              "linear-gradient(135deg,#1250c8 0%,#1a6dcc 20%,#28b090 55%,#a0d820 80%,#c2e832 100%)",
          }}
        >
          <GradBg />
          <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-white/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" />
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              />
            </div>
            <div>
              <p className="text-white font-black text-2xl mb-1">
                Métiers suggérés
              </p>
              <p className="text-white/70 text-sm font-medium animate-pulse">
                {loadingText}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {reponseDomaine && (
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  📚 {reponseDomaine}
                </span>
              )}
              {reponseEtudes && (
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  🎓 {reponseEtudes === "court" ? "≤ Bac+3" : "≥ Bac+4"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full w-full px-5 sm:px-8 pt-5 pb-4">
        <button
          onClick={onRetour}
          className="self-start shrink-0 text-white/80 hover:text-white transition-colors w-11 h-11 flex items-center justify-center"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={38} />
        </button>

        <div className="flex-1 min-h-0 overflow-y-auto py-2 scrollbar-hide">
          <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mt-2 mb-1">
            Métiers
            <br />
            suggérés
          </h1>

          {!loading && (
            <p className="text-sm text-white/75 mb-4 font-medium">
              <span className="text-white font-bold">{total}</span> métier
              {total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
            </p>
          )}

          <div
            className="w-full max-w-2xl mx-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Aucun résultat */}
            {!loading && total === 0 && (
              <div
                className="rounded-3xl p-8 flex flex-col items-center justify-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p className="text-white/85 text-center text-base leading-relaxed">
                  Désolé, aucun métier ne correspond à tes critères.
                  <br />
                  Essaie une autre combinaison.
                </p>
                {process.env.NODE_ENV === "development" && (
                  <p className="text-white/40 text-xs text-center mt-2 font-mono">
                    mention = «{reponseDomaine || "—"}»
                    <br />
                    niveau = «
                    {reponseEtudes === "court"
                      ? "Bac+2 ou Bac+3"
                      : reponseEtudes === "long"
                        ? "Bac+4 à Bac+8"
                        : "—"}
                    »
                  </p>
                )}
              </div>
            )}

            {/* Carte métier */}
            {!loading && total > 0 && metier && (
              <>
                <div
                  className="rounded-3xl p-5 sm:p-6 flex flex-col gap-3 slide-in"
                  key={metier.id || index}
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {metier.mention && metier.mention !== "—" && (
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.20)",
                          color: "white",
                        }}
                      >
                        {metier.mention}
                      </span>
                    </div>
                  )}

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug break-words">
                    {metier.label}
                  </h2>

                  {metier.description && (
                    <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                      {metier.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {metier.niveau && metier.niveau !== "Bac+2 ou Bac+3" && (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: "rgba(255,255,255,0.22)",
                          color: "white",
                        }}
                      >
                        Niveau : {metier.niveau}
                      </span>
                    )}
                    {metier.serie && (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        Série {metier.serie}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleVoirParcours}
                    className="mt-1 inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    style={{ background: "white", color: "#1250c8" }}
                  >
                    Voir le parcours
                    <FiArrowRight size={15} />
                  </button>
                </div>

                {/* Navigation dots */}
                <div className="flex items-center justify-between mt-4 mb-2">
                  <button
                    onClick={handlePrev}
                    disabled={total <= 1}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      color: "white",
                    }}
                    aria-label="Précédent"
                  >
                    <FiChevronLeft size={22} />
                  </button>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-[220px]">
                    {metiersFiltres.slice(0, 10).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className="rounded-full transition-all"
                        style={{
                          width: i === index ? "20px" : "8px",
                          height: "8px",
                          background:
                            i === index ? "white" : "rgba(255,255,255,0.4)",
                        }}
                        aria-label={`Métier ${i + 1}`}
                      />
                    ))}
                    {total > 10 && (
                      <span className="text-white/50 text-xs font-medium ml-1">
                        +{total - 10}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={total <= 1}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      color: "white",
                    }}
                    aria-label="Suivant"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </div>

                <p className="text-center text-white/50 text-xs mt-1">
                  {index + 1} / {total}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 flex justify-center pt-3 pb-1">
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
