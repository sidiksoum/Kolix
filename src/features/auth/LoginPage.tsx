import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('souleymane@kolix.ci');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez renseigner vos identifiants');
      return;
    }
    toast.success('Connexion réussie ! Bienvenue sur votre espace marchand.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4F1FE] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 no-underline">
        <span className="w-11 h-11 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center font-extrabold text-2xl shadow-kolix-cta">
          K
        </span>
        <span className="text-3xl font-extrabold text-[#241D5E] tracking-tight">Kolix</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-7 sm:p-9 shadow-kolix-lg border border-[#E2DCF8]/60 flex flex-col gap-6 animate-in fade-in zoom-in-95">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241D5E] tracking-tight">
            Espace marchand
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A70] mt-1 font-medium">
            Connectez-vous pour piloter vos commandes, stocks et portefeuilles COD
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">
              Adresse email ou numéro WhatsApp
            </label>
            <Input
              type="text"
              placeholder="ex: souleymane@kolix.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#5E5A70]">Mot de passe</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('Lien de réinitialisation envoyé par SMS/Email'); }} className="text-xs font-bold text-[#6C4CF1] hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5E5A70] hover:text-[#16131F] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#6C4CF1] accent-[#6C4CF1] cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs font-semibold text-[#16131F] cursor-pointer">
              Se souvenir de ma session sur cet appareil
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full rounded-2xl min-h-[48px] mt-2">
            <span>Se connecter à ma boutique</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              toast.success('Connexion Démo immédiate !');
              navigate('/dashboard');
            }}
            className="w-full rounded-2xl min-h-[44px]"
          >
            Accès démo rapide (Souleymane S.)
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-[#F0EDFB] text-xs text-[#5E5A70]">
          Pas encore de boutique ?{' '}
          <Link to="/register" className="font-extrabold text-[#6C4CF1] hover:underline">
            Créer un compte en 3 étapes
          </Link>
        </div>
      </div>
    </div>
  );
};
