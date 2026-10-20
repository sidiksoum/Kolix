import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Check, ArrowRight, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type LoginMode = 'phone' | 'email';
type LoginView = 'login' | 'code' | 'done';

const flagMap: Record<string, string> = {
  '+225': 'linear-gradient(90deg, #F77F00 33.3%, #FFFFFF 33.3% 66.6%, #009E60 66.6%)',
  '+221': 'linear-gradient(90deg, #00853F 33.3%, #FDEF42 33.3% 66.6%, #E31B23 66.6%)',
  '+223': 'linear-gradient(90deg, #14B53A 33.3%, #FCD116 33.3% 66.6%, #CE1126 66.6%)',
  '+226': 'linear-gradient(180deg, #EF2B2D 50%, #009E49 50%)',
  '+224': 'linear-gradient(90deg, #CE1126 33.3%, #FCD116 33.3% 66.6%, #009460 66.6%)',
  '+227': 'linear-gradient(180deg, #E05206 33.3%, #FFFFFF 33.3% 66.6%, #0DB02B 66.6%)',
  '+229': 'linear-gradient(90deg, #008751 40%, transparent 40%), linear-gradient(180deg, #FCD116 50%, #E8112D 50%)',
  '+228': 'linear-gradient(#D21034, #D21034) 0 0 / 40% 60% no-repeat, linear-gradient(180deg, #006A4E 0 20%, #FFCE00 20% 40%, #006A4E 40% 60%, #FFCE00 60% 80%, #006A4E 80%)',
  '+237': 'linear-gradient(90deg, #007A5E 33.3%, #CE1126 33.3% 66.6%, #FCD116 66.6%)',
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<LoginView>('login');
  const [mode, setMode] = useState<LoginMode>('phone');
  const [dial, setDial] = useState('+225');
  const [identifier, setIdentifier] = useState('0700000001');
  const [password, setPassword] = useState('motdepasse123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  
  // Code / OTP state
  const [otp, setOtp] = useState('');
  const [isReset, setIsReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier) {
      setError(mode === 'phone' ? 'Veuillez saisir votre numéro WhatsApp' : 'Veuillez saisir votre adresse e-mail');
      return;
    }
    if (!password) {
      setError('Veuillez saisir votre mot de passe');
      return;
    }
    setError('');
    setView('done');
    toast.success('Identifiants vérifiés avec succès !');
  };

  const handleUseCode = () => {
    setIsReset(false);
    setView('code');
    toast.info(`Code de connexion envoyé par WhatsApp au ${dial} ${identifier || '[votre numéro]'}`);
  };

  const handleForgot = () => {
    setIsReset(true);
    setView('code');
    toast.info(`Code de réinitialisation envoyé par WhatsApp au ${dial} ${identifier || '[votre numéro]'}`);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      setError('Veuillez saisir le code à 6 chiffres');
      return;
    }
    setError('');
    setView('done');
    toast.success(isReset ? 'Mot de passe réinitialisé avec succès !' : 'Connexion validée !');
  };

  const idShown = mode === 'phone' ? (identifier || '07 •• •• •• 01') : 'votre numéro lié';

  return (
    <div className="font-sans text-[#16131F] bg-[#F4F1FE] min-h-screen flex flex-col items-center justify-center p-5 sm:p-8">
      {/* Kolix Header Branding */}
      <Link to="/" className="flex items-center gap-3 no-underline text-[#16131F] mb-6 group">
        <span className="w-12 h-12 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-[#6C4CF1]/25 group-hover:scale-105 transition-transform">
          K
        </span>
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold tracking-tight leading-none text-[#16131F]">Kolix</span>
          <span className="text-xs font-bold text-[#3F25A8] tracking-wider mt-0.5">Votre succès, notre mission</span>
        </div>
      </Link>

      {/* Main Login Card */}
      <div className="w-full max-w-[500px]">
        <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-[#241D5E]/10 border border-[#E2DCF8]/60 flex flex-col gap-6">
          
          {/* VIEW 1: NORMAL LOGIN */}
          {view === 'login' && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16131F] tracking-tight">
                  Bon retour sur Kolix !
                </h1>
                <p className="text-xs sm:text-sm text-[#5E5A70] mt-1 font-medium">
                  Connectez-vous à votre espace marchand, collaborateur ou partenaire.
                </p>
              </div>

              {/* Identifier Tabs */}
              <div className="grid grid-cols-2 bg-[#F4F1FE] rounded-2xl p-1 gap-1 border border-[#E2DCF8]/40">
                <button
                  type="button"
                  onClick={() => { setMode('phone'); setError(''); }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'phone' 
                      ? 'bg-white text-[#16131F] font-extrabold shadow-sm' 
                      : 'text-[#5E5A70] hover:text-[#16131F]'
                  }`}
                >
                  Numéro WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('email'); setError(''); }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'email' 
                      ? 'bg-white text-[#16131F] font-extrabold shadow-sm' 
                      : 'text-[#5E5A70] hover:text-[#16131F]'
                  }`}
                >
                  E-mail
                </button>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* Identifier Input */}
                {mode === 'phone' ? (
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-2xl px-3 min-h-[52px] bg-white focus-within:ring-2 focus-within:ring-[#6C4CF1]/30 transition-all">
                    {/* Flag */}
                    <span 
                      style={{ background: flagMap[dial] }} 
                      className="w-6 h-4 rounded-xs shadow-xs flex-shrink-0" 
                    />
                    <select
                      value={dial}
                      onChange={(e) => setDial(e.target.value)}
                      className="font-bold text-xs bg-transparent border-0 text-[#16131F] focus:outline-none cursor-pointer"
                    >
                      {Object.keys(flagMap).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <span className="w-px h-6 bg-[#E2DCF8]" />
                    <input
                      type="tel"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Numéro WhatsApp"
                      className="flex-1 min-w-0 font-bold text-sm border-0 bg-transparent text-[#16131F] focus:outline-none px-2"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 border border-[#E2DCF8] rounded-2xl px-4 min-h-[52px] bg-white focus-within:ring-2 focus-within:ring-[#6C4CF1]/30 transition-all">
                    <Mail className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Adresse e-mail du compte"
                      className="flex-1 min-w-0 font-bold text-sm border-0 bg-transparent text-[#16131F] focus:outline-none"
                    />
                  </div>
                )}

                {/* Password Input */}
                <div className="flex items-center gap-2.5 border border-[#E2DCF8] rounded-2xl px-4 min-h-[52px] bg-white focus-within:ring-2 focus-within:ring-[#6C4CF1]/30 transition-all">
                  <Lock className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="flex-1 min-w-0 font-bold text-sm border-0 bg-transparent text-[#16131F] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#5E5A70] hover:text-[#16131F] p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember & Forgot Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <label className="flex items-center gap-2 text-[#3A3647] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-[#6C4CF1]"
                    />
                    <span>Rester connecté sur cet appareil</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="font-extrabold text-[#3F25A8] hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Primary Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all mt-1"
                >
                  Se connecter
                </button>
              </form>

              {/* Login via WhatsApp OTP */}
              <button
                type="button"
                onClick={handleUseCode}
                className="w-full py-3 bg-white text-[#16131F] border border-[#CFC7F2] font-extrabold rounded-2xl text-sm hover:bg-[#FAF9FE] active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <MessageSquare className="w-4 h-4 text-[#1F7A4D]" />
                Recevoir un code sur WhatsApp
              </button>

              {/* Separator */}
              <div className="flex items-center gap-3 text-xs text-[#5E5A70] my-1">
                <span className="flex-1 h-px bg-[#EEEAFB]" />
                <span>Ou</span>
                <span className="flex-1 h-px bg-[#EEEAFB]" />
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={() => {
                  setView('done');
                  toast.success('Authentification Google réussie !');
                }}
                className="w-full py-3 bg-white text-[#16131F] border border-[#E2DCF8] font-extrabold rounded-2xl text-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black">
                  G
                </span>
                Continuer avec Google
              </button>
            </div>
          )}

          {/* VIEW 2: OTP / CODE WHATSAPP */}
          {view === 'code' && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-extrabold text-[#16131F] tracking-tight">
                  {isReset ? 'Réinitialisation mot de passe' : 'Code de connexion rapide'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5E5A70] mt-1 leading-relaxed">
                  Code à 6 chiffres envoyé sur WhatsApp au <strong>{dial} {idShown}</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#3A3647] block mb-1.5">Code de connexion</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.5em] text-2xl font-black py-3.5 border border-[#E2DCF8] rounded-2xl text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 bg-[#FAF9FE]"
                  />
                </div>

                {isReset && (
                  <div className="flex items-center gap-2.5 border border-[#E2DCF8] rounded-2xl px-4 min-h-[50px] bg-white">
                    <Lock className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe (8 car. min.)"
                      className="flex-1 min-w-0 font-bold text-sm border-0 bg-transparent text-[#16131F] focus:outline-none"
                    />
                  </div>
                )}

                {error && (
                  <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all"
                >
                  {isReset ? 'Enregistrer et se connecter' : 'Vérifier et se connecter'}
                </button>

                <div className="flex justify-between items-center text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => { setView('login'); setError(''); }}
                    className="font-extrabold text-[#3F25A8] hover:underline"
                  >
                    ← Retour à la connexion
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success('Nouveau code envoyé par WhatsApp !')}
                    className="font-extrabold text-[#3F25A8] hover:underline"
                  >
                    Renvoyer le code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: SUCCESS / DONE */}
          {view === 'done' && (
            <div className="flex flex-col gap-5 text-center items-center py-2 animate-fade-in">
              <span className="w-16 h-16 rounded-full bg-[#E3F4EC] text-[#1E5E3F] flex items-center justify-center shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </span>

              <div>
                <h2 className="text-2xl font-extrabold text-[#16131F] tracking-tight">Connexion réussie !</h2>
                <p className="text-xs sm:text-sm text-[#5E5A70] mt-1">
                  Vous retrouvez votre dernière boutique active.
                </p>
              </div>

              {/* Active Shop Preview Card */}
              <div className="w-full flex items-center gap-3 bg-[#F4F1FE] rounded-2xl p-4 text-left border border-[#E2DCF8]">
                <span className="w-11 h-11 rounded-xl bg-[#C93C72] text-white flex items-center justify-center font-extrabold text-base flex-shrink-0">
                  S
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-extrabold text-sm text-[#16131F] block truncate">Style & Élégance</span>
                  <span className="text-xs text-[#5E5A70] block truncate">styleelegance.kolix.shop · Kolix Grow</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Ouvrir mon tableau de bord</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="text-xs font-bold text-[#5E5A70] hover:text-[#16131F]"
              >
                Changer de compte
              </button>
            </div>
          )}

          {/* Card Footer */}
          <div className="border-t border-[#F0EDFB] pt-4 flex flex-col items-center gap-1.5 text-xs text-[#5E5A70]">
            <div>
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-extrabold text-[#3F25A8] hover:underline">
                Créer un compte gratuitement
              </Link>
            </div>
            <div>
              Besoin d’aide ? Contactez notre{' '}
              <a href="#support" className="font-extrabold text-[#3F25A8] hover:underline">
                équipe support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
