import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Phone, 
  MessageSquare, 
  Star, 
  AlertCircle, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  ChevronRight,
  PackageCheck,
  CheckCircle2,
  RefreshCw,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderData {
  orderId: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  pack: 'pack1' | 'pack2';
  color: string;
  paymentMethod: 'cash' | 'momo';
  total: number;
}

export const ProductPage: React.FC = () => {
  // Variant / Package selection
  const [selectedPack, setSelectedPack] = useState<'pack1' | 'pack2'>('pack1');
  const [selectedColor, setSelectedColor] = useState('Noir Sidéral');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Abidjan - Cocody');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderData | null>(null);

  // Pricing
  const pricePack1 = 18500;
  const regularPricePack1 = 28500;
  const pricePack2 = 32000; // Duo promotion
  const regularPricePack2 = 57000;

  const currentPrice = selectedPack === 'pack1' ? pricePack1 : pricePack2;
  const regularPrice = selectedPack === 'pack1' ? regularPricePack1 : regularPricePack2;
  const savings = regularPrice - currentPrice;

  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const productImages = [
    {
      url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
      label: 'Vue principale AMOLED'
    },
    {
      url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
      label: 'Boîtier aluminium & finition'
    },
    {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      label: 'Coffret & accessoires inclus'
    }
  ];

  const colors = [
    { name: 'Noir Sidéral', hex: '#1C1C1E', bg: 'bg-[#1C1C1E]' },
    { name: 'Argent Titane', hex: '#D1D5DB', bg: 'bg-[#D1D5DB]' },
    { name: 'Or Rose Impérial', hex: '#E0A899', bg: 'bg-[#E0A899]' }
  ];

  const cities = [
    'Abidjan - Cocody',
    'Abidjan - Yopougon',
    'Abidjan - Marcory',
    'Abidjan - Plateau',
    'Abidjan - Treichville',
    'Abidjan - Koumassi',
    'Abidjan - Port-Bouët',
    'Abidjan - Angré / 8e Tranche',
    'Abidjan - Riviera (Palmeraie/Bonoumin)',
    'Abidjan - Deux-Plateaux',
    'Abidjan - Bingerville',
    'Bouaké',
    'Yamoussoukro',
    'San-Pédro',
    'Korhogo',
    'Daloa',
    'Autre ville / commune'
  ];

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Veuillez renseigner votre nom complet.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      toast.error('Veuillez renseigner un numéro de téléphone WhatsApp valide.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `KX-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderData: OrderData = {
        orderId,
        name: name.trim(),
        phone: phone.trim(),
        city,
        address: address.trim() || 'À préciser lors de l’appel du livreur',
        pack: selectedPack,
        color: selectedColor,
        paymentMethod,
        total: currentPrice
      };

      setConfirmedOrder(orderData);
      setIsSubmitting(false);
      toast.success(`Commande #${orderId} enregistrée ! Paiement prévu à la livraison.`);
    }, 600);
  };

  const handleReset = () => {
    setConfirmedOrder(null);
    setName('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="min-h-screen bg-[#F7F5FE] text-[#16131F] font-sans antialiased selection:bg-[#6C4CF1] selection:text-white pb-20">
      {/* Top Banner: Urgency & Guarantee */}
      <div className="bg-[#241D5E] text-white py-2.5 px-4 text-center text-xs sm:text-sm font-extrabold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-[#F5C800] animate-pulse" />
        <span>Vente Flash Exclusive : Paiement uniquement à la réception + Livraison Express 24h</span>
      </div>

      {/* Store Header */}
      <header className="bg-white border-b border-[#EEEAFB] sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#6C4CF1] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#6C4CF1]/20">
              ET
            </span>
            <div>
              <div className="font-extrabold text-base sm:text-lg text-[#16131F] leading-tight">
                Élégance & Tech Abidjan
              </div>
              <div className="text-[11px] text-[#5E5A70] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1E5E3F] animate-ping" />
                <span>Boutique certifiée Kolix · Stock vérifié</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/2250700000001?text=Bonjour%20je%20souhaite%20des%20renseignements%20sur%20la%20Montre%20Ultra%20Pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#1F7A4D] bg-[#E3F9ED] px-3.5 py-2 rounded-xl hover:bg-[#D4F5E3] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Assistance WhatsApp</span>
            </a>

            <Link
              to="/boutique"
              className="text-xs font-extrabold text-[#6C4CF1] bg-[#F4F1FE] px-3.5 py-2 rounded-xl hover:bg-[#EEE9FF] transition-colors"
            >
              Retour à l’administration
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* If Order Confirmed Screen */}
        {confirmedOrder ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E2DCF8] text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-[#E3F4EC] text-[#1E5E3F] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest uppercase text-[#1E5E3F] bg-[#E3F4EC] px-3 py-1 rounded-full">
                Commande confirmée avec succès
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#16131F]">
                Merci {confirmedOrder.name} !
              </h1>
              <p className="text-sm text-[#5E5A70]">
                Votre commande <strong className="text-[#6C4CF1]">#{confirmedOrder.orderId}</strong> a bien été enregistrée dans notre système.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-[#FAF9FE] rounded-2xl p-5 border border-[#EEEAFB] text-left text-xs sm:text-sm space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-[#5E5A70]">Article</span>
                <span className="font-extrabold text-[#16131F]">
                  Montre Connectée Ultra Pro ({confirmedOrder.color})
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-[#5E5A70]">Formule sélectionnée</span>
                <span className="font-extrabold text-[#16131F]">
                  {confirmedOrder.pack === 'pack1' ? '1x Montre Ultra Pro' : 'Pack Duo (2x Montres Ultra Pro)'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-[#5E5A70]">Lieu de livraison</span>
                <span className="font-extrabold text-[#16131F]">
                  {confirmedOrder.city} {confirmedOrder.address !== 'À préciser lors de l’appel du livreur' ? `(${confirmedOrder.address})` : ''}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-[#5E5A70]">Téléphone de contact</span>
                <span className="font-extrabold text-[#16131F]">{confirmedOrder.phone}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-bold text-[#5E5A70]">Moyen de règlement</span>
                <span className="font-extrabold text-[#16131F]">
                  {confirmedOrder.paymentMethod === 'cash' ? '💵 Espèces au livreur' : '📱 Mobile Money (Wave / Orange)'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 text-base font-black">
                <span className="text-[#16131F]">Total à payer à la réception :</span>
                <span className="text-[#6C4CF1] text-xl">{fmt(confirmedOrder.total)} FCFA</span>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="bg-[#FFF8D6] border border-[#F5C800] rounded-2xl p-4 text-xs sm:text-sm text-[#4D3B00] text-left flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#8A3D0A] flex-shrink-0 mt-0.5" />
              <div>
                <strong>Prochaine étape importante :</strong> Notre livreur vous appellera sur votre numéro{' '}
                <strong>{confirmedOrder.phone}</strong> avant son passage pour convenir de l'heure exacte. Veuillez garder votre téléphone allumé.
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/2250700000001?text=Bonjour,%20je%20viens%20de%20passer%20la%20commande%20${confirmedOrder.orderId}%20pour%20la%20Montre%20Ultra%20Pro.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1F7A4D] text-white rounded-2xl font-extrabold text-sm shadow-md hover:bg-[#18643E] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirmer directement sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3.5 bg-gray-100 text-[#16131F] rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Passer une autre commande
              </button>
            </div>
          </div>
        ) : (
          /* Normal Product Page Showcase Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: PRODUCT IMAGE + DESCRIPTION BELOW */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Product Image Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E2DCF8]/70 shadow-sm space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square max-h-[460px] flex items-center justify-center">
                  <img
                    src={productImages[activeImageIndex].url}
                    alt="Montre Connectée Ultra Pro"
                    className="w-full h-full object-cover object-center transition-all duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-[#D6304A] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md tracking-wider">
                    PROMO -35%
                  </span>
                  <span className="absolute bottom-4 left-4 bg-[#241D5E]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md">
                    {productImages[activeImageIndex].label}
                  </span>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-3 gap-3">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`rounded-xl overflow-hidden border-2 transition-all aspect-video sm:aspect-4/3 ${
                        activeImageIndex === idx ? 'border-[#6C4CF1] ring-2 ring-[#6C4CF1]/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Stock alert pill */}
                <div className="p-3 bg-[#FFF0D6] border border-[#F5C800] rounded-2xl flex items-center justify-between text-xs font-extrabold text-[#6B4100]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D6304A] animate-ping" />
                    Forte demande en cours
                  </span>
                  <span>Plus que 7 unités en stock</span>
                </div>
              </div>

              {/* PRODUCT DESCRIPTION SECTION (PLACED BELOW PRODUCT IMAGE AS REQUESTED) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DCF8]/70 shadow-sm space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#16131F] tracking-tight">
                    Description & Caractéristiques
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5E5A70] mt-1 font-medium">
                    Découvrez pourquoi la Montre Ultra Pro Series 9 est devenue l'accessoire indispensable de milliers de professionnels et sportifs.
                  </p>
                </div>

                {/* Key Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Écran AMOLED Ultra HD 2.02"', desc: 'Affichage haute luminosité parfaitement lisible même sous le grand soleil d’Afrique.', icon: Sparkles },
                    { title: 'Appels Bluetooth & Micro HD', desc: 'Décrochez et passez vos appels directement depuis votre poignet sans sortir votre téléphone.', icon: Phone },
                    { title: 'Suivi de Santé & Sommeil 24/7', desc: 'Mesure continue du rythme cardiaque, oxygène sanguin, tension artérielle et qualité du repos.', icon: ShieldCheck },
                    { title: 'Batterie Longue Durée 7 Jours', desc: 'Charge magnétique rapide sans fil : jusqu’à 7 jours d’autonomie en utilisation normale.', icon: Clock },
                    { title: 'Résistance à l’Eau IP68', desc: 'Protégée contre la pluie, la transpiration, la poussière et les éclaboussures du quotidien.', icon: PackageCheck },
                    { title: 'Compatible Android & iPhone', desc: 'Synchronisation instantanée avec tous les smartphones (Samsung, iPhone, Infinix, Tecno, etc.).', icon: CheckCircle2 }
                  ].map((feat) => {
                    const Icon = feat.icon;
                    return (
                      <div key={feat.title} className="p-4 rounded-2xl bg-[#FAF9FE] border border-[#EEEAFB] space-y-1.5">
                        <div className="flex items-center gap-2 text-[#6C4CF1]">
                          <Icon className="w-4 h-4" />
                          <h3 className="font-extrabold text-sm text-[#16131F]">{feat.title}</h3>
                        </div>
                        <p className="text-xs text-[#5E5A70] leading-relaxed">{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* What is in the package */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h3 className="font-extrabold text-base text-[#16131F]">Contenu du coffret premium :</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#3A3647]">
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100 font-semibold">
                      <Check className="w-4 h-4 text-[#1E5E3F] flex-shrink-0" />
                      <span>1x Montre Connectée Ultra Pro Series 9</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100 font-semibold">
                      <Check className="w-4 h-4 text-[#1E5E3F] flex-shrink-0" />
                      <span>1x Bracelet Silicone Sport Haute Résistance</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100 font-semibold">
                      <Check className="w-4 h-4 text-[#1E5E3F] flex-shrink-0" />
                      <span>1x Bracelet Maille Milanaise Offert</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100 font-semibold">
                      <Check className="w-4 h-4 text-[#1E5E3F] flex-shrink-0" />
                      <span>1x Câble de chargeur sans fil magnétique</span>
                    </div>
                  </div>
                </div>

                {/* Customer Reviews Highlight */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-base text-[#16131F]">Avis clients récents (184 avis)</h3>
                    <div className="flex items-center gap-1 text-xs font-black text-[#F5C800]">
                      <span>★ 4.9 / 5</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Kouassi Jean-Marc', city: 'Abidjan (Cocody)', comment: 'Reçu en 24h à mon bureau à Cocody. J’ai vérifié le colis avant de payer en espèces au livreur. La qualité de l’écran est juste bluffante !', date: 'Il y a 2 jours' },
                      { name: 'Amina Diop', city: 'Dakar / Abidjan', comment: 'Batterie très résistante, les appels passent très clairement. Les 2 bracelets fournis permettent de changer de style facilement.', date: 'Il y a 5 jours' }
                    ].map((rev) => (
                      <div key={rev.name} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-xs text-[#16131F]">{rev.name} · <span className="text-gray-500 font-normal">{rev.city}</span></span>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                        <div className="text-amber-500 text-xs">★★★★★</div>
                        <p className="text-xs text-[#5E5A70] leading-relaxed mt-1">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIMPLE COD ORDER FORM (PLACED JUST TO THE RIGHT OF PRODUCT IMAGE) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#6C4CF1] shadow-xl shadow-[#6C4CF1]/10 space-y-6">
                
                {/* Product Title & Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black">
                    <span>★★★★★</span>
                    <span className="text-[#5E5A70] font-bold">4.9/5 (184 avis vérifiés)</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#16131F] tracking-tight leading-tight">
                    Montre Connectée Ultra Pro Series 9
                  </h1>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-[#6C4CF1]">
                      {fmt(currentPrice)} FCFA
                    </span>
                    <span className="text-base text-gray-400 line-through font-bold">
                      {fmt(regularPrice)} FCFA
                    </span>
                    <span className="text-xs font-black text-[#1E5E3F] bg-[#E3F4EC] px-2.5 py-1 rounded-full">
                      Économisez {fmt(savings)} F
                    </span>
                  </div>
                </div>

                {/* FORMULAIRE COD DE COMMANDE SIMPLE */}
                <form onSubmit={handleOrderSubmit} className="space-y-5 pt-2 border-t border-gray-100">
                  
                  {/* Package Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#16131F] uppercase tracking-wider block">
                      1. Choisissez votre offre :
                    </label>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Pack 1 */}
                      <button
                        type="button"
                        onClick={() => setSelectedPack('pack1')}
                        className={`text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                          selectedPack === 'pack1'
                            ? 'border-[#6C4CF1] bg-[#F4F1FE] ring-1 ring-[#6C4CF1]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-sm text-[#16131F]">1x Montre Ultra Pro</div>
                          <div className="text-xs text-[#5E5A70]">Livrée avec ses 2 bracelets inclus</div>
                        </div>
                        <span className="text-base font-black text-[#6C4CF1]">{fmt(pricePack1)} F</span>
                      </button>

                      {/* Pack 2: Duo Promo */}
                      <button
                        type="button"
                        onClick={() => setSelectedPack('pack2')}
                        className={`text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between relative overflow-hidden ${
                          selectedPack === 'pack2'
                            ? 'border-[#6C4CF1] bg-[#F4F1FE] ring-1 ring-[#6C4CF1]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <span className="absolute top-0 right-0 bg-[#D6304A] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                          Offre Duo Recommandée
                        </span>
                        <div>
                          <div className="font-extrabold text-sm text-[#16131F]">Pack Duo : 2x Montres Ultra Pro</div>
                          <div className="text-xs text-[#1E5E3F] font-bold">5 000 FCFA de remise additionnelle !</div>
                        </div>
                        <span className="text-base font-black text-[#6C4CF1]">{fmt(pricePack2)} F</span>
                      </button>
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#16131F] uppercase tracking-wider block">
                      2. Couleur du cadran : <span className="text-[#6C4CF1]">{selectedColor}</span>
                    </label>

                    <div className="flex gap-2.5">
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            selectedColor === c.name
                              ? 'border-[#6C4CF1] bg-[#EEE9FF] text-[#3F25A8] font-extrabold'
                              : 'border-gray-200 bg-white text-[#5E5A70] hover:border-gray-300'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${c.bg} border border-gray-300`} />
                          <span className="truncate">{c.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COD Client Details */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-extrabold text-[#16131F] uppercase tracking-wider block">
                      3. Vos coordonnées de livraison :
                    </label>

                    {/* Full Name */}
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom complet *"
                        required
                        className="w-full bg-[#FAF9FE] border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                      />
                    </div>

                    {/* WhatsApp Phone */}
                    <div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Numéro WhatsApp pour la livraison *"
                        required
                        className="w-full bg-[#FAF9FE] border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                      />
                    </div>

                    {/* City Selector */}
                    <div>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#FAF9FE] border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 cursor-pointer"
                      >
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address / Landmark */}
                    <div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Précisions de lieu (repère, carrefour, pharmacie...)"
                        className="w-full bg-[#FAF9FE] border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                      />
                    </div>

                    {/* Payment mode choice */}
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-[#5E5A70] block mb-1.5">
                        Moyen de paiement à la réception du colis :
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer font-bold transition-all ${
                            paymentMethod === 'cash' ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' : 'border-gray-200 text-[#5E5A70]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                            className="accent-[#6C4CF1]"
                          />
                          <span>💵 Espèces</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer font-bold transition-all ${
                            paymentMethod === 'momo' ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' : 'border-gray-200 text-[#5E5A70]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'momo'}
                            onChange={() => setPaymentMethod('momo')}
                            className="accent-[#6C4CF1]"
                          />
                          <span>📱 Wave / Orange</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Big Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#6C4CF1] hover:bg-[#5B3FD6] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-[#6C4CF1]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Truck className="w-5 h-5" />
                        <span>COMMANDER · PAYER À LA LIVRAISON</span>
                      </>
                    )}
                  </button>

                  {/* Reassurance badge */}
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center space-y-1">
                    <span className="text-xs font-bold text-[#16131F] flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#1E5E3F]" />
                      Paiement 100% à la livraison (COD)
                    </span>
                    <p className="text-[11px] text-[#5E5A70]">
                      Vous ne payez rien maintenant. Le livreur encaisse seulement quand vous avez le produit en main.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

