import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../App";
import { getApiErrorMessage, getApiErrorStatus } from "../../api/errors";
import { useLoginMutation } from "../../hooks/mutations/useApiMutations";
import mesupresLogo from "../../assets/logo.png";
import BuildingSVG from "../acceuil/contenu/BuildingSVG";

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const loginMutation = useLoginMutation();
  const loading = loginMutation.isPending;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const triggerForgotPasswordToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!identifier.trim() || !password.trim()) {
      setErrors({ general: "Veuillez remplir tous les champs" });
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        identifier,
        password,
        rememberMe,
      });
      const { utilisateur, token } = response;

      authLogin(token, utilisateur.role, rememberMe, utilisateur);

      toast.success(`Bienvenue ${utilisateur.prenom} ${utilisateur.nom} !`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        if (utilisateur.role === "admin") {
          navigate("/dashboard/admin", { replace: true });
        } else {
          navigate("/acceuil/orientation", { replace: true });
        }
      }, 2000);
    } catch (error) {
      const message =
        getApiErrorMessage(error) ||
        "Erreur de connexion. Veuillez réessayer.";

      const status = getApiErrorStatus(error);

      if (status === 401 || status === 403) {
        setErrors({ general: message });
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else if (status === 422) {
        setErrors({ general: "Veuillez remplir tous les champs correctement." });
        toast.warning("Champs manquants ou invalides.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      } else {
        setErrors({ general: "Erreur serveur. Réessayez plus tard." });
        toast.error("Erreur serveur. Réessayez plus tard.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Toast Mot de passe oublié */}
      <div
        className={`fixed top-5 right-5 z-50 transition-all duration-500 transform ${
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-xl shadow-2xl p-4 w-80 flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-bold text-white leading-5">
              Mot de passe oublié ?
            </p>
            <p className="mt-1 text-sm leading-5 text-white/70">
              Contactez l'administrateur pour réinitialiser votre mot de passe.
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => setShowToast(false)}
              className="inline-flex text-white/50 hover:text-white/80 focus:outline-none transition ease-in-out duration-150"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 10 5.707 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="login-container relative w-full min-h-[100dvh] font-['Sora'] flex items-center justify-center p-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1250c8 0%, #1a6dcc 25%, #28b090 55%, #a0d820 80%, #c2e832 100%)",
        }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "120px",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-5"
          style={{
            background:
              "radial-gradient(circle at top right, #1565C0, transparent 70%)",
          }}
        />

        {/* Building SVG — fixé en bas */}
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
          <BuildingSVG />
        </div>

        {/* Carte glassmorphism */}
        <div className="login-card relative z-10 bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center overflow-hidden mb-4">
              <img
                src={mesupresLogo}
                alt="Logo MESUPRES"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Connexion
            </h2>
            <p className="mt-2 text-sm font-medium text-white/60">
              Orientation{" "}
              <span className="text-white font-bold">scolaire</span> &{" "}
              <span className="text-white font-bold">professionnelle</span>
            </p>
          </div>

          {/* Erreur générale */}
          {errors.general && (
            <div className="bg-red-500/15 border border-red-300/30 text-red-100 px-3 py-2 rounded-lg flex items-center text-xs mb-6 backdrop-blur-sm">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email / Nom d'utilisateur */}
            <div className="relative group">
              <input
                type="text"
                id="login_field"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                className="block px-3 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-lg border border-white/25 appearance-none focus:outline-none focus:ring-0 focus:border-white/60 peer placeholder:text-transparent"
                placeholder=" "
                required
                disabled={loading}
              />
              <label
                htmlFor="login_field"
                className="absolute text-sm text-white/55 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Email ou Nom d'utilisateur
              </label>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-white/40 group-focus-within:text-white transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password_field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block px-3 pb-2.5 pt-4 w-full text-sm text-white bg-transparent rounded-lg border border-white/25 appearance-none focus:outline-none focus:ring-0 focus:border-white/60 peer placeholder:text-transparent"
                placeholder=" "
                required
                disabled={loading}
              />
              <label
                htmlFor="password_field"
                className="absolute text-sm text-white/55 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Mot de passe
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/70 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4 group-focus-within:text-white transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 group-focus-within:text-white transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Rester connecté + Mot de passe oublié */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div
                    className={`w-4 h-4 border-2 rounded transition duration-200 ${
                      rememberMe
                        ? "bg-[#75B82A] border-[#75B82A]"
                        : "bg-white/10 border-white/30"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-2.5 h-2.5 text-white mx-auto mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-white/70 font-medium">
                  Rester connecté
                </span>
              </label>

              <button
                type="button"
                className="text-xs text-white/80 hover:text-white font-medium focus:outline-none underline underline-offset-2 decoration-white/30 hover:decoration-white/60 transition-colors"
                disabled={loading}
                onClick={triggerForgotPasswordToast}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton Se connecter */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1250c8] hover:bg-[#1a3ea8] text-white p-3 rounded-lg transition duration-200 font-black shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Se connecter</span>
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/15">
            <div className="text-center text-xs text-white/50">
              <p>© 2026 MESUPRES — Tous droits réservés</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
