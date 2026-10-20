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
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

type RegStep = 'form' | 'otp' | 'done';

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
  const [step, setStep] = useState<RegStep>('form');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
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

  const phoneDigits = phone.replace(/\D/g, '');

  const handleSubmit = (e: React.FormEvent) => {
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
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
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
    setStep('otp');
    toast.info(`Code de validation envoyé par WhatsApp au ${dial} ${phone}`);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      setError('Veuillez saisir les 6 chiffres reçus par WhatsApp');
      return;
    }
    setError('');
    setStep('done');
    toast.success('Compte créé avec succès !');
  };

  const mVals = [42, 55, 38, 61, 74, 88, 70, 52, 66, 81, 95, 120, 98, 84, 92, 110, 76, 68, 104];
  const firstName = name.trim().split(' ')[0] || 'Marchand';

  return (
    <div className="font-sans text-[#16131F] bg-[#F4F1FE] min-h-screen p-5 sm:p-8 lg:p-10 flex justify-center items-center">
      <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: HERO, VALUE PROPOSITIONS & IPHONE SIMULATOR */}
        <section className="lg:col-span-7 flex flex-col gap-8 pr-0 lg:pr-4">
          {/* Header Branding */}
          <Link to="/" className="flex items-center gap-3 no-underline text-[#16131F] group">
            <span className="w-12 h-12 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-[#6C4CF1]/25 group-hover:scale-105 transition-transform">
              K
            </span>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold tracking-tight leading-none text-[#16131F]">Kolix</span>
              <span className="text-xs font-bold text-[#3F25A8] tracking-wider mt-0.5">Votre succès, notre mission</span>
            </div>
          </Link>

          {/* Headline & Pitch */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16131F] leading-[1.12]">
              Lancez votre boutique en ligne en quelques minutes,{' '}
              <span className="text-[#6C4CF1]">sans compétence technique !</span>
            </h1>
            <p className="text-base sm:text-lg text-[#3A3647] leading-relaxed">
              Kolix, la plateforme e-commerce no-code pensée pour les marchands d’Afrique francophone. Vendez en Cash on Delivery, gérez votre activité et faites grandir votre business, tout au même endroit.
            </p>
          </div>

          {/* Features + Phone Preview Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Features List */}
            <div className="sm:col-span-6 space-y-4">
              {[
                { title: 'Créez votre boutique', text: 'Personnalisez votre boutique en ligne en quelques clics, sans code.', icon: Store },
                { title: 'Gérez vos commandes', text: 'Suivez vos ventes, vos livraisons et vos clients en temps réel.', icon: ShoppingBag },
                { title: 'Encaissez facilement', text: 'Mobile Money, QR code, Cash on Delivery : tout est intégré.', icon: CreditCard },
                { title: 'Développez votre activité', text: 'Marketing WhatsApp, comptabilité, stock et bien plus encore.', icon: TrendingUp },
                { title: 'Boostez-vous avec Kolix AI', text: 'Votre assistant intelligent, toujours à vos côtés.', icon: Sparkles },
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

            {/* Smartphone Live Dashboard Mockup */}
            <div className="sm:col-span-6 flex justify-center relative pb-6">
              <div className="w-[260px] h-[520px] bg-[#16131F] rounded-[40px] p-2.5 shadow-2xl border-4 border-gray-800 flex flex-col">
                <div className="w-full h-full bg-[#F7F5FE] rounded-[32px] overflow-hidden flex flex-col text-[10px]">
                  {/* Top Stats Banner */}
                  <div className="bg-[#241D5E] text-white p-3 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span>9:41</span>
                      <div className="flex gap-1 items-center">
                        <span className="w-2.5 h-1.5 rounded-xs bg-white" />
                        <span className="w-3.5 h-2 rounded-xs border border-white" />
                      </div>
                    </div>

                    <div className="flex gap-1 text-[8px] font-bold overflow-hidden">
                      <span className="px-1.5 py-0.5 text-[#BDB5E8]">Jour</span>
                      <span className="px-1.5 py-0.5 text-[#BDB5E8]">Semaine</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#6C4CF1] text-white">Ce mois</span>
                    </div>

                    <div className="text-center pt-1">
                      <span className="text-[9px] text-[#E2DCFF] block">Ventes totales</span>
                      <span className="text-base font-black text-white leading-tight">3,26 M FCFA</span>
                      <span className="text-[8px] text-[#E2DCFF]">205 commandes livrées</span>
                    </div>

                    {/* Chart Bars */}
                    <div className="h-14 flex items-end gap-1 pt-1 border-t border-white/10">
                      {mVals.slice(0, 16).map((v, i) => (
                        <div
                          key={i}
                          style={{ height: `${Math.round((v / 120) * 100)}%` }}
                          className="flex-1 bg-white/80 rounded-t-xs"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="bg-white divide-y divide-[#F0EDFB]">
                    <div className="p-2 flex items-center justify-between text-[#3A3647]">
                      <span><strong>32 commandes</strong> à confirmer</span>
                      <span className="text-gray-400">›</span>
                    </div>
                    <div className="p-2 flex items-center justify-between text-[#3A3647]">
                      <span><strong>8 livraisons</strong> aujourd’hui</span>
                      <span className="text-gray-400">›</span>
                    </div>
                    <div className="p-2 flex items-center justify-between text-[#3A3647]">
                      <span><strong>2 produits</strong> en stock faible</span>
                      <span className="text-gray-400">›</span>
                    </div>
                  </div>

                  {/* AI Note */}
                  <div className="m-2 bg-white rounded-xl p-2 shadow-xs border border-purple-100">
                    <span className="text-[8px] font-bold text-[#6C4CF1] uppercase">Kolix AI</span>
                    <p className="text-[9px] font-bold text-[#16131F] mt-0.5 leading-tight">
                      La Montre élégante part vite : il en reste 3.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 100% African Solution Badge & 9 Flags */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 border border-[#E2DCF8]">
              <span className="w-8 h-8 rounded-xl bg-[#6C4CF1] text-white flex items-center justify-center font-black text-sm">
                AF
              </span>
              <div>
                <span className="font-extrabold text-xs text-[#16131F] block">Une solution 100 % africaine</span>
                <span className="text-[11px] text-[#5E5A70] block">Pensée pour les marchands d’Afrique francophone.</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold text-[#3A3647]">Présent dans 9 pays francophones</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(flagDefs).map(([code, def]) => (
                  <div key={code} className="flex flex-col items-center gap-0.5">
                    <span style={{ background: def.bg }} className="w-6 h-4 rounded-xs shadow-xs border border-black/10" />
                    <span className="text-[9px] font-bold text-[#5E5A70]">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: REGISTRATION WIZARD FORM */}
        <section className="lg:col-span-5 flex flex-col gap-3">
          {/* Top Login Redirect */}
          <div className="flex justify-end text-xs text-[#5E5A70] pr-2">
            <span>
              Déjà un compte ?{' '}
              <Link to="/login" className="font-extrabold text-[#3F25A8] hover:underline">
                Se connecter
              </Link>
            </span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl shadow-[#241D5E]/10 border border-[#E2DCF8]/60 flex flex-col gap-6">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-[#6C4CF1] text-white flex items-center justify-center text-lg font-black shadow-md shadow-[#6C4CF1]/20">
                K
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-[#16131F] leading-tight">Kolix</span>
                <span className="text-[10px] font-bold text-[#3F25A8]">Votre succès, notre mission</span>
              </div>
            </div>

            {/* STEP 1: FORM */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#16131F] tracking-tight">Créer votre compte</h2>
                  <p className="text-xs text-[#5E5A70] mt-0.5">
                    Rejoignez les marchands qui vendent avec Kolix. 7 jours d'essai gratuits.
                  </p>
                </div>

                {/* Personal Information */}
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold text-[#16131F] uppercase tracking-wider block">
                    Informations personnelles
                  </span>

                  {/* Name */}
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-xl px-3.5 min-h-[46px] bg-white focus-within:ring-2 focus-within:ring-[#6C4CF1]/30">
                    <User className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nom complet *"
                      className="flex-1 font-bold text-xs sm:text-sm border-0 bg-transparent text-[#16131F] focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-xl px-3.5 min-h-[46px] bg-white focus-within:ring-2 focus-within:ring-[#6C4CF1]/30">
                    <Mail className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Adresse e-mail *"
                      className="flex-1 font-bold text-xs sm:text-sm border-0 bg-transparent text-[#16131F] focus:outline-none"
                    />
                  </div>

                  {/* WhatsApp Phone + Dial Selector */}
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-xl px-3 min-h-[46px] bg-white focus-within:ring-2 focus-within:ring-[#6C4CF1]/30">
                    <Phone className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <span 
                      style={{ background: flagDefs[dialMap[dial] || 'CI']?.bg }} 
                      className="w-5 h-3.5 rounded-xs shadow-xs flex-shrink-0" 
                    />
                    <select
                      value={dial}
                      onChange={(e) => setDial(e.target.value)}
                      className="font-bold text-xs bg-transparent border-0 text-[#16131F] focus:outline-none cursor-pointer"
                    >
                      {Object.keys(dialMap).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <span className="w-px h-5 bg-[#E2DCF8]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Numéro WhatsApp *"
                      className="flex-1 min-w-0 font-bold text-xs sm:text-sm border-0 bg-transparent text-[#16131F] focus:outline-none px-1"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-xl px-3.5 min-h-[46px] bg-white focus-within:ring-2 focus-within:ring-[#6C4CF1]/30">
                    <Lock className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mot de passe * (8 car. min.)"
                      className="flex-1 font-bold text-xs sm:text-sm border-0 bg-transparent text-[#16131F] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#5E5A70] hover:text-[#16131F] p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-extrabold text-[#16131F] uppercase tracking-wider block">
                    Informations sur votre activité
                  </span>

                  {/* Activity */}
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-xl px-3.5 min-h-[46px] bg-white">
                    <Store className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                      className={`flex-1 font-bold text-xs sm:text-sm border-0 bg-transparent focus:outline-none cursor-pointer ${
                        activity ? 'text-[#16131F]' : 'text-gray-400'
                      }`}
                    >
                      <option value="">Quel est votre type d’activité ? *</option>
                      <option value="Mode féminine">Mode féminine</option>
                      <option value="Beauté et cosmétiques">Beauté et cosmétiques</option>
                      <option value="Électronique et gadgets">Électronique et gadgets</option>
                      <option value="Maison et électroménager">Maison et électroménager</option>
                      <option value="Compléments et bien-être">Compléments et bien-être</option>
                      <option value="Mode masculine">Mode masculine</option>
                      <option value="Bijoux et accessoires">Bijoux et accessoires</option>
                      <option value="Enfants et puériculture">Enfants et puériculture</option>
                      <option value="Produits locaux et artisanat">Produits locaux et artisanat</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-xl px-3.5 min-h-[46px] bg-white">
                    <MapPin className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex-1 font-bold text-xs sm:text-sm border-0 bg-transparent text-[#16131F] focus:outline-none cursor-pointer"
                    >
                      <option value="Côte d’Ivoire">Côte d’Ivoire</option>
                      <option value="Sénégal">Sénégal</option>
                      <option value="Mali">Mali</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Guinée">Guinée</option>
                      <option value="Niger">Niger</option>
                      <option value="Bénin">Bénin</option>
                      <option value="Togo">Togo</option>
                      <option value="Cameroun">Cameroun</option>
                    </select>
                  </div>

                  {/* Acquisition Source */}
                  <div className="flex items-center gap-2 border border-[#E2DCF8] rounded-xl px-3.5 min-h-[46px] bg-white">
                    <TrendingUp className="w-4 h-4 text-[#5E5A70] flex-shrink-0" />
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className={`flex-1 font-bold text-xs sm:text-sm border-0 bg-transparent focus:outline-none cursor-pointer ${
                        source ? 'text-[#16131F]' : 'text-gray-400'
                      }`}
                    >
                      <option value="">Comment avez-vous connu Kolix ?</option>
                      <option value="Facebook ou Instagram">Facebook ou Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Un partenaire ou code promo">Un partenaire ou formateur</option>
                      <option value="Un ami">Un ami</option>
                      <option value="Google">Google</option>
                    </select>
                  </div>

                  {/* Promo Code Field */}
                  <div className="flex items-center gap-2 border border-amber-300 rounded-xl px-3.5 min-h-[46px] bg-[#FFF8D6]/60">
                    <span className="text-[11px] font-extrabold text-[#6B4100] whitespace-nowrap">Code partenaire :</span>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Ex. AMINA10"
                      className="flex-1 font-black text-xs sm:text-sm border-0 bg-transparent text-[#3F25A8] tracking-wider focus:outline-none"
                    />
                  </div>
                </div>

                {/* CGU */}
                <label className="flex items-start gap-2.5 text-xs text-[#3A3647] cursor-pointer pt-1 leading-relaxed">
                  <input
                    type="checkbox"
                    checked={cgu}
                    onChange={(e) => setCgu(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#6C4CF1] flex-shrink-0 mt-0.5"
                  />
                  <span>
                    J’accepte les{' '}
                    <a href="#cgu" className="font-extrabold text-[#3F25A8] hover:underline">
                      Conditions générales d’utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="#privacy" className="font-extrabold text-[#3F25A8] hover:underline">
                      Politique de confidentialité
                    </a>{' '}
                    de Kolix.
                  </span>
                </label>

                {error && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center justify-center gap-2 mt-1"
                >
                  <span>Créer mon compte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Separator */}
                <div className="flex items-center gap-3 text-xs text-[#5E5A70]">
                  <span className="flex-1 h-px bg-[#EEEAFB]" />
                  <span>Ou</span>
                  <span className="flex-1 h-px bg-[#EEEAFB]" />
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => {
                    setName('Souleymane Sanogo');
                    setStep('done');
                    toast.success('Compte Google synchronisé avec succès !');
                  }}
                  className="w-full py-3 bg-white text-[#16131F] border border-[#CFC7F2] font-extrabold rounded-2xl text-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2.5"
                >
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black">
                    G
                  </span>
                  Continuer avec Google
                </button>
              </form>
            )}

            {/* STEP 2: WHATSAPP OTP */}
            {step === 'otp' && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-[#16131F] tracking-tight">Vérification WhatsApp</h2>
                  <p className="text-xs text-[#5E5A70] mt-1 leading-relaxed">
                    Saisissez le code à 6 chiffres envoyé au <strong>{dial} {phone}</strong> pour confirmer votre compte.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#3A3647] block mb-1">Code reçu sur WhatsApp</label>
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
                    onClick={handleVerifyOtp}
                    className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all"
                  >
                    Vérifier et créer ma boutique
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

            {/* STEP 3: DONE */}
            {step === 'done' && (
              <div className="flex flex-col gap-5 text-center items-center py-2 animate-fade-in">
                <span className="w-16 h-16 rounded-full bg-[#E3F4EC] text-[#1E5E3F] flex items-center justify-center shadow-sm">
                  <Check className="w-8 h-8 stroke-[3]" />
                </span>

                <div>
                  <h2 className="text-2xl font-black text-[#16131F] tracking-tight">
                    Bienvenue sur Kolix, {firstName} !
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5E5A70] mt-1.5 leading-relaxed">
                    Votre compte marchand est créé et votre essai gratuit de 7 jours commence maintenant. Prochaine étape : nommer votre boutique et choisir vos templates de vente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Créer ma boutique maintenant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Card Bottom Help */}
            <div className="border-t border-[#F0EDFB] pt-3 text-center text-xs text-[#5E5A70]">
              Besoin d’aide ? Contactez notre{' '}
              <a href="#support" className="font-extrabold text-[#3F25A8] hover:underline">
                équipe support
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
