import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const CHOIX_ETUDES = [
  {
    value: "court",
    label: "Faire des études courtes (moins de 3 ans)",
  },
  {
    value: "long",
    label: "Faire des études longues (plus de 3 ans)",
  },
];

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

export default function Section9({ onVoirResultats, onRetour }) {
  const navigate = useNavigate();
  const [choix, setChoix] = useState(null);

  const handleChoix = (item) => {
    setChoix(item.value);
    onVoirResultats?.(item.value);
  };

  return (
    <div className="relative w-full h-screen font-['Sora'] overflow-hidden flex flex-col bg-gradient-to-br from-[#1250c8] via-[#1a6dcc] via-[#28b090] via-[#a0d820] to-[#c2e832]">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <GradBg />

      <div className="relative z-10 flex flex-col h-full w-full px-5 sm:px-8 pt-5 pb-4">

        {/* Back button */}
        <button
          onClick={onRetour}
          className="self-start text-white/80 hover:text-white transition-colors flex items-center justify-center p-0"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={42} />
        </button>

        {/* Zone scrollable - centrée verticalement et horizontalement */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide flex flex-col justify-center items-center">
          <div className="flex flex-col items-center text-center w-full max-w-lg">

            {/* ✅ Titre original */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight mb-4">
              Tu te vois
              <br />
              plutôt…
            </h1>

            {/* Sous-texte centré */}
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xs sm:max-w-md lg:max-w-sm mb-6">
              Choisis le type de parcours qui te correspond.
            </p>

            {/* ✅ Design original : pills centrées */}
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-md mb-8">
              {CHOIX_ETUDES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleChoix(item)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    choix === item.value
                      ? "bg-white text-[#1250c8] border-white shadow-lg"
                      : "bg-white/10 text-white border-white/40 hover:bg-white/25"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Home — pas de bouton "Voir les résultats" */}
        <div className="shrink-0 flex justify-center pt-4 pb-2">
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
