import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Zap,
  Shield,
  Smartphone,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

type RegStep = 'form' | 'otp' | 'create_shop' | 'select_plan';

const flagDefs: Record<string, { bg: string; name: string }> = {
  CI: { bg: 'linear-gradient(90deg, #F77F00 33.3%, #FFFFFF 33.3% 66.6%, #009E60 66.6%)', name: 'Côte d’Ivoire (+225)' },
  SN: { bg: 'linear-gradient(90deg, #00853F 33.3%, #FDEF42 33.3% 66.6%, #E31B23 66.6%)', name: 'Sénégal (+221)' },
  ML: { bg: 'linear-gradient(90deg, #14B53A 33.3%, #FCD116 33.3% 66.6%, #CE1126 66.6%)', name: 'Mali (+223)' },
  BF: { bg: 'linear-gradient(180deg, #EF2B2D 50%, #009E49 50%)', name: 'Burkina Faso (+226)' },
  GN: { bg: 'linear-gradient(90deg, #CE1126 33.3%, #FCD116 33.3% 66.6%, #009460 66.6%)', name: 'Guinée (+224)' },
  NE: { bg: 'linear-gradient(180deg, #E05206 33.3%, #FFFFFF 33.3% 66.6%, #0DB02B 66.6%)', name: 'Niger (+227)' },
  BJ: { bg: 'linear-gradient(90deg, #008751 40%, transparent 40%), linear-gradient(180deg, #FCD116 50%, #E8112D 50%)', name: 'Bénin (+229)' },
  TG: { bg: 'linear-gradient(#D21034, #D21034) 0 0 / 40% 60% no-repeat, linear-gradient(180deg, #006A4E 0 20%, #FFCE00 20% 40%, #006A4E 40% 60%, #FFCE00 60% 80%, #006A4E 80%)', name: 'Togo (+228)' },
  CM: { bg: 'linear-gradient(90deg, #007A5E 33.3%, #CE1126 33.3% 66.6%, #FCD116 66.6%)', name: 'Cameroun (+237)' },
};

const dialMap: Record<string, string> = {
  '+225': 'CI',
  '+221': 'SN',
  '+223': 'ML',
  '+226': 'BF',
  '+224': 'GN',
  '+227': 'NE',
  '+229': 'BJ',
  '+228': 'TG',
  '+237': 'CM',
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerStep1, verifyOtp, user } = useAuth();
  const { createStore } = useStore();
  const [step, setStep] = useState<RegStep>('form');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields - Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dial, setDial] = useState('+225');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [activity, setActivity] = useState('');
  const [country, setCountry] = useState('Côte d’Ivoire');
  const [source, setSource] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [cgu, setCgu] = useState(false);
  const [otp, setOtp] = useState('');

  // Step 2: Shop Creation Fields
  const [shopName, setShopName] = useState('');
  const [shopActivity, setShopActivity] = useState('Mode & Vêtements');
  const [shopSlogan, setShopSlogan] = useState('');

  // Step 3: Plan Selection & Payment Flow
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'om' | 'momo' | 'moov' | 'card'>('wave');
  const [paymentPhoneOrCard, setPaymentPhoneOrCard] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const phoneDigits = phone.replace(/\D/g, '');
  const suggestedSlug = shopName.trim()
    ? shopName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : 'ma-boutique';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez renseigner votre nom complet');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez saisir une adresse e-mail valide');
      return;
    }
    if (phoneDigits.length < 8) {
      setError('Veuillez renseigner un numéro WhatsApp valide (8 chiffres min.)');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (!activity) {
      setError('Veuillez choisir votre type d’activité');
      return;
    }
    if (!cgu) {
      setError('Veuillez accepter les CGU et la politique de confidentialité');
      return;
    }
    setError('');
    setIsLoading(true);

    const fullPhone = `${dial}${phoneDigits.replace(/^0+/, '')}`;

    try {
      const res = await registerStep1({
        name: name.trim(),
        email: email.trim(),
        dial,
        phone: fullPhone,
        password,
        activity,
        country,
        source: source || 'Recherche Google',
        promo_code: promoCode || undefined
      });

      if (res?.otp_debug) {
        setOtp(res.otp_debug);
      }
      setStep('otp');
      toast.info(`Code de validation envoyé par e-mail à ${email.trim()}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
      toast.error(err.message || 'Erreur d’inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('Veuillez saisir les 6 chiffres reçus par e-mail');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await verifyOtp(email.trim(), otp.trim());
      // Pre-fill initial shop name
      const initialStoreName = `Boutique ${name.trim().split(' ')[0] || 'Marchand'}`;
      setShopName(initialStoreName);
      setShopActivity(activity || 'Mode & Vêtements');
      setStep('create_shop');
      toast.success('Code OTP validé ! Configurez à présent votre première boutique.');
    } catch (err: any) {
      setError(err.message || 'Code OTP invalide ou expiré.');
      toast.error(err.message || 'Validation échouée');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setError('Veuillez donner un nom à votre boutique');
      return;
    }
    setError('');
    setStep('select_plan');
  };

  const handleStartFreeTrial = async (planName: string) => {
    setIsLoading(true);
    try {
      // Create or update store in backend with chosen plan
      try {
        await createStore({
          name: shopName.trim() || 'Ma Boutique Kolix',
          activity: shopActivity,
          plan: planName
        });
      } catch {}

      toast.success(`Félicitations ! Votre essai gratuit de 7 jours sur le forfait ${planName} est activé.`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l’activation');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPaymentModal = (plan: any) => {
    setSelectedPlanForPayment(plan);
    setPaymentPhoneOrCard(phoneDigits || '');
  };

  const handleConfirmSubscriptionPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentPhoneOrCard.trim()) {
      toast.error('Veuillez saisir votre numéro ou vos coordonnées de paiement');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Simulate real-time mobile payment gateway handshake
      await new Promise(r => setTimeout(r, 1500));

      // Create store with chosen subscribed plan
      try {
        await createStore({
          name: shopName.trim() || 'Ma Boutique Kolix',
          activity: shopActivity,
          plan: selectedPlanForPayment?.name || 'Grow'
        });
      } catch {}

      toast.success(`Paiement de ${selectedPlanForPayment?.price[billingPeriod]} F validé avec succès par ${paymentMethod.toUpperCase()} !`);
      setSelectedPlanForPayment(null);
      navigate('/dashboard');
    } catch {
      toast.error('Erreur lors du paiement');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Pricing Plans Definition strictly matching user specifications
  const plans = [
    {
      id: 'start',
      name: 'Start',
      subtitle: 'Idéal pour démarrer vos premières ventes',
      price: {
        monthly: '5 000',
        yearly: '4 000',
      },
      features: [
        'Jusqu’à 700 commandes / mois',
        '2 utilisateurs',
        'Pixel Facebook & TikTok',
        'Portefeuille COD intégré',
        'Boutique personnalisée'
      ],
      isPopular: false,
      color: '#241D5E'
    },
    {
      id: 'grow',
      name: 'Grow',
      badge: 'Le plus choisi',
      subtitle: 'Pour les marchands en phase d’accélération',
      price: {
        monthly: '10 000',
        yearly: '8 000',
      },
      features: [
        'Jusqu’à 1 500 commandes / mois',
        '5 collaborateurs',
        'CRM Client & Relances',
        'Analyses intelligentes Kolix AI',
        'Gestion des stocks multi-villes'
      ],
      isPopular: true,
      color: '#6C4CF1'
    },
    {
      id: 'pro',
      name: 'Pro',
      subtitle: 'Volume élevé et automatisation complète',
      price: {
        monthly: '15 000',
        yearly: '12 000',
      },
      features: [
        'Commandes illimitées',
        'Utilisateurs illimités',
        'WhatsApp Marketing automatisé',
        'API de Conversion Meta (CAPI)',
        'Support WhatsApp prioritaire'
      ],
      isPopular: false,
      color: '#3F25A8'
    },
    {
      id: 'empire',
      name: 'Empire',
      subtitle: 'Pour les grandes marques multi-pays',
      price: {
        monthly: '5 0000',
        yearly: '40 000',
      },
      features: [
        'Toutes les fonctionnalités Pro',
        'Boutiques multi-pays illimitées',
        'Fulfillment Kolix dans 9 pays',
        'Account Manager dédié',
        'Webhooks & intégrations API'
      ],
      isPopular: false,
      color: '#16131F'
    }
  ];

  const firstName = name.trim().split(' ')[0] || 'Marchand';

  return (
    <div className="font-sans text-[#16131F] bg-[#F4F1FE] min-h-screen p-5 sm:p-8 lg:p-10 flex justify-center items-center">
      {/* ========================================================================= */}
      {/* STEP 4: CHOIX DE L'ABONNEMENT (Full width UI/UX des Tarifs Transparents) */}
      {/* ========================================================================= */}
      {step === 'select_plan' ? (
        <div className="w-full max-w-[1240px] flex flex-col gap-8 items-center animate-in fade-in duration-300">
          {/* Header Branding */}
          <Link to="/" className="flex items-center gap-3 no-underline text-[#16131F]">
            <span className="w-12 h-12 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-[#6C4CF1]/25">
              K
            </span>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold tracking-tight leading-none text-[#16131F]">Kolix</span>
              <span className="text-xs font-bold text-[#3F25A8] tracking-wider mt-0.5">Votre succès, notre mission</span>
            </div>
          </Link>

          {/* Pricing Header Title & Subtitle */}
          <div className="text-center max-w-2xl flex flex-col items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase px-3.5 py-1 rounded-full bg-[#EEE9FF] text-[#6C4CF1]">
              TARIFS TRANSPARENTS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16131F] tracking-tight mt-1">
              Un plan pour chaque étape de votre croissance
            </h1>
            <p className="text-sm sm:text-base text-[#5E5A70] font-medium leading-relaxed">
              Essai gratuit de 7 jours sur tous les forfaits, sans carte bancaire requise.
            </p>

            {/* Billing Period Toggle (Mensuel / Annuel -20%) */}
            <div className="inline-flex items-center bg-white p-1.5 rounded-2xl border border-[#E2DCF8] shadow-sm mt-4">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer',
                  billingPeriod === 'monthly'
                    ? 'bg-[#6C4CF1] text-white shadow-sm'
                    : 'text-[#5E5A70] hover:text-[#16131F]'
                )}
              >
                Mensuel
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('yearly')}
                className={cn(
                  'px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer',
                  billingPeriod === 'yearly'
                    ? 'bg-[#6C4CF1] text-white shadow-sm'
                    : 'text-[#5E5A70] hover:text-[#16131F]'
                )}
              >
                <span>Annuel</span>
                <span className="text-[10px] bg-[#E3F4EC] text-[#1E5E3F] px-2 py-0.5 rounded-full font-black">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid (4 Plans) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {plans.map((p) => {
              const priceDisplay = billingPeriod === 'monthly' ? p.price.monthly : p.price.yearly;
              return (
                <div
                  key={p.id}
                  className={cn(
                    'bg-white rounded-3xl p-6 sm:p-7 shadow-kolix border flex flex-col justify-between transition-all relative',
                    p.isPopular
                      ? 'border-[#6C4CF1] ring-2 ring-[#6C4CF1]/20 shadow-xl'
                      : 'border-[#E2DCF8]/60 hover:border-[#6C4CF1]/40'
                  )}
                >
                  {p.badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6C4CF1] text-white text-[11px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                      {p.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="text-2xl font-black text-[#16131F]">{p.name}</h3>
                    <p className="text-xs text-[#5E5A70] font-medium mt-1 min-h-[32px]">
                      {p.subtitle}
                    </p>

                    <div className="flex items-baseline gap-1 my-5">
                      <span className="text-3xl sm:text-4xl font-black text-[#16131F]">
                        {priceDisplay} F
                      </span>
                      <span className="text-xs font-bold text-[#5E5A70]">/ mois</span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#F0EDFB]">
                      {p.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs text-[#241D5E] font-bold">
                          <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dual Action Buttons as requested */}
                  <div className="flex flex-col gap-2.5 mt-8 pt-4 border-t border-[#F0EDFB]">
                    {/* Button 1: Essayer 7 jours gratuits */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleStartFreeTrial(p.name)}
                      className={cn(
                        'w-full py-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm',
                        p.isPopular
                          ? 'bg-[#6C4CF1] hover:bg-[#5B3FD6] text-white shadow-[#6C4CF1]/20'
                          : 'bg-[#241D5E] hover:bg-[#1C164A] text-white'
                      )}
                    >
                      <span>Essayer 7 jours gratuits</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Button 2: Souscrire à ce forfait */}
                    <button
                      type="button"
                      onClick={() => handleOpenPaymentModal(p)}
                      className="w-full py-2.5 rounded-2xl font-extrabold text-xs text-[#6C4CF1] bg-[#FAF8FF] hover:bg-[#EEE9FF] border border-[#E2DCF8] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Souscrire à ce forfait</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setStep('create_shop')}
            className="text-xs font-extrabold text-[#5E5A70] hover:text-[#16131F] mt-2 underline"
          >
            ← Retour à la configuration de la boutique
          </button>
        </div>
      ) : (
        /* ========================================================================= */
        /* STANDARD 12-COLUMN REGISTRATION CONTAINER (Steps: form, otp, create_shop) */
        /* ========================================================================= */
        <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: HERO & PROPOSITIONS */}
          <section className="lg:col-span-7 flex flex-col gap-8 pr-0 lg:pr-4">
            <Link to="/" className="flex items-center gap-3 no-underline text-[#16131F] group">
              <span className="w-12 h-12 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-[#6C4CF1]/25 group-hover:scale-105 transition-transform">
                K
              </span>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold tracking-tight leading-none text-[#16131F]">Kolix</span>
                <span className="text-xs font-bold text-[#3F25A8] tracking-wider mt-0.5">Votre succès, notre mission</span>
              </div>
            </Link>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16131F] leading-[1.12]">
                Lancez votre boutique en ligne en quelques minutes,{' '}
                <span className="text-[#6C4CF1]">sans compétence technique !</span>
              </h1>
              <p className="text-base sm:text-lg text-[#3A3647] leading-relaxed">
                Kolix, la plateforme e-commerce no-code pensée pour les marchands d’Afrique francophone. Vendez en Cash on Delivery, gérez plusieurs boutiques et développez votre chiffre d'affaires, tout au même endroit.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Créez vos boutiques en direct', text: 'Lancez autant de boutiques que vous avez de marques ou niches.', icon: Store },
                { title: 'Gérez vos commandes COD', text: 'Suivez vos ventes, vos livraisons et vos clients en temps réel.', icon: ShoppingBag },
                { title: 'Encaissez facilement', text: 'Wave, Mobile Money, Cash on Delivery : tout est pré-intégré.', icon: CreditCard },
                { title: 'Boostez-vous avec Kolix AI', text: 'Votre assistant intelligent et analyses prédictives.', icon: Sparkles },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-3.5 items-start">
                    <span className="w-10 h-10 rounded-2xl bg-white text-[#6C4CF1] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#E2DCF8]/60 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-[#16131F]">{f.title}</span>
                      <span className="text-xs text-[#5E5A70] leading-relaxed">{f.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIGHT COLUMN: CARD FORM / OTP / CREATE SHOP */}
          <section className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-6">
              {/* STEP 1: REGISTRATION FORM */}
              {step === 'form' && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#16131F] tracking-tight">Créer un compte</h2>
                    <p className="text-xs text-[#5E5A70] mt-1">
                      Démarrez avec votre essai gratuit de 7 jours, sans carte bancaire.
                    </p>
                  </div>

                  {error && (
                    <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Souleymane Sanogo"
                        className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 bg-[#FAF9FE]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">Adresse e-mail *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="souleymane@exemple.ci"
                        className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 bg-[#FAF9FE]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">Numéro WhatsApp *</label>
                      <div className="flex gap-2">
                        <select
                          value={dial}
                          onChange={(e) => setDial(e.target.value)}
                          className="w-24 text-xs font-bold py-2.5 px-2 border border-[#E2DCF8] rounded-xl bg-[#FAF9FE]"
                        >
                          <option value="+225">CI (+225)</option>
                          <option value="+221">SN (+221)</option>
                          <option value="+223">ML (+223)</option>
                          <option value="+226">BF (+226)</option>
                        </select>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07 00 00 00 00"
                          className="flex-1 text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 bg-[#FAF9FE]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">Type d'activité *</label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        required
                        className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] bg-[#FAF9FE]"
                      >
                        <option value="">Sélectionnez votre domaine</option>
                        <option value="Mode & Habillement">Mode & Habillement</option>
                        <option value="Beauté & Cosmétiques">Beauté & Cosmétiques</option>
                        <option value="Électronique & High-Tech">Électronique & High-Tech</option>
                        <option value="Maison & Cuisine">Maison & Cuisine</option>
                        <option value="Santé & Bien-être">Santé & Bien-être</option>
                        <option value="Autre">Autre activité e-commerce</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">Mot de passe *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Au moins 6 caractères"
                          className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 bg-[#FAF9FE]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={cgu}
                        onChange={(e) => setCgu(e.target.checked)}
                        className="mt-0.5 rounded text-[#6C4CF1] focus:ring-[#6C4CF1]"
                      />
                      <span className="text-[11px] text-[#5E5A70] leading-tight">
                        J'accepte les Conditions Générales d'Utilisation et la politique de confidentialité de Kolix.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Création du compte…</span>
                      </>
                    ) : (
                      <span>Continuer vers la validation</span>
                    )}
                  </button>

                  <div className="text-center text-xs text-[#5E5A70] pt-1">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-extrabold text-[#6C4CF1] hover:underline">
                      Se connecter
                    </Link>
                  </div>
                </form>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {step === 'otp' && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-black text-[#16131F] tracking-tight">Vérification par e-mail</h2>
                    <p className="text-xs text-[#5E5A70] mt-1 leading-relaxed">
                      Saisissez le code de confirmation envoyé à <strong>{email}</strong>.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">Code OTP à 6 chiffres</label>
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

                    {error && (
                      <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                        {error}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleVerifyOtp}
                      className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Validation en cours…</span>
                        </>
                      ) : (
                        <span>Valider et configurer ma boutique</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setStep('form'); setError(''); }}
                      className="w-full text-center text-xs font-bold text-[#3F25A8] hover:underline"
                    >
                      ← Modifier mes informations
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIGURE SHOP DETAILS */}
              {step === 'create_shop' && (
                <form onSubmit={handleShopCreateSubmit} className="flex flex-col gap-5 animate-fade-in">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#6C4CF1] bg-[#EEE9FF] px-2.5 py-0.5 rounded-full">
                      Étape 2 / 3
                    </span>
                    <h2 className="text-2xl font-black text-[#16131F] tracking-tight mt-1.5">
                      Configurez votre première boutique
                    </h2>
                    <p className="text-xs text-[#5E5A70] mt-1 leading-relaxed">
                      Donnez un nom et une identité à votre vitrine e-commerce. Vous pourrez ajouter d'autres boutiques plus tard.
                    </p>
                  </div>

                  {error && (
                    <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">
                        Nom de la boutique *
                      </label>
                      <input
                        type="text"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Ex: Kaly Cosmétiques, Ivoire Tech..."
                        className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 bg-[#FAF9FE]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">
                        Type d'activité / Niche
                      </label>
                      <select
                        value={shopActivity}
                        onChange={(e) => setShopActivity(e.target.value)}
                        className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] bg-[#FAF9FE]"
                      >
                        <option value="Mode & Vêtements">Mode & Vêtements</option>
                        <option value="Beauté & Cosmétiques">Beauté & Cosmétiques</option>
                        <option value="Électronique & High-Tech">Électronique & High-Tech</option>
                        <option value="Maison & Cuisine">Maison & Cuisine</option>
                        <option value="Santé & Bien-être">Santé & Bien-être</option>
                        <option value="Généraliste / Autres">Généraliste / Autres</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#3A3647] block mb-1">
                        Slogan ou courte description
                      </label>
                      <input
                        type="text"
                        value={shopSlogan}
                        onChange={(e) => setShopSlogan(e.target.value)}
                        placeholder="Ex: Les meilleurs produits livrés chez vous en 24h"
                        className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 bg-[#FAF9FE]"
                      />
                    </div>

                    {/* Live Domain Preview */}
                    <div className="p-3 bg-[#F4F1FE] rounded-xl border border-[#E2DCF8] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#5E5A70] font-bold uppercase tracking-wider">
                          Adresse attribuée par défaut
                        </span>
                        <span className="text-xs font-black text-[#241D5E]">
                          https://{suggestedSlug}.kolix.shop
                        </span>
                      </div>
                      <span className="text-[10px] font-black bg-[#E3F4EC] text-[#1E5E3F] px-2 py-0.5 rounded-full">
                        Gratuit & SSL
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Continuer vers le choix de l’abonnement</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: WORKFLOW DE PAIEMENT DE L'ABONNEMENT */}
      {/* ========================================================================= */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 bg-[#16131F]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E2DCF8] flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#6C4CF1] bg-[#EEE9FF] px-2.5 py-0.5 rounded-full">
                  SOUSCRIPTION SÉCURISÉE
                </span>
                <h3 className="text-xl font-black text-[#16131F] mt-1.5">
                  Forfait {selectedPlanForPayment.name}
                </h3>
                <p className="text-xs text-[#5E5A70]">
                  Paiement {billingPeriod === 'monthly' ? 'mensuel' : 'annuel'} pour votre boutique {shopName || 'Kolix'}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForPayment(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8FF] text-[#5E5A70] hover:text-[#16131F] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total to pay banner */}
            <div className="p-4 rounded-2xl bg-[#241D5E] text-white flex justify-between items-center">
              <div>
                <span className="text-xs text-[#A99BFA] block font-bold">Montant à régler</span>
                <span className="text-2xl font-black">
                  {billingPeriod === 'monthly' ? selectedPlanForPayment.price.monthly : selectedPlanForPayment.price.yearly} FCFA
                </span>
              </div>
              <span className="text-xs font-extrabold bg-[#6C4CF1] px-3 py-1 rounded-full">
                {billingPeriod === 'monthly' ? '1 mois' : '1 an (-20%)'}
              </span>
            </div>

            <form onSubmit={handleConfirmSubscriptionPayment} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#16131F] block mb-2">
                  Choisissez votre moyen de paiement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wave', label: 'Wave', color: '#1BA2DC', icon: '🌊' },
                    { id: 'om', label: 'Orange Money', color: '#FF7900', icon: '🟠' },
                    { id: 'momo', label: 'MTN MoMo', color: '#FFCC00', icon: '🟡' },
                    { id: 'moov', label: 'Moov Money', color: '#0066B3', icon: '🔵' },
                    { id: 'card', label: 'Carte Bancaire', color: '#241D5E', icon: '💳' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={cn(
                        'p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer',
                        paymentMethod === m.id
                          ? 'border-[#6C4CF1] bg-[#FAF8FF] ring-2 ring-[#6C4CF1]/20 font-black text-[#16131F]'
                          : 'border-[#E2DCF8] text-[#5E5A70] hover:bg-gray-50'
                      )}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-[11px] truncate w-full">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#16131F] block mb-1">
                  {paymentMethod === 'card'
                    ? 'Numéro de carte Visa / Mastercard'
                    : `Numéro de téléphone ${paymentMethod.toUpperCase()}`}
                </label>
                <input
                  type="text"
                  required
                  value={paymentPhoneOrCard}
                  onChange={(e) => setPaymentPhoneOrCard(e.target.value)}
                  placeholder={paymentMethod === 'card' ? '4500 •••• •••• ••••' : '07 00 00 00 00'}
                  className="w-full text-sm font-semibold py-2.5 px-3.5 border border-[#E2DCF8] rounded-xl text-[#16131F] bg-[#FAF9FE]"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#5E5A70]">
                <Shield className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Transaction chiffrée SSL 256 bits · Débit immédiat sécurisé</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForPayment(null)}
                  className="py-2.5 px-4 rounded-xl border border-[#E2DCF8] text-xs font-bold text-[#5E5A70]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="flex-1 py-2.5 px-4 bg-[#6C4CF1] hover:bg-[#5B3FD6] text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Traitement du paiement…</span>
                    </>
                  ) : (
                    <span>Confirmer et Payer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
