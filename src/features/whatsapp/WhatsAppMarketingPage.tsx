import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MessageSquare, Send, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const WhatsAppMarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'relance' | 'confirmation' | 'broadcast'>('relance');

  const automations = [
    { id: 'wa_01', name: 'Confirmation de commande instantanée', desc: 'Envoie un récapitulatif avec bouton de confirmation dès qu’une commande COD est passée.', status: 'Actif', sent: 1048 },
    { id: 'wa_02', name: 'Avis de passage livreur le jour J', desc: 'Notifie le client le matin de la livraison avec créneau horaire et le montant exact en espèces.', status: 'Actif', sent: 890 },
    { id: 'wa_03', name: 'Relance des paniers abandonnés', desc: 'Propose une réduction de 10% 2h après un panier non finalisé.', status: 'Inactif', sent: 320 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
              WhatsApp Marketing & Relances COD
            </h1>
            <Badge variant="pro">PRO</Badge>
          </div>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Automatisez vos confirmations de livraison et réduisez les retours de colis de 40%
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => toast.success('Assistant de campagne de relance prêt')}
          className="rounded-full shadow-kolix-cta"
        >
          <Send className="w-4 h-4 mr-1.5" />
          Nouvelle campagne WhatsApp
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {automations.map(a => (
          <div key={a.id} className="bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="w-10 h-10 rounded-2xl bg-[#E3F9ED] text-[#136637] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <Badge variant={a.status === 'Actif' ? 'optimal' : 'default'}>{a.status}</Badge>
              </div>
              <h3 className="text-base font-extrabold text-[#16131F]">{a.name}</h3>
              <p className="text-xs text-[#5E5A70] mt-1 leading-relaxed">{a.desc}</p>
            </div>
            <div className="pt-3 border-t border-[#F0EDFB] flex justify-between items-center text-xs">
              <span className="text-[#5E5A70]">{a.sent} messages envoyés</span>
              <button
                onClick={() => toast.info(`Configuration ${a.name}`)}
                className="font-extrabold text-[#6C4CF1] hover:underline cursor-pointer"
              >
                Configurer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
