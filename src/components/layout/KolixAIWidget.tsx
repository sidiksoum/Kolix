import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { useStock } from '../../context/StockContext';
import { useWallet } from '../../context/WalletContext';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const KolixAIWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { orders } = useOrders();
  const { alerts, inventory } = useStock();
  const { summary } = useWallet();

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Bonjour Souleymane ! Je suis **Kolix AI**, votre copilote e-commerce & Cash on Delivery. Comment puis-je vous aider à maximiser vos livraisons aujourd’hui ?'
    }
  ]);

  const quickPrompts = [
    'Quelles commandes relancer en priorité ?',
    'Générer un message WhatsApp pour client injoignable',
    'Faire le point sur le stock faible',
    'Analyser les encaissements Wave vs Orange'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs: Message[] = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);
    setInput('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('relancer') || lower.includes('injoignable') || lower.includes('whatsapp')) {
        reply = `Voici un modèle de relance WhatsApp prêt à l'emploi pour vos commandes injoignables (ex: KX-1043) :\n\n"Bonjour [Prénom] ! Votre livreur Kolix est actuellement dans votre secteur à Treichville avec votre commande *Montre connectée X2* (22 000 FCFA). Pouvez-vous nous confirmer l'adresse exacte pour livraison aujourd'hui ? Merci !"`;
      } else if (lower.includes('stock')) {
        const crit = alerts.length;
        reply = `Actuellement vous avez **${crit} produits sous le seuil d'alerte** : le *Lisseur céramique Pro* (reste 3 unités) et le *Pagne Kita* (reste 2). Je vous conseille de lancer un réapprovisionnement de 20 unités pour éviter la rupture ce week-end.`;
      } else if (lower.includes('wave') || lower.includes('portefeuille') || lower.includes('momo') || lower.includes('encaiss')) {
        reply = `Sur votre Portefeuille numérique Kolix, vous avez **${(summary?.digitalBalance || 845000).toLocaleString('fr-FR')} FCFA** immédiatement disponibles au retrait par Wave ou Orange Money, et 1 320 000 FCFA encaissés en espèces par vos livreurs.`;
      } else {
        reply = `Analyse en temps réel de votre boutique : Vous avez 8 commandes actives ce matin, dont 2 livrées avec succès par Wave. Le taux de conversion est de 86 %, ce qui est excellent pour le marché d'Abidjan !`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir Kolix AI"
        className="fixed right-6 sm:right-7 bottom-6 sm:bottom-7 z-40 flex items-center gap-2.5 font-extrabold text-[15px] bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white border-0 rounded-full px-5 pl-4 min-h-[56px] cursor-pointer shadow-kolix-cta transition-transform hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-5 h-5" />
        <span>Kolix AI</span>
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 sm:right-8 z-50 w-[92vw] sm:w-[400px] h-[580px] bg-white rounded-3xl shadow-2xl border border-[#E2DCF8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          {/* Header */}
          <div className="bg-[#241D5E] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-[#6C4CF1] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <div className="font-extrabold text-base leading-tight">Kolix AI</div>
                <div className="text-[11px] text-[#A99BFA] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CE0AE]" /> Co-pilote e-commerce actif
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-[#FAF8FF]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[88%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {m.sender === 'ai' && (
                  <span className="w-7 h-7 rounded-lg bg-[#6C4CF1] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </span>
                )}
                <div
                  className={`text-sm p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-[#6C4CF1] text-white font-medium rounded-tr-sm'
                      : 'bg-white text-[#16131F] border border-[#E2DCF8]/60 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-[#F0EDFB] flex gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] font-bold px-3 py-1.5 rounded-full shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-[#E2DCF8] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez une question sur votre activité..."
              className="flex-1 bg-[#F4F1FE] text-sm text-[#16131F] rounded-full px-4 py-2.5 outline-none border border-transparent focus:border-[#6C4CF1]"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
