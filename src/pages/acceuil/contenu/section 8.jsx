import { useState, useEffect, useMemo } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome, HiChevronDown, HiCheck } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getAllDomaines } from "../../../services/domaine.services";

function GradBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 opacity-90 scale-110 lg:scale-125 origin-top-right">
        <svg width="260" height="240" viewBox="0 0 260 240" fill="none">
          <path d="M130 38 L232 94 L130 150 L28 94 Z" stroke="white" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
          <path d="M52 108 Q52 160 130 188 Q208 160 208 108" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <line x1="232" y1="94" x2="232" y2="148" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="232" cy="155" r="7" fill="white" />
          <line x1="130" y1="150" x2="130" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4" />
          <circle cx="130" cy="94" r="5" fill="white" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="50"  y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="100" y="50" width="25" height="50" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="absolute top-[42%] left-0 right-0 opacity-15">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export default function Section8({ onSuivant, onRetour, onHome }) {
  const navigate    = useNavigate();
  const [allDomaines, setAllDomaines] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [open,        setOpen]        = useState(false);
  const [search,      setSearch]      = useState("");
  const [selected,    setSelected]    = useState(null); 

  useEffect(() => {
    const loadDomaines = async () => {
      try {
        const domaines = await getAllDomaines();
        setAllDomaines(domaines);
      } catch (error) {
        console.error("Erreur chargement domaines:", error);
        setAllDomaines([]);
      } finally {
        setLoading(false);
      }
    };
    loadDomaines();
  }, []);

  const domaineOptions = useMemo(() => {
    return allDomaines.map((d) => ({
      value: d.id || d.label,
      label: d.label,
    }));
  }, [allDomaines]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return domaineOptions;
    return domaineOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [search, domaineOptions]);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    setSearch("");
    onSuivant?.(option.label);
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832] items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Chargement des domaines…</p>
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

        {/* Zone scrollable - centrée verticalement et horizontalement */}
        <div className="flex-1 min-h-0 overflow-y-auto py-4 scrollbar-hide flex flex-col justify-center items-center">
          <div className="flex flex-col items-center text-center w-full max-w-lg">

            <div className={`transition-all duration-500 ease-in-out ${open ? "-translate-y-12 opacity-30" : "translate-y-0 opacity-100"}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mb-4">
                Explorer par<br />domaine
              </h1>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xs sm:max-w-md mb-6">
                Sélectionne le domaine qui t'intéresse pour découvrir
                immédiatement les métiers disponibles.
              </p>
            </div>

            {/* ✅ FIX : Combobox inline — sélection = navigation directe */}
            <div className="w-full max-w-sm relative">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full bg-white/95 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span className={`text-sm font-semibold truncate ${selected ? "text-[#1250c8]" : "text-gray-400"}`}>
                  {selected ? selected.label : "Choisir un domaine…"}
                </span>
                <HiChevronDown
                  className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>

              {open && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                  {/* Recherche dans le dropdown */}
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <HiOutlineSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={14}
                      />
                      <input
                        autoFocus
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un domaine…"
                        className="w-full bg-gray-50 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1250c8]/30"
                      />
                    </div>
                  </div>

                  {/* Liste des options */}
                  <ul className="max-h-56 overflow-y-auto p-1.5 scrollbar-gray">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((o) => (
                        <li key={o.value}>
                          <button
                            type="button"
                            onClick={() => handleSelect(o)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between gap-2 ${
                              selected?.value === o.value
                                ? "bg-[#1250c8] text-white"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {o.label}
                            {selected?.value === o.value && <HiCheck size={14} />}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-3 text-sm text-gray-400 text-center">
                        Aucun résultat
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* ✅ Indicateur visuel si un domaine est déjà sélectionné (après retour arrière) */}
            {selected && (
              <p className="mt-4 text-white/70 text-sm font-medium animate-fadeIn">
                ✓ «{selected.label}» sélectionné — navigation en cours…
              </p>
            )}
          </div>
        </div>

        {/* Home */}
        <div className="shrink-0 flex justify-center pt-3 pb-1">
          <button
            onClick={onHome}
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
        .scrollbar-gray::-webkit-scrollbar { width: 6px; }
        .scrollbar-gray::-webkit-scrollbar-track { background: rgba(15,23,42,0.04); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.20); border-radius: 999px; }
        .scrollbar-gray::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.30); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
    </div>
  );
}
