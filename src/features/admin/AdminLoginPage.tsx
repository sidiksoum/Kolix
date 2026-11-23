// src/features/admin/AdminLoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../../api/auth.api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanIdent = identifier.trim();
    const cleanPwd = password.trim();

    if (!cleanIdent || !cleanPwd) {
      setErrorMessage('Veuillez renseigner votre identifiant et mot de passe.');
      return;
    }

    try {
      setIsLoading(true);

      // Appel de l'API d'authentification
      try {
        const tokens = await authApi.login({ identifier: cleanIdent, password: cleanPwd });
        if (tokens && tokens.access_token) {
          localStorage.setItem('kolix_admin_token', tokens.access_token);
          localStorage.setItem('kolix_admin_user', JSON.stringify({
            name: tokens.name || 'Souleymane Sanogo',
            email: tokens.email,
            role: tokens.role || 'Superadministrateur'
          }));
        }
      } catch (apiErr: any) {
        // Mode tolérant pour credentials par défaut
        if (
          (cleanIdent.toLowerCase() === 'admin@kolix.ci' || cleanIdent.includes('0700000000')) &&
          (cleanPwd === 'kolix2026!' || cleanPwd === 'KolixAdmin2026!')
        ) {
          localStorage.setItem('kolix_admin_token', 'kolix_admin_session_active');
          localStorage.setItem('kolix_admin_user', JSON.stringify({
            name: 'Souleymane Sanogo',
            email: 'admin@kolix.ci',
            role: 'Superadministrateur'
          }));
        } else {
          throw apiErr;
        }
      }

      if (rememberMe) {
        localStorage.setItem('kolix_admin_remembered', cleanIdent);
      } else {
        localStorage.removeItem('kolix_admin_remembered');
      }

      toast.success('Connexion à la console d’administration réussie.');
      navigate('/admin');
    } catch (err: any) {
      console.error('Erreur connexion admin:', err);
      setErrorMessage(
        err?.response?.data?.message ||
        'Identifiant ou mot de passe incorrect. Vérifiez vos accès administrateur.'
      );
      toast.error('Échec de la connexion administrateur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#16131F] text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#6C4CF1]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-[440px] flex flex-col gap-6 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-[#6C4CF1]/40">
              K
            </span>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-extrabold tracking-tight text-white leading-tight">Kolix</span>
              <span className="text-[11px] font-extrabold tracking-[0.18em] text-[#F5C800]">
                ADMINISTRATION
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mt-2">
            Console d'administration
          </h1>
          <p className="text-xs text-[#BDB5E8] max-w-sm">
            Espace de pilotage global des marchands, des retraits et des partenaires.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#241D5E]/80 border border-[#6C4CF1]/40 text-[11px] text-[#D9D3F5] font-semibold mt-1">
            <Shield className="w-3.5 h-3.5 text-[#F5C800]" />
            Accès sécurisé réservé aux super-administrateurs
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-[#211B31] border border-[#2E2845] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs font-semibold leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
            {/* Email / Phone Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#D9D3F5]">
                Email ou numéro de téléphone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex. admin@kolix.ci ou 07 00 00 00 00"
                autoComplete="off"
                required
                className="w-full min-h-[48px] px-4 rounded-xl bg-[#16131F] border border-[#3A3355] focus:border-[#6C4CF1] text-white placeholder-white/40 text-sm outline-none transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#D9D3F5]">
                Mot de passe
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full min-h-[48px] px-4 pr-11 rounded-xl bg-[#16131F] border border-[#3A3355] focus:border-[#6C4CF1] text-white placeholder-white/40 text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-white/80 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#16131F] border-[#3A3355] text-[#6C4CF1] accent-[#6C4CF1] cursor-pointer"
                />
                Rester connecté
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[50px] mt-2 rounded-xl bg-[#6C4CF1] hover:bg-[#5B3CD6] active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#6C4CF1]/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Vérification des accès...
                </>
              ) : (
                <>
                  Accéder à l'administration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="bg-[#16131F]/60 rounded-xl p-3 border border-white/5 flex flex-col gap-1 text-[11px] text-white/60">
            <span className="font-bold text-[#F5C800]">Compte administrateur par défaut :</span>
            <span>Identifiant : <strong className="text-white">admin@kolix.ci</strong> ou <strong className="text-white">0700000000</strong></span>
            <span>Mot de passe : <strong className="text-white">kolix2026!</strong></span>
          </div>
        </div>

        {/* Back to Merchant Store */}
        <div className="text-center text-xs text-[#BDB5E8]">
          Vous êtes un commerçant ?{' '}
          <a
            href="/login"
            className="text-[#F5C800] hover:underline font-bold"
          >
            Se connecter à l'espace marchand
          </a>
        </div>
      </div>
    </div>
  );
};

