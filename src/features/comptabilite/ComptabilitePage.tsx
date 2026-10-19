import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Download, FileText, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA } from '../../utils/formatters';

export const ComptabilitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reconciliation' | 'livreurs' | 'recus'>('reconciliation');

  const driverReconciliations = [
    { id: 'REC-01', driver: 'Kouassi Jean (Livreur Cocody/Yopougon)', collected: 345000, deposited: 345000, status: 'Soldé', date: 'Aujourd’hui' },
    { id: 'REC-02', driver: 'Diallo Oumar (Livreur Marcory/Treichville)', collected: 210000, deposited: 180000, status: 'Écart 30 000 FCFA', date: 'Hier' },
    { id: 'REC-03', driver: 'Traoré Bakary (Livreur Bouaké)', collected: 185000, deposited: 185000, status: 'Soldé', date: '16 oct.' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Comptabilité & Rapprochement COD
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Suivi des encaissements espèces des livreurs, dépenses logistiques et bénéfices nets
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => toast.success('Export du journal comptable mensuel généré')}
          className="rounded-full shadow-kolix-sm"
        >
          <Download className="w-4 h-4 mr-1 text-[#5E5A70]" />
          Exporter le grand livre (Excel)
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-kolix flex flex-col gap-2 border border-[#E2DCF8]/60">
          <span className="text-xs font-bold text-[#5E5A70]">Total espèces encaissées (ce mois)</span>
          <span className="text-3xl font-extrabold text-[#F5C800]">1 320 000 FCFA</span>
          <span className="text-xs text-[#5E5A70]">Synchronisé avec les livreurs</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-kolix flex flex-col gap-2 border border-[#E2DCF8]/60">
          <span className="text-xs font-bold text-[#5E5A70]">Mobile Money collecté (Wave/Orange)</span>
          <span className="text-3xl font-extrabold text-[#6C4CF1]">2 150 000 FCFA</span>
          <span className="text-xs text-[#5E5A70]">Fonds crédités au portefeuille</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-kolix flex flex-col gap-2 border border-[#E2DCF8]/60">
          <span className="text-xs font-bold text-[#5E5A70]">Frais de livraison & expédition</span>
          <span className="text-3xl font-extrabold text-[#D6304A]">342 000 FCFA</span>
          <span className="text-xs text-[#5E5A70]">Rémunération des livreurs</span>
        </div>
      </div>

      {/* Rapprochement livreurs table */}
      <section className="bg-white rounded-3xl shadow-kolix border border-[#E2DCF8]/60 p-6 flex flex-col gap-4">
        <h2 className="text-lg font-extrabold text-[#241D5E]">Rapprochement caisse livreurs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
                <th className="py-3 px-3 font-bold">Réf</th>
                <th className="py-3 px-3 font-bold">Livreur</th>
                <th className="py-3 px-3 font-bold text-right">Espèces collectées</th>
                <th className="py-3 px-3 font-bold text-right">Versé en caisse</th>
                <th className="py-3 px-3 font-bold">Statut</th>
                <th className="py-3 px-3 font-bold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {driverReconciliations.map(r => (
                <tr key={r.id} className="hover:bg-[#FAF8FF]">
                  <td className="py-3 px-3 font-extrabold text-[#16131F]">{r.id}</td>
                  <td className="py-3 px-3 font-semibold text-[#16131F]">{r.driver}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#16131F]">{formatFCFA(r.collected)}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-[#241D5E]">{formatFCFA(r.deposited)}</td>
                  <td className="py-3 px-3">
                    <Badge variant={r.status === 'Soldé' ? 'optimal' : 'critique'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right text-xs text-[#5E5A70]">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
