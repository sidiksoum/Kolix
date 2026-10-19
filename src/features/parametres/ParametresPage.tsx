import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Store, CreditCard, Bell, Shield, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export const ParametresPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
          Paramètres
        </h1>
        <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
          Gérez votre profil marchand, vos préférences de livraison et votre abonnement Kolix
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-5">
          <h2 className="text-lg font-extrabold text-[#241D5E]">Informations de la boutique</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Nom de la boutique</label>
              <Input defaultValue={user.currentShop.name} />
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Devise principale</label>
              <Input defaultValue="Franc CFA (XOF / FCFA)" disabled className="bg-[#FAF8FF]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Email de contact marchand</label>
            <Input defaultValue={user.email} />
          </div>

          <div className="pt-2">
            <Button variant="primary" onClick={() => toast.success('Paramètres enregistrés avec succès')}>
              Sauvegarder les modifications
            </Button>
          </div>
        </div>

        <div className="bg-[#241D5E] text-white rounded-3xl p-6 shadow-kolix-navy flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#A99BFA] uppercase tracking-wider">Abonnement</span>
            <h3 className="text-2xl font-extrabold mt-1">{user.currentShop.plan}</h3>
            <p className="text-xs text-[#D9D3F5] mt-2 leading-relaxed">
              Votre formule actuelle vous permet de traiter jusqu’à 1 500 commandes COD par mois avec QR code de paiement Mobile Money.
            </p>
          </div>

          <Button
            variant="gold"
            onClick={() => toast.info('Passage au forfait Pro')}
            className="w-full rounded-2xl"
          >
            Passer à Kolix Pro
          </Button>
        </div>
      </div>
    </div>
  );
};
