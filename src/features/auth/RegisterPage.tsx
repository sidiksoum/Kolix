import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Store, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  CreditCard,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { cn } from '../../utils/cn';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Profile
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Shop & Niche
  const [shopName, setShopName] = useState('');
  const [niche, setNiche] = useState('Mode féminine');
  const [city, setCity] = useState('Abidjan (Côte d’Ivoire)');
  const [hasCourier, setHasCourier] = useState('oui');

  // Step 3: Payments & Plan
  const [selectedPlan, setSelectedPlan] = useState<'grow' | 'starter'>('grow');
  const [preferredPayment, setPreferredPayment] = useState<'wave' | 'orange' | 'cash'>('wave');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const niches = [
    'Mode féminine',
    'Beauté, cosmétiques et soins capillaires',
    'Électronique et gadgets',
    'Maison et électroménager',
    'Compléments alimentaires et bien-être',
    'Mode masculine',
    'Bijoux et accessoires',
    'Enfants et puériculture',
    'Articles religieux et spirituels',
    'Produits locaux et artisanat',
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!name || !phone || !email || !password) {
        toast.error('Veuillez remplir tous les champs de votre profil');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!shopName) {
        toast.error('Veuillez indiquer le nom de votre boutique');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!acceptedTerms) {
        toast.error('Veuillez accepter les conditions d’utilisation');
        return;
      }
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      toast.success('Boutique créée avec succès ! Bienvenue sur Kolix.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1FE] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-6 no-underline">
        <span className="w-11 h-11 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center font-extrabold text-2xl shadow-kolix-cta">
          K
        </span>
        <span className="text-3xl font-extrabold text-[#241D5E] tracking-tight">Kolix</span>
      </Link>

      {/* 3-Step Wizard Container */}
      <div className="w-full max-w-[540px] bg-white rounded-3xl p-7 sm:p-9 shadow-kolix-lg border border-[#E2DCF8]/60 flex flex-col gap-6 animate-in fade-in zoom-in-95">
        {/* Step Indicator Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#5E5A70]">
            <span className={cn(currentStep >= 1 && 'text-[#6C4CF1]')}>1. Profil marchand</span>
            <span className={cn(currentStep >= 2 && 'text-[#6C4CF1]')}>2. Votre boutique COD</span>
            <span className={cn(currentStep >= 3 && 'text-[#6C4CF1]')}>3. Plan & Paiements</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6C4CF1] rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Title by step */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241D5E] tracking-tight">
            {currentStep === 1 && 'Créez votre profil marchand'}
            {currentStep === 2 && 'Configurez votre boutique en ligne'}
            {currentStep === 3 && 'Encaissement & Démarrage immédiat'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A70] mt-1 font-medium">
            {currentStep === 1 && 'Vos identifiants de connexion sécurisés pour gérer vos ventes.'}
            {currentStep === 2 && 'Choisissez votre niche pour pré-charger le template le plus rentable.'}
            {currentStep === 3 && 'Aucune carte bancaire requise. 7 jours d’essai 100% gratuit.'}
          </p>
        </div>

        <form onSubmit={handleNextStep} className="flex flex-col gap-4">
          {/* STEP 1: Profile */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-3.5 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Nom et Prénom *</label>
                <Input
                  placeholder="Ex: Aya Kouassi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Numéro WhatsApp *</label>
                <Input
                  placeholder="Ex: +225 07 08 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Adresse email *</label>
                <Input
                  type="email"
                  placeholder="aya@maboutique.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Mot de passe secret *</label>
                <Input
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Shop & Niche */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-3.5 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Nom de votre boutique *</label>
                <Input
                  placeholder="Ex: Élégance & Beauté Abidjan"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  icon={<Store className="w-4 h-4" />}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Niche e-commerce COD *</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full min-h-[46px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold text-[#16131F]"
                >
                  {niches.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Ville principale de livraison *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full min-h-[46px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold text-[#16131F]"
                >
                  <option value="Abidjan (Côte d’Ivoire)">Abidjan (Côte d’Ivoire)</option>
                  <option value="Bouaké / Intérieur CI">Bouaké / Intérieur CI</option>
                  <option value="Dakar (Sénégal)">Dakar (Sénégal)</option>
                  <option value="Douala / Yaoundé (Cameroun)">Douala / Yaoundé (Cameroun)</option>
                  <option value="Cotonou (Bénin)">Cotonou (Bénin)</option>
                  <option value="Lomé (Togo)">Lomé (Togo)</option>
                  <option value="Bamako (Mali)">Bamako (Mali)</option>
                  <option value="Ouagadougou (Burkina)">Ouagadougou (Burkina)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Avez-vous déjà un réseau de livreurs ?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHasCourier('oui')}
                    className={cn('py-2.5 rounded-xl text-xs font-bold border transition-all', hasCourier === 'oui' ? 'bg-[#241D5E] text-white border-[#241D5E]' : 'bg-[#FAF8FF] border-[#E2DCF8] text-[#5E5A70]')}
                  >
                    Oui, mes propres livreurs
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasCourier('non')}
                    className={cn('py-2.5 rounded-xl text-xs font-bold border transition-all', hasCourier === 'non' ? 'bg-[#241D5E] text-white border-[#241D5E]' : 'bg-[#FAF8FF] border-[#E2DCF8] text-[#5E5A70]')}
                  >
                    Non, je veux un réseau partenaire
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payments & Plan */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Moyen d’encaissement favori pour vos retraits
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wave', label: 'Wave', color: 'border-[#1DC4FF]' },
                    { id: 'orange', label: 'Orange Money', color: 'border-[#FF7900]' },
                    { id: 'cash', label: 'Espèces', color: 'border-[#F5C800]' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreferredPayment(p.id as any)}
                      className={cn(
                        'py-2.5 px-3 rounded-2xl text-xs font-extrabold border-2 transition-all cursor-pointer',
                        preferredPayment === p.id
                          ? 'bg-[#241D5E] text-white border-[#241D5E]'
                          : 'bg-[#FAF8FF] text-[#16131F] border-[#E2DCF8]'
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Formule d’essai</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedPlan('grow')}
                    className={cn(
                      'p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2',
                      selectedPlan === 'grow'
                        ? 'border-[#6C4CF1] bg-[#F4F1FE]'
                        : 'border-[#E2DCF8] bg-white'
                    )}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm text-[#241D5E]">Kolix Grow</span>
                        <span className="text-[10px] font-extrabold bg-[#F5C800] text-[#16131F] px-2 py-0.5 rounded-full">Recommandé</span>
                      </div>
                      <div className="text-xs text-[#5E5A70] mt-1">Jusqu'à 1 500 commandes / mois</div>
                    </div>
                    <div className="text-xs font-extrabold text-[#6C4CF1]">7 jours d’essai 100% gratuit</div>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('starter')}
                    className={cn(
                      'p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2',
                      selectedPlan === 'starter'
                        ? 'border-[#6C4CF1] bg-[#F4F1FE]'
                        : 'border-[#E2DCF8] bg-white'
                    )}
                  >
                    <div>
                      <span className="font-extrabold text-sm text-[#241D5E]">Kolix Starter</span>
                      <div className="text-xs text-[#5E5A70] mt-1">Jusqu'à 200 commandes / mois</div>
                    </div>
                    <div className="text-xs font-extrabold text-[#5E5A70]">15 000 FCFA / mois</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#6C4CF1] accent-[#6C4CF1] mt-0.5 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs font-medium text-[#5E5A70] cursor-pointer leading-tight">
                  J’accepte les Conditions Générales de Vente et la Politique de Confidentialité de Kolix.
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#F0EDFB]">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="rounded-2xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour
              </Button>
            )}

            <Button type="submit" variant="primary" className="flex-1 rounded-2xl min-h-[48px]">
              <span>
                {currentStep < 3 ? 'Continuer' : 'Lancer ma boutique Kolix'}
              </span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-[#5E5A70]">
          Vous avez déjà un compte marchand ?{' '}
          <Link to="/login" className="font-extrabold text-[#6C4CF1] hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};
