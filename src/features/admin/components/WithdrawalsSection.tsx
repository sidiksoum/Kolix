// src/features/admin/components/WithdrawalsSection.tsx
import React from 'react';
import { WithdrawalAdminItem, WithdrawalStatus } from '../types';

interface WithdrawalsSectionProps {
  withdrawals: WithdrawalAdminItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const WithdrawalsSection: React.FC<WithdrawalsSectionProps> = ({
  withdrawals,
  onApprove,
  onReject,
}) => {
  const statusStyles: Record<WithdrawalStatus, string> = {
    'Payé': 'bg-[#E3F4EC] text-[#1E5E3F]',
    'Rejeté': 'bg-[#FCE3E0] text-[#8A2414]',
    'En attente': 'bg-[#FFF6CC] text-[#4D3B00]',
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Retraits à valider</h1>
        <p className="text-sm text-[#5E5A70] mt-1 font-medium">
          Demandes de retrait des Portefeuilles Kolix (marchands et partenaires).
        </p>
      </div>

      <section className="bg-white rounded-[18px] shadow-sm border border-[#EEEAFB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[760px]">
            <thead>
              <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider border-b border-[#F0EDFB]">
                <th className="py-3.5 px-5 font-bold">Demandeur</th>
                <th className="py-3.5 px-3 font-bold">Vers</th>
                <th className="py-3.5 px-3 font-bold">Demandé le</th>
                <th className="py-3.5 px-3 font-bold text-right">Montant</th>
                <th className="py-3.5 px-3 font-bold">Statut</th>
                <th className="py-3.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-[#8B869C] font-semibold">
                    Aucune demande de retrait enregistrée.
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => {
                  const isPending = w.status === 'En attente';
                  return (
                    <tr key={w.id} className="hover:bg-[#FAF9FE]/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#16131F]">{w.who}</div>
                        <div className="text-xs text-[#5E5A70]">{w.kind}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[#3A3647] font-medium">{w.dest}</td>
                      <td className="py-3.5 px-3 text-xs text-[#3A3647] whitespace-nowrap">
                        {w.date}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-[#16131F] whitespace-nowrap">
                        {w.amount.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${
                            statusStyles[w.status]
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        {isPending ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => onApprove(w.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#1E5E3F] hover:bg-[#164730] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => onReject(w.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-transparent hover:bg-red-50 text-[#A3202F] border border-[#F2C4C9] text-xs font-bold transition-all cursor-pointer"
                            >
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#8B869C] font-semibold italic">
                            Traité
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

