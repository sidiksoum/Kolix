import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';
import { useStore } from '../../context/StoreContext';
import { productsApi } from '../../api/products.api';
import { Product, FicheProduitReview } from '../../types/product';
import { toast } from 'sonner';

interface Offer {
  qty: number;
  label: string;
  price: number;
  best?: boolean;
}

const CONFIG = {
  shopName: "MaBoutique",
  whatsapp: "",
  product: { id: "BLENDGO-400", name: "BlendGo – Mixeur portable 400 ml" },
  oldPrice: 25000,
  offers: [
    { qty: 1, label: "1 mixeur", price: 15900 },
    { qty: 2, label: "Pack 2 mixeurs", price: 28900, best: true },
    { qty: 3, label: "Pack 3 mixeurs", price: 39900 }
  ] as Offer[],
  stock: 14
};

const fmt = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";

// SVG Slide Components matching kolix-page-produit.html exactly
const BlenderGraphic: React.FC<{ bg: string; liquid?: string; extra?: React.ReactNode }> = ({ bg, liquid, extra }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mixeur BlendGo" className="w-full h-full object-cover">
    <rect width="400" height="400" fill={bg} />
    {extra}
    <ellipse cx="200" cy="352" rx="78" ry="12" fill="#1D1430" opacity=".12" />
    <rect x="158" y="58" width="84" height="26" rx="10" fill="#5530B3" />
    <rect x="186" y="44" width="28" height="18" rx="6" fill="#5530B3" />
    <rect x="150" y="80" width="100" height="196" rx="16" fill="#FFFFFF" opacity=".55" stroke="#C9B6F7" strokeWidth="3" />
    {liquid && (
      <path d="M153 150 Q200 138 247 150 V262 a13 13 0 0 1-13 13 H166 a13 13 0 0 1-13-13Z" fill={liquid} />
    )}
    <path d="M178 264 L200 252 L222 264 L200 270Z" fill="#B8B2C8" />
    <rect x="146" y="272" width="108" height="76" rx="18" fill="#6B3FD4" />
    <circle cx="200" cy="310" r="13" fill="#F1ECFC" />
    <circle cx="200" cy="310" r="5" fill="#6B3FD4" />
    <rect x="166" y="90" width="8" height="150" rx="4" fill="#FFFFFF" opacity=".7" />
  </svg>
);

export const ProductPage: React.FC = () => {
  const { createOrder } = useOrders();
  const { activeTemplate, activeStore } = useStore();
  const [searchParams] = useSearchParams();

  const productParam = searchParams.get('product') || searchParams.get('p') || searchParams.get('slug');
  const [productData, setProductData] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(Boolean(productParam));

  useEffect(() => {
    if (productParam) {
      setIsProductLoading(true);
      productsApi.getByIdOrSlug(productParam).then((res) => {
        if (res) setProductData(res);
      }).finally(() => {
        setIsProductLoading(false);
      });
    } else {
      setIsProductLoading(false);
    }
  }, [productParam]);

  const shopParam = searchParams.get('shop') || searchParams.get('s') || searchParams.get('store');
  let activeShopId = (productData as any)?.shop_id || shopParam || undefined;
  let activeShopSlug = shopParam || undefined;

  if (!activeShopId) {
    try {
      const savedUser = localStorage.getItem('kolix_user_profile');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u?.currentShop?.id) activeShopId = u.currentShop.id;
        if (u?.currentShop?.domain) activeShopSlug = u.currentShop.domain;
      }
    } catch {}
  }

  const currentShopName = (productData as any)?.shop_name || activeStore?.name || "Boutique Kolix";
  const currentShopLogo = (productData as any)?.shop_logo || activeStore?.logoUrl || null;
  const currentShopAccent = activeStore?.accentColor || "#6C4CF1";

  const activeProductName = productData?.name || CONFIG.product.name;
  const activeHeadline = productData?.fiche_produit?.headline || productData?.name || "BlendGo, le mixeur qui tient dans votre sac";
  const activeLead = productData?.fiche_produit?.leadSubtitle || productData?.description || "Jus, smoothies et laits frappés en 30 secondes, partout. Rechargeable par USB-C, 15 mixages par charge.";
  const activeOffers: Offer[] = (productData?.fiche_produit?.offers && productData.fiche_produit.offers.length > 0)
    ? productData.fiche_produit.offers
    : (productData ? [
        { qty: 1, label: "1 unité", price: productData.price },
        { qty: 2, label: "Pack Duo (2 unités)", price: Math.round(productData.price * 1.8), best: true },
        { qty: 3, label: "Pack Famille (3 unités)", price: Math.round(productData.price * 2.5) }
      ] : CONFIG.offers);

  const activeOldPrice = productData?.priceOld || (productData ? Math.round(productData.price * 1.45) : CONFIG.oldPrice);
  const activeStock = productData?.fiche_produit?.stockUrgency || productData?.stockQuantity || CONFIG.stock;
  const activeCountdown = productData?.fiche_produit?.countdownEnabled ?? (productData?.hasCountdown ?? true);

  const activeStoryTitle = productData?.fiche_produit?.storyTitle || (productData ? `Pourquoi choisir ${productData.name} ?` : "Votre jus frais, où que vous soyez");
  const activeStoryText = productData?.fiche_produit?.storyText || productData?.description || (
    "Au bureau, à la salle de sport ou en voyage, BlendGo vous permet de préparer une boisson fraîche sans prise électrique ni gros appareil. Ajoutez vos fruits, un peu d’eau ou de lait, appuyez deux fois : c’est prêt.\n\nSes 6 lames en acier inoxydable broient mangue, ananas, banane, gingembre et même la glace pilée. Le gobelet de 400 ml se ferme hermétiquement : vous buvez directement dedans, sans transvaser."
  );

  const isReviewsEnabled = productData?.fiche_produit?.reviewsEnabled ?? true;
  const activeReviews: FicheProduitReview[] = (productData?.fiche_produit?.reviews && productData.fiche_produit.reviews.length > 0)
    ? productData.fiche_produit.reviews
    : [
        {
          rating: 5,
          comment: "« J’ai pris le pack de deux, un pour moi et un pour ma sœur. Je fais mon jus de gingembre au bureau chaque matin. »",
          author: "Mariam K.",
          location: "Cocody",
          verified: true
        },
        {
          rating: 5,
          comment: "« Livré en 48 h à Bouaké. Le livreur a attendu que je teste avant de payer. Très sérieux. »",
          author: "Yao F.",
          location: "Bouaké",
          verified: true
        },
        {
          rating: 4,
          comment: "« Petit mais costaud, il écrase bien la mangue et les glaçons. La batterie tient presque une semaine. »",
          author: "Christelle A.",
          location: "Yopougon",
          verified: true
        }
      ];

  const activeBenefits = productData?.fiche_produit?.benefits || [
    { icon: '🔋', title: '15 mixages par charge', description: 'Rechargez avec n’importe quel chargeur de téléphone USB-C, en 2 à 3 heures.' },
    { icon: '🥭', title: 'Puissant malgré sa taille', description: 'Moteur 22 000 tours/min, 6 lames : fruits, légumes et glaçons passent sans effort.' },
    { icon: '🛡️', title: 'Sécurité enfant', description: 'Le moteur ne démarre que si le gobelet est bien vissé.' },
    { icon: '💧', title: 'Nettoyage en 10 secondes', description: 'Un peu d’eau savonneuse, deux pressions, rincez. C’est propre.' }
  ];

  const activeSpecs = productData?.fiche_produit?.specs || [
    { label: 'Capacité', value: '400 ml' },
    { label: 'Batterie', value: '2 000 mAh, recharge USB-C' },
    { label: 'Autonomie', value: 'Environ 15 mixages' },
    { label: 'Vitesse', value: '22 000 tours/min' },
    { label: 'Lames', value: '6 lames en acier inoxydable' },
    { label: 'Matériau', value: 'Tritan sans BPA' },
    { label: 'Dimensions', value: '24 × 8 cm, 420 g' },
    { label: 'Garantie', value: '6 mois' }
  ];

  const activeInTheBox = productData?.fiche_produit?.inTheBox || 'Dans la boîte : 1 mixeur BlendGo, 1 câble USB-C, 1 couvercle de transport, 1 notice en français.';

  const activeFaqs = productData?.fiche_produit?.faqs || [
    {
      question: 'Dois-je payer avant la livraison ?',
      answer: 'Non. Vous payez uniquement quand le livreur vous remet le colis, en espèces ou par Mobile Money.'
    },
    {
      question: 'Quels sont les délais de livraison ?',
      answer: '24 à 48 h à Abidjan, 48 à 72 h dans les autres villes de Côte d’Ivoire.'
    },
    {
      question: 'La livraison est-elle vraiment gratuite ?',
      answer: 'Oui, partout en Côte d’Ivoire pendant la durée de l’offre.'
    },
    {
      question: 'Et si le produit ne fonctionne pas ?',
      answer: 'Contactez-nous sur WhatsApp sous 7 jours : nous l’échangeons gratuitement. Le produit est garanti 6 mois.'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // Validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    ref: string;
    name: string;
    phone: string;
    total: number;
    offerLabel: string;
    note?: string;
  } | null>(null);

  // Countdown timer (hours, minutes, seconds)
  const [countdown, setCountdown] = useState({ h: '00', m: '00', s: '00' });

  // Mobile Sticky CTA visibility
  const [showStickyCta, setShowStickyCta] = useState(false);
  const orderFormRef = useRef<HTMLFormElement | null>(null);
  const touchStartX = useRef<number>(0);

  const selectedOffer = activeOffers[selectedOfferIndex] || activeOffers[0];
  const basePrice = activeOffers[0]?.price || 15900;
  const currentTotal = selectedOffer?.price || basePrice;
  const oldPriceSelected = activeOldPrice * (selectedOffer?.qty || 1);
  const savingsSelected = oldPriceSelected - currentTotal;
  const discountPercent = Math.max(5, Math.round((1 - basePrice / activeOldPrice) * 100));

  // Slides data
  const slides = (productData?.images && productData.images.length > 0)
    ? productData.images.map((imgUrl, idx) => ({
        id: idx,
        render: (
          <img
            src={imgUrl}
            alt={activeProductName}
            className="w-full h-full object-cover rounded-[22px]"
          />
        )
      }))
    : [
        {
          id: 0,
          render: <BlenderGraphic bg="#EDE5FD" liquid="#F28C38" />
        },
        {
          id: 1,
          render: (
            <BlenderGraphic
              bg="#FFF1E0"
              liquid="#E8574A"
              extra={
                <>
                  <circle cx="80" cy="320" r="34" fill="#F2A516" />
                  <circle cx="112" cy="296" r="22" fill="#E8574A" />
                  <circle cx="318" cy="318" r="30" fill="#7BC25A" />
                  <path d="M318 288 q8 -18 20 -20" stroke="#3F7A2A" strokeWidth="5" fill="none" />
                </>
              }
            />
          )
        },
        {
          id: 2,
          render: (
            <BlenderGraphic
              bg="#E4F4EC"
              liquid="#8FCB5E"
              extra={
                <g transform="translate(270 110)">
                  <rect width="88" height="46" rx="10" fill="#FFFFFF" />
                  <rect x="22" y="15" width="44" height="16" rx="8" fill="#1D1430" />
                  <text x="44" y="70" fontFamily="Figtree,sans-serif" fontSize="15" fontWeight="700" textAnchor="middle" fill="#1D1430">
                    USB-C
                  </text>
                </g>
              }
            />
          )
        },
        {
          id: 3,
          render: <BlenderGraphic bg="#F1ECFC" />
        }
      ];

  // Daily Countdown Timer to midnight
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      const pad = (n: number) => String(n).padStart(2, '0');
      setCountdown({
        h: pad(Math.floor(s / 3600)),
        m: pad(Math.floor((s % 3600) / 60)),
        s: pad(s % 60)
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sticky CTA scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (!orderFormRef.current) return;
      const rect = orderFormRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setShowStickyCta(window.scrollY > 300 && !isVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard escape listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  };

  // Validation rules
  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = /^(\+?225)?0?[1-9]\d{8}$/.test(phone.replace(/[\s.-]/g, '')) && phone.replace(/\D/g, '').length >= 10;
  const isCityValid = city.trim().length >= 2;
  const isAddressValid = address.trim().length >= 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, city: true, address: true });

    if (!isNameValid || !isPhoneValid || !isCityValid || !isAddressValid) {
      toast.error('Veuillez compléter correctement les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    const orderRef = 'CMD-' + Date.now().toString(36).toUpperCase().slice(-6);

    try {
      if (createOrder) {
        await createOrder({
          client: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          place: address.trim(),
          product: `${activeProductName} (${selectedOffer.label})`,
          amount: selectedOffer.price,
          note: note.trim(),
          shop_id: activeShopId,
          shop_slug: activeShopSlug,
          product_id: productData?.id
        });
      }

      setConfirmedOrder({
        ref: orderRef,
        name: name.trim(),
        phone: phone.trim(),
        total: selectedOffer.price,
        offerLabel: selectedOffer.label,
        note: note.trim()
      });

      setModalOpen(true);
      toast.success('Votre commande a bien été enregistrée !');

      // Reset form
      setName('');
      setPhone('');
      setCity('');
      setAddress('');
      setNote('');
      setTouched({});
    } catch {
      toast.error('Une erreur est survenue lors de l’envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-[#FBFAFE] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#6B3FD4] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="bricolage text-2xl font-black text-[#1D1430]">Chargement de votre produit…</h2>
        <p className="text-xs text-[#6A6080] mt-1 font-semibold">Récupération des informations et des offres exclusives en direct</p>
      </div>
    );
  }

  return (
    <div className="product-page-wrapper bg-[#FBFAFE] text-[#1D1430] min-h-screen selection:bg-[#C9B6F7]">
      {/* Embedded CSS matching kolix-page-produit.html */}
      <style>{`
        :root {
          --bg: #FBFAFE;
          --surface: #FFFFFF;
          --soft: #F1ECFC;
          --line: #E3DAF7;
          --ink: #1D1430;
          --muted: #6A6080;
          --violet: #6B3FD4;
          --violet-d: #5530B3;
          --lav: #C9B6F7;
          --ok: #1F9D6B;
          --promo: #D93A4A;
          --gold: #F2A516;
          --radius-l: 22px;
          --radius: 14px;
          --radius-s: 9px;
        }
        .bricolage {
          font-family: "Bricolage Grotesque", "Figtree", system-ui, -apple-system, sans-serif;
        }
        .offer-card {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border: 2px solid var(--line);
          border-radius: var(--radius);
          padding: 0.75rem 0.9rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .offer-card.active {
          border-color: var(--violet);
          background: var(--soft);
        }
        details summary::-webkit-details-marker {
          display: none;
        }
        details summary::after {
          content: "+";
          font-size: 1.4rem;
          line-height: 1;
          color: var(--violet);
          transition: transform 0.2s;
        }
        details[open] summary::after {
          transform: rotate(45deg);
        }
        @keyframes pop {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: none; opacity: 1; }
        }
        .modal-card-anim {
          animation: pop 0.3s ease-out;
        }
      `}</style>

      {/* Topbar */}
      <div className="bg-[#1D1430] text-[#FBFAFE] text-center text-sm py-2.5 px-4 font-medium">
        Livraison <strong className="text-[#C9B6F7]">gratuite</strong> à Abidjan et à l’intérieur · Vous payez à la réception
      </div>

      {/* Header */}
      <header className="max-w-[1180px] mx-auto px-5 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 bricolage font-extrabold text-2xl text-[#1D1430] no-underline tracking-tight">
          {currentShopLogo ? (
            <img src={currentShopLogo} alt={currentShopName} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
          ) : (
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-extrabold shadow-sm"
              style={{ backgroundColor: currentShopAccent }}
            >
              {currentShopName.charAt(0).toUpperCase()}
            </span>
          )}
          <span>{currentShopName}</span>
        </a>
        <a
          href={CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}` : "#orderForm"}
          onClick={(e) => {
            if (!CONFIG.whatsapp) {
              e.preventDefault();
              scrollToForm();
            }
          }}
          className="text-sm text-[#6A6080] hover:text-[#6B3FD4] font-medium transition-colors"
        >
          Besoin d’aide ? WhatsApp
        </a>
      </header>

      {/* Main Grid: Gallery + Product details & Form */}
      <main className="max-w-[1180px] mx-auto px-5 pb-12 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
        {/* Sticky Gallery */}
        <section className="lg:sticky lg:top-5" aria-label="Photos du produit">
          <div
            className="relative bg-[#F1ECFC] rounded-[22px] aspect-square overflow-hidden grid place-items-center select-none shadow-sm"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <span className="absolute top-4 left-4 bg-[#D93A4A] text-white font-bold py-1.5 px-3 rounded-full text-sm z-10 shadow-sm">
              -{discountPercent} %
            </span>

            {/* Slide renderer */}
            <div className="w-full h-full flex items-center justify-center">
              {(slides[currentSlide] || slides[0])?.render}
            </div>

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Photo précédente"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs text-[#1D1430] text-2xl font-bold flex items-center justify-center shadow-md hover:bg-white transition-transform active:scale-95 cursor-pointer z-10"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Photo suivante"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs text-[#1D1430] text-2xl font-bold flex items-center justify-center shadow-md hover:bg-white transition-transform active:scale-95 cursor-pointer z-10"
                >
                  ›
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#1D1430]/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10 shadow-xs">
                  {currentSlide + 1} / {slides.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbs / Défilement vignettes */}
          {slides.length > 1 && (
            <div className={`grid gap-3 mt-3 ${slides.length === 2 ? 'grid-cols-2' : slides.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Voir la photo ${idx + 1}`}
                  className={`border-2 rounded-[14px] bg-[#F1ECFC] p-0 aspect-square overflow-hidden cursor-pointer transition-all ${
                    currentSlide === idx ? 'border-[#6B3FD4] ring-2 ring-[#6B3FD4]/30 scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  {s.render}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Product Infos & Order Form */}
        <section aria-labelledby="productTitle">
          <div className="flex items-center gap-2 text-sm text-[#6A6080]">
            <span className="text-[#F2A516] tracking-widest font-bold" aria-hidden="true">★★★★★</span>
            <span className="font-semibold">4,8/5 · 327 avis clients</span>
          </div>

          <h1 id="productTitle" className="bricolage text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1D1430] my-2 leading-[1.1] tracking-tight">
            {activeHeadline}
          </h1>

          <p className="text-[#6A6080] text-base mb-5 max-w-[52ch]">
            {activeLead}
          </p>

          <div className="flex items-baseline flex-wrap gap-2.5 sm:gap-3.5 mb-5">
            <span className="bricolage font-extrabold text-3xl sm:text-4xl text-[#6B3FD4]">
              {fmt(basePrice)}
            </span>
            <span className="text-lg text-[#6A6080] line-through">
              {fmt(activeOldPrice)}
            </span>
            <span className="text-sm font-bold text-[#D93A4A] bg-[#D93A4A]/10 px-2.5 py-1 rounded-full">
              Vous économisez {fmt(activeOldPrice - basePrice)}
            </span>
          </div>

          {/* Daily Countdown Box */}
          {activeCountdown && (
            <div className="bg-[#1D1430] text-[#FBFAFE] rounded-[22px] p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap mb-4 shadow-md">
              <p className="m-0 font-bold max-w-[20ch] leading-tight text-sm sm:text-base">
                Le prix promo se termine dans
              </p>
              <div className="flex gap-2">
                <div className="bg-white/10 rounded-[9px] min-w-[62px] text-center py-1.5 px-1">
                  <b className="bricolage block text-2xl font-extrabold tabular-nums leading-none">
                    {countdown.h}
                  </b>
                  <small className="text-[11px] opacity-75">heures</small>
                </div>
                <div className="bg-white/10 rounded-[9px] min-w-[62px] text-center py-1.5 px-1">
                  <b className="bricolage block text-2xl font-extrabold tabular-nums leading-none">
                    {countdown.m}
                  </b>
                  <small className="text-[11px] opacity-75">min</small>
                </div>
                <div className="bg-white/10 rounded-[9px] min-w-[62px] text-center py-1.5 px-1">
                  <b className="bricolage block text-2xl font-extrabold tabular-nums leading-none">
                    {countdown.s}
                  </b>
                  <small className="text-[11px] opacity-75">sec</small>
                </div>
              </div>
            </div>
          )}

          {/* Stock Urgency Bar */}
          <div className="flex items-center gap-2.5 text-sm mb-6">
            <span className="font-semibold text-[#1D1430]">
              Plus que <b className="text-[#D93A4A]">{activeStock}</b> en stock
            </span>
            <span className="flex-1 h-2 bg-[#E3DAF7] rounded-full overflow-hidden max-w-[220px]">
              <i className="block h-full w-[18%] bg-[#D93A4A] rounded-full" />
            </span>
          </div>

          {/* COD Order Form */}
          <form
            id="orderForm"
            ref={orderFormRef}
            onSubmit={handleSubmit}
            noValidate
            className="bg-white border-2 border-[#6B3FD4] rounded-[22px] p-5 sm:p-7 shadow-lg"
          >
            <h2 className="bricolage text-2xl font-extrabold text-[#1D1430] mb-1">
              Commandez maintenant
            </h2>
            <p className="text-[#6A6080] text-sm mb-5">
              Remplissez le formulaire, un conseiller vous appelle pour confirmer. Aucun paiement en ligne.
            </p>

            {/* Offers Selection */}
            <fieldset className="border-0 p-0 mb-5">
              <legend className="font-bold text-sm text-[#1D1430] mb-2.5">
                Choisissez votre offre
              </legend>
              <div className="grid gap-2.5">
                {activeOffers.map((offer, idx) => {
                  const was = activeOldPrice * offer.qty;
                  const gain = was - offer.price;
                  const isChecked = selectedOfferIndex === idx;

                  return (
                    <label
                      key={idx}
                      className={`offer-card ${isChecked ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="offer"
                        value={idx}
                        checked={isChecked}
                        onChange={() => setSelectedOfferIndex(idx)}
                        className="accent-[#6B3FD4] w-4.5 h-4.5 cursor-pointer"
                      />
                      <div className="flex-1 leading-snug">
                        <span className="font-extrabold text-sm text-[#1D1430]">
                          {offer.label}
                        </span>
                        {offer.best && (
                          <span className="text-[11px] font-extrabold bg-[#6B3FD4] text-white px-2 py-0.5 rounded-full ml-1.5">
                            Le plus choisi
                          </span>
                        )}
                        <small className="block text-[#1F9D6B] font-bold text-xs mt-0.5">
                          Économie de {fmt(gain)}
                        </small>
                      </div>
                      <div className="text-right font-bold text-sm">
                        <s className="block font-normal text-[#6A6080] text-xs">
                          {fmt(was)}
                        </s>
                        <span className="text-[#1D1430] font-extrabold">
                          {fmt(offer.price)}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Full Name */}
            <div className="mb-3.5">
              <label htmlFor="name" className="block font-bold text-sm text-[#1D1430] mb-1.5">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                placeholder="Ex. : Aya Koné"
                className={`w-full bg-[#FBFAFE] text-[#1D1430] border rounded-[9px] py-3 px-3.5 text-sm transition-colors outline-none focus:border-[#6B3FD4] focus:ring-2 focus:ring-[#6B3FD4]/20 ${
                  touched.name && !isNameValid ? 'border-[#D93A4A]' : 'border-[#E3DAF7]'
                }`}
                required
              />
              {touched.name && !isNameValid && (
                <div className="text-[#D93A4A] text-xs mt-1 font-semibold">
                  Indiquez votre nom pour que le livreur vous identifie.
                </div>
              )}
            </div>

            {/* Phone & City (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <label htmlFor="phone" className="block font-bold text-sm text-[#1D1430] mb-1.5">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                  placeholder="07 00 00 00 00"
                  className={`w-full bg-[#FBFAFE] text-[#1D1430] border rounded-[9px] py-3 px-3.5 text-sm transition-colors outline-none focus:border-[#6B3FD4] focus:ring-2 focus:ring-[#6B3FD4]/20 ${
                    touched.phone && !isPhoneValid ? 'border-[#D93A4A]' : 'border-[#E3DAF7]'
                  }`}
                  required
                />
                {touched.phone && !isPhoneValid && (
                  <div className="text-[#D93A4A] text-xs mt-1 font-semibold">
                    Entrez un numéro à 10 chiffres (ex. : 07 12 34 56 78).
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block font-bold text-sm text-[#1D1430] mb-1.5">
                  Ville
                </label>
                <input
                  id="city"
                  name="city"
                  list="cities"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, city: true }))}
                  placeholder="Ex. : Abidjan"
                  className={`w-full bg-[#FBFAFE] text-[#1D1430] border rounded-[9px] py-3 px-3.5 text-sm transition-colors outline-none focus:border-[#6B3FD4] focus:ring-2 focus:ring-[#6B3FD4]/20 ${
                    touched.city && !isCityValid ? 'border-[#D93A4A]' : 'border-[#E3DAF7]'
                  }`}
                  required
                />
                <datalist id="cities">
                  <option value="Abidjan" />
                  <option value="Bouaké" />
                  <option value="Yamoussoukro" />
                  <option value="Daloa" />
                  <option value="San-Pédro" />
                  <option value="Korhogo" />
                  <option value="Man" />
                  <option value="Gagnoa" />
                  <option value="Divo" />
                  <option value="Abengourou" />
                  <option value="Bondoukou" />
                  <option value="Bocanda" />
                  <option value="Grand-Bassam" />
                  <option value="Bingerville" />
                  <option value="Anyama" />
                </datalist>
                {touched.city && !isCityValid && (
                  <div className="text-[#D93A4A] text-xs mt-1 font-semibold">
                    Indiquez votre ville.
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-3.5">
              <label htmlFor="address" className="block font-bold text-sm text-[#1D1430] mb-1.5">
                Adresse de livraison
              </label>
              <input
                id="address"
                name="address"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, address: true }))}
                placeholder="Commune, quartier, repère (ex. : Cocody Angré, près de la pharmacie)"
                className={`w-full bg-[#FBFAFE] text-[#1D1430] border rounded-[9px] py-3 px-3.5 text-sm transition-colors outline-none focus:border-[#6B3FD4] focus:ring-2 focus:ring-[#6B3FD4]/20 ${
                  touched.address && !isAddressValid ? 'border-[#D93A4A]' : 'border-[#E3DAF7]'
                }`}
                required
              />
              {touched.address && !isAddressValid && (
                <div className="text-[#D93A4A] text-xs mt-1 font-semibold">
                  Précisez le quartier et un repère pour le livreur.
                </div>
              )}
            </div>

            {/* Note */}
            <div className="mb-4">
              <label htmlFor="note" className="block font-bold text-sm text-[#1D1430] mb-1.5">
                Note de commande <span className="font-normal text-[#6A6080]">(facultatif)</span>
              </label>
              <textarea
                id="note"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Couleur souhaitée, heure de livraison préférée…"
                className="w-full bg-[#FBFAFE] text-[#1D1430] border border-[#E3DAF7] rounded-[9px] py-2.5 px-3.5 text-sm min-h-[80px] resize-y outline-none focus:border-[#6B3FD4] focus:ring-2 focus:ring-[#6B3FD4]/20"
              />
            </div>

            {/* Summary Breakdown */}
            <div className="border-t border-dashed border-[#E3DAF7] pt-3.5 my-4 space-y-1 text-sm">
              <div className="flex justify-between text-[#6A6080]">
                <span>Sous-total</span>
                <span className="font-bold text-[#1D1430]">{fmt(currentTotal)}</span>
              </div>
              <div className="flex justify-between text-[#6A6080]">
                <span>Livraison</span>
                <span className="text-[#1F9D6B] font-bold">Gratuite</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-extrabold text-base sm:text-lg text-[#1D1430] border-t border-[#F1ECFC]">
                <span>Total à payer à la livraison</span>
                <span className="text-[#6B3FD4] font-black">{fmt(currentTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6B3FD4] hover:bg-[#5530B3] text-white font-extrabold text-base sm:text-lg py-4 px-6 rounded-[14px] shadow-lg hover:shadow-xl transition-all duration-150 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? 'Envoi de la commande…' : 'Commander – payer à la livraison'}
            </button>

            {/* Reassurance items */}
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4 p-0 list-none text-xs text-[#6A6080]">
              <li>💵 Paiement à la réception</li>
              <li>🚚 Livré en 24–72 h</li>
              <li>🔁 Échange sous 7 jours</li>
            </ul>
          </form>
        </section>
      </main>

      {/* Description & Benefits Section */}
      <section className="max-w-[1180px] mx-auto px-5 py-14" id="description" aria-labelledby="descTitle">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
          <div>
            <h2 id="descTitle" className="bricolage text-2xl sm:text-3xl font-extrabold text-[#1D1430] mb-4">
              {activeStoryTitle}
            </h2>
            <div className="space-y-4 text-[#6A6080] leading-relaxed mb-6">
              {activeStoryText.split('\n').filter(p => p.trim().length > 0).map((para, pIdx) => (
                <p key={pIdx} className="m-0">
                  {para}
                </p>
              ))}
            </div>

            <div className="grid gap-4 mt-6">
              {activeBenefits.map((b, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="w-11 h-11 rounded-xl bg-[#F1ECFC] flex items-center justify-center text-xl shrink-0" aria-hidden="true">
                    {b.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#1D1430] text-base mb-0.5">{b.title}</h3>
                    <p className="text-sm text-[#6A6080] m-0">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specs Card */}
          <aside className="bg-white border border-[#E3DAF7] rounded-[22px] p-6 shadow-sm overflow-x-auto">
            <h3 className="bricolage text-xl font-extrabold text-[#1D1430] mb-4">
              Caractéristiques
            </h3>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {activeSpecs.map((s, i) => (
                  <tr key={i} className="border-b border-[#E3DAF7]">
                    <td className="py-2.5 text-[#6A6080] w-[45%] pr-4">{s.label}</td>
                    <td className="py-2.5 font-semibold text-[#1D1430]">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-xs text-[#6A6080] leading-relaxed border-t border-[#F1ECFC] pt-3">
              {activeInTheBox}
            </p>
          </aside>
        </div>
      </section>

      {/* How it works (Comment ça marche) */}
      <section className="bg-[#F1ECFC] py-14" aria-labelledby="stepsTitle">
        <div className="max-w-[1180px] mx-auto px-5">
          <h2 id="stepsTitle" className="bricolage text-2xl sm:text-3xl font-extrabold text-[#1D1430] mb-8">
            Comment se passe votre commande
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
            <li className="relative pt-14">
              <span className="bricolage absolute top-0 left-0 w-10 h-10 rounded-full bg-[#6B3FD4] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                1
              </span>
              <h3 className="font-bold text-[#1D1430] text-lg mb-1">Vous remplissez le formulaire</h3>
              <p className="text-sm text-[#6A6080] m-0">Une minute suffit. Aucun paiement à l’avance.</p>
            </li>
            <li className="relative pt-14">
              <span className="bricolage absolute top-0 left-0 w-10 h-10 rounded-full bg-[#6B3FD4] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                2
              </span>
              <h3 className="font-bold text-[#1D1430] text-lg mb-1">Nous vous appelons</h3>
              <p className="text-sm text-[#6A6080] m-0">Un conseiller confirme votre commande et votre adresse sous 24 h.</p>
            </li>
            <li className="relative pt-14">
              <span className="bricolage absolute top-0 left-0 w-10 h-10 rounded-full bg-[#6B3FD4] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                3
              </span>
              <h3 className="font-bold text-[#1D1430] text-lg mb-1">Vous payez à la livraison</h3>
              <p className="text-sm text-[#6A6080] m-0">Espèces ou Mobile Money, une fois le colis entre vos mains.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Verified Reviews */}
      {isReviewsEnabled && activeReviews.length > 0 && (
        <section className="max-w-[1180px] mx-auto px-5 py-14" aria-labelledby="reviewsTitle">
          <h2 id="reviewsTitle" className="bricolage text-2xl sm:text-3xl font-extrabold text-[#1D1430] mb-8">
            Ce qu’en disent nos clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeReviews.map((rev, rIdx) => (
              <figure key={rIdx} className="bg-white border border-[#E3DAF7] rounded-[22px] p-5 shadow-sm m-0 flex flex-col justify-between">
                <div>
                  <span className="text-[#F2A516] tracking-widest text-sm" aria-label={`${rev.rating} sur 5`}>
                    {'★'.repeat(rev.rating) + '☆'.repeat(Math.max(0, 5 - rev.rating))}
                  </span>
                  <blockquote className="my-2.5 text-sm text-[#1D1430] italic leading-relaxed">
                    {rev.comment}
                  </blockquote>
                </div>
                <figcaption className="text-xs text-[#6A6080] pt-2 border-t border-[#F1ECFC]">
                  <b className="text-[#1D1430]">{rev.author}</b>
                  {rev.location && `, ${rev.location}`}
                  {rev.verified !== false && (
                    <> · <span className="text-[#1F9D6B] font-bold">Achat vérifié</span></>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-[780px] mx-auto px-5 pb-16" aria-labelledby="faqTitle">
        <h2 id="faqTitle" className="bricolage text-2xl sm:text-3xl font-extrabold text-[#1D1430] mb-6">
          Questions fréquentes
        </h2>
        <div className="space-y-0">
          {activeFaqs.map((faq, i) => (
            <details key={i} className="border-b border-[#E3DAF7] py-4 group">
              <summary className="font-bold text-base text-[#1D1430] cursor-pointer list-none flex justify-between items-center gap-4 select-none">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-[#6A6080] leading-relaxed max-w-[65ch]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-[#6A6080] py-8 px-5 border-t border-[#E3DAF7] pb-24 md:pb-8">
        © {new Date().getFullYear()} {currentShopName} · Boutique propulsée par Kolix COD
      </footer>

      {/* Mobile Sticky CTA Bar */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-40 bg-white border-t border-[#E3DAF7] p-3 md:hidden flex items-center justify-between gap-4 transition-transform duration-300 shadow-2xl ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div>
          <s className="block text-xs text-[#6A6080] leading-tight">{fmt(activeOldPrice)}</s>
          <span className="font-extrabold text-lg text-[#6B3FD4] leading-tight">{fmt(basePrice)}</span>
        </div>
        <button
          onClick={scrollToForm}
          className="flex-1 bg-[#6B3FD4] text-white font-extrabold py-3 px-4 rounded-xl text-center text-sm shadow-md"
        >
          Commander
        </button>
      </div>

      {/* Order Confirmation Modal */}
      {modalOpen && confirmedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-[#130E1F]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-[22px] p-6 sm:p-8 max-w-[440px] w-full text-center shadow-2xl modal-card-anim border border-[#E3DAF7]">
            <div className="w-16 h-16 rounded-full bg-[#1F9D6B] text-white text-3xl font-black flex items-center justify-center mx-auto mb-4 shadow-md">
              ✓
            </div>
            <h2 className="bricolage text-2xl font-extrabold text-[#1D1430] mb-2">
              Commande reçue
            </h2>
            <p className="text-sm text-[#6A6080] mb-2">
              Merci <strong className="text-[#1D1430]">{confirmedOrder.name.split(' ')[0]}</strong> ! Un conseiller vous appelle au <strong className="text-[#1D1430]">{confirmedOrder.phone}</strong> pour confirmer la livraison.
            </p>
            <div className="bg-[#F1ECFC] rounded-xl p-3 my-3 text-xs sm:text-sm text-[#1D1430] space-y-1">
              <div>Référence : <span className="font-extrabold">{confirmedOrder.ref}</span></div>
              <div>Offre : <span className="font-bold">{confirmedOrder.offerLabel}</span></div>
              <div>Montant à la livraison : <span className="font-extrabold text-[#6B3FD4]">{fmt(confirmedOrder.total)}</span></div>
            </div>
            <p className="text-xs text-[#6A6080] mb-5">
              Conservez votre téléphone allumé. Vous payez en espèces ou Mobile Money uniquement à la réception.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full bg-[#6B3FD4] hover:bg-[#5530B3] text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
