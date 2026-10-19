import React from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { UserCheck, Plus, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

export const UtilisateursPage: React.FC = () => {
  const team = [
    { name: 'Souleymane Sanogo', email: 'souleymane@kolix.ci', role: 'Propriétaire', status: 'Actif', access: 'Accès complet' },
    { name: 'Amina Diop', email: 'amina@kolix.ci', role: 'Gestionnaire des commandes', status: 'Actif', access: 'Commandes & Stock' },
    { name: 'Kouassi Jean', email: 'jean.k@livreur.ci', role: 'Livreur', status: 'Actif', access: 'Application Livreur COD' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Utilisateurs & Rôles
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Gérez les accès de vos collaborateurs, gestionnaires de stock et livreurs
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => toast.info('Invitation envoyée par email/SMS')}
          className="rounded-full shadow-kolix-cta"
        >
          <Plus className="w-4 h-4 mr-1" />
          Inviter un collaborateur
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
              <th className="py-3 px-3 font-bold">Collaborateur</th>
              <th className="py-3 px-3 font-bold">Rôle</th>
              <th className="py-3 px-3 font-bold">Permissions</th>
              <th className="py-3 px-3 font-bold">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EDFB]">
            {team.map(m => (
              <tr key={m.email} className="hover:bg-[#FAF8FF]">
                <td className="py-3.5 px-3">
                  <div className="font-extrabold text-[#16131F]">{m.name}</div>
                  <div className="text-xs text-[#5E5A70]">{m.email}</div>
                </td>
                <td className="py-3.5 px-3 font-bold text-[#241D5E]">{m.role}</td>
                <td className="py-3.5 px-3 text-[#5E5A70]">{m.access}</td>
                <td className="py-3.5 px-3">
                  <Badge variant="optimal">{m.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
