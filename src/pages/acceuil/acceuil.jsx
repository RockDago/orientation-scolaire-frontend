import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import Section1  from "./contenu/section 1";
import Section2  from "./contenu/section 2";
import Section3  from "./contenu/section 3";
import Section4  from "./contenu/section 4";
import Section5  from "./contenu/section 5";
import Section6  from "./contenu/section 6";
import Section7  from "./contenu/section 7";
import Section8  from "./contenu/section 8";
import Section9  from "./contenu/section 9";
import Section10 from "./contenu/section 10";
import Section11 from "./contenu/section 11";

import {
  trackPageView,
  trackMetierSearch,
} from "../../services/dashboard.services";

import { toSearchSlug } from "../../utils/slug";

function Section2Wrapper(props) {
  const { slug } = useParams();
  const searchParam = slug ? decodeURIComponent(slug.replace(/-/g, " ")) : "";
  return <Section2 {...props} searchParam={searchParam} />;
}

function Section3Wrapper({ metierSelectionne, setMetierSelectionne, ...props }) {
  const { slug } = useParams();
  return (
    <Section3
      {...props}
      metier={metierSelectionne}
      slugFromUrl={slug ?? null}
      onMetierLoaded={setMetierSelectionne}
    />
  );
}

export default function Acceuil() {
  const navigate = useNavigate();
  const location = useLocation();

  const [metierSelectionne,            setMetierSelectionne]            = useState(null);
  const [regionSelectionnee,           setRegionSelectionnee]           = useState(null);
  const [reponseStatut,                setReponseStatut]                = useState(null);
  const [reponseDomaine,               setReponseDomaine]               = useState(null);
  const [reponseEtudes,                setReponseEtudes]                = useState(null);
  const [metierOrientationSelectionne, setMetierOrientationSelectionne] = useState(null);
  const [sourceFlux,                   setSourceFlux]                   = useState("metier");
  const [animDir,                      setAnimDir]                      = useState("forward");

  const naviguerVers = (path, direction = "forward") => {
    setAnimDir(direction);
    navigate(path);
  };

  useEffect(() => {
    const t = setTimeout(() => setAnimDir("idle"), 300);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const trackingInFlight = useRef(new Set());

  useEffect(() => {
    const page     = location.pathname;
    const metierId = metierSelectionne?.id ?? null;
    if (trackingInFlight.current.has(page)) return;
    trackingInFlight.current.add(page);
    trackPageView(page, metierId).finally(() => {
      trackingInFlight.current.delete(page);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const naviguerVersMetier = (metier, direction = "forward") => {
    const slug = toSearchSlug(metier.label);
    naviguerVers(`/acceuil/metier/${slug}`, direction);
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-forward { animation: slideInRight 0.28s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }
        .anim-back    { animation: slideInLeft  0.28s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }
        .anim-idle    { animation: none; }
      `}</style>

      <div className="w-full h-screen overflow-hidden bg-white">
        <div className="w-full h-full">
          <div
            key={location.pathname}
            className={
              animDir === "forward" ? "anim-forward" :
              animDir === "back"    ? "anim-back"    :
                                      "anim-idle"
            }
            style={{ height: "100%" }}
          >
            <Routes>

              {/* ── S1 : Accueil ── */}
              <Route
                path="/orientation"
                element={
                  <Section1
                    onChoisirMetier={() => {
                      setSourceFlux("metier");
                      naviguerVers("/acceuil/trouver-metier", "forward");
                    }}
                    onOrientation={() => {
                      setSourceFlux("orientation");
                      naviguerVers("/acceuil/trouver-mon-orientation", "forward");
                    }}
                  />
                }
              />

              {/* ── S2 : Choisir un métier ── */}
              {/* /acceuil/trouver-metier  ou  /acceuil/trouver-metier/developpeur-web */}
              <Route
                path="/trouver-metier/:slug?"
                element={
                  <Section2Wrapper
                    selectedMetier={metierSelectionne}
                    onSelectMetier={(metier) => {
                      trackMetierSearch(metier.id, metier.label);
                      setMetierSelectionne(metier);
                      setReponseDomaine(null);
                      naviguerVersMetier(metier, "forward");
                    }}
                    onRetour={() => naviguerVers("/acceuil/orientation", "back")}
                  />
                }
              />

              {/* ── S3 : Détail métier ── */}
              {/* /acceuil/metier/developpeur-full-stack */}
              {/* Résistant au refresh : Section3 recharge depuis BDD via slugFromUrl */}
              <Route
                path="/metier/:slug"
                element={
                  <Section3Wrapper
                    metierSelectionne={metierSelectionne}
                    setMetierSelectionne={setMetierSelectionne}
                    onRetour={() => naviguerVers("/acceuil/trouver-metier", "back")}
                    onVoirCarte={(metier) => {
                      if (metier) setMetierSelectionne(metier);
                      naviguerVers("/acceuil/region-map-madagascar", "forward");
                    }}
                  />
                }
              />

              {/* ── S5 : Carte des régions ── */}
              <Route
                path="/region-map-madagascar"
                element={
                  <Section5
                    metier={metierSelectionne}
                    reponseDomaine={reponseDomaine}
                    onRetour={() => {
                      if (sourceFlux === "orientation") {
                        naviguerVers("/acceuil/parcours-formation", "back");
                      } else {
                        const slug = metierSelectionne
                          ? toSearchSlug(metierSelectionne.label)
                          : null;
                        naviguerVers(
                          slug ? `/acceuil/metier/${slug}` : "/acceuil/trouver-metier",
                          "back"
                        );
                      }
                    }}
                    onSelectRegion={(regionId) => {
                      setRegionSelectionnee(regionId);
                      naviguerVers("/acceuil/universiter-parcours", "forward");
                    }}
                  />
                }
              />

              {/* ── S4 : Liste établissements ── */}
              <Route
                path="/universiter-parcours"
                element={
                  <Section4
                    metier={metierSelectionne}
                    selectedRegion={regionSelectionnee}
                    reponseDomaine={reponseDomaine}
                    onRetour={() => naviguerVers("/acceuil/region-map-madagascar", "back")}
                  />
                }
              />

              {/* ── S6 : Orientation intro ── */}
              <Route
                path="/trouver-mon-orientation"
                element={
                  <Section6
                    onRetour={() => naviguerVers("/acceuil/orientation", "back")}
                    onCommencer={() => naviguerVers("/acceuil/recommendation", "forward")}
                  />
                }
              />

              {/* ── S7 : Tu es actuellement ── */}
              <Route
                path="/recommendation"
                element={
                  <Section7
                    onRetour={() => naviguerVers("/acceuil/trouver-mon-orientation", "back")}
                    onSuivant={(statut) => {
                      setReponseStatut(statut);
                      naviguerVers("/acceuil/trouver-domaine", "forward");
                    }}
                  />
                }
              />

              {/* ── S8 : Quel domaine/mention ── */}
              <Route
                path="/trouver-domaine"
                element={
                  <Section8
                    onRetour={() => naviguerVers("/acceuil/recommendation", "back")}
                    onSuivant={(domaine) => {
                      setReponseDomaine(domaine);
                      naviguerVers("/acceuil/type-etude", "forward");
                    }}
                  />
                }
              />

              {/* ── S9 : Type d'études ── */}
              <Route
                path="/type-etude"
                element={
                  <Section9
                    reponseDomaine={reponseDomaine}
                    onRetour={() => naviguerVers("/acceuil/trouver-domaine", "back")}
                    onVoirResultats={(choixEtudes) => {
                      setReponseEtudes(choixEtudes);
                      naviguerVers("/acceuil/metier-suggerer", "forward");
                    }}
                  />
                }
              />

              {/* ── S10 : Métiers suggérés ── */}
              <Route
                path="/metier-suggerer"
                element={
                  <Section10
                    reponseStatut={reponseStatut}
                    reponseDomaine={reponseDomaine}
                    reponseEtudes={reponseEtudes}
                    onRetour={() => naviguerVers("/acceuil/type-etude", "back")}
                    onVoirParcours={(metier) => {
                      setMetierOrientationSelectionne(metier);
                      naviguerVers("/acceuil/parcours-formation", "forward");
                    }}
                  />
                }
              />

              {/* ── S11 : Parcours de formation ── */}
              <Route
                path="/parcours-formation"
                element={
                  <Section11
                    metier={metierOrientationSelectionne}
                    onRetour={() => naviguerVers("/acceuil/metier-suggerer", "back")}
                    onVoirFormations={(metier) => {
                      setMetierSelectionne(metier);
                      setSourceFlux("orientation");
                      naviguerVers("/acceuil/region-map-madagascar", "forward");
                    }}
                  />
                }
              />

              {/* ── Redirections ── */}
              <Route path="/"  element={<Navigate to="/acceuil/orientation" replace />} />
              <Route path="*"  element={<Navigate to="/acceuil/orientation" replace />} />

            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}