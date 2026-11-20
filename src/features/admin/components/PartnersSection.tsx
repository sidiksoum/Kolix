// src/features/admin/components/PartnersSection.tsx
import React, { useState } from 'react';
import { PartnerAdminItem, PARTNER_CATEGORIES } from '../types';

interface PartnersSectionProps {
  partners: PartnerAdminItem[];
  onGenerateLink: (name: string, category: string) => void;
  generatedLink?: { link: string; code: string } | null;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({
  partners,
  onGenerateLink,
  generatedLink,
}) => {
  const [partnerName, setPartnerName] = useState('');
  const [category, setCategory] = useState('Formateurs e-commerce');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) return;
    onGenerateLink(partnerName.trim(), category);
    setPartnerName('');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Partenaires</h1>
        <p className="text-sm text-[#5E5A70] mt-1 font-medium">
          Créez des liens d’affiliation par catégorie et suivez les commissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form: Generate Affiliate Link */}
        <section className="bg-white rounded-[18px] p-6 shadow-sm border border-[#EEEAFB] flex flex-col gap-4">
          <h2 className="text-base font-bold text-[#16131F]">
            Générer un lien d’affiliation
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#5E5A70]">
              Nom du partenaire
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Ex. Amina Traoré"
                required
                className="w-full text-sm font-semibold border border-[#E2DCF8] rounded-xl px-3 py-2.5 text-[#16131F] outline-none focus:border-[#6C4CF1]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#5E5A70]">
              Catégorie
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm font-semibold border border-[#E2DCF8] rounded-xl px-3 py-2.5 bg-white text-[#16131F] outline-none"
              >
                {Object.keys(PARTNER_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-between items-center text-xs bg-[#F7F5FE] rounded-xl p-3">
              <span className="text-[#5E5A70]">Commission de la catégorie</span>
              <strong className="text-[#16131F] font-bold">
                {PARTNER_CATEGORIES[category]}
              </strong>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white rounded-xl text-sm font-bold shadow-md shadow-[#6C4CF1]/20 transition-all cursor-pointer"
            >
              Générer le lien et le code
            </button>
          </form>

          {/* Generated Link Alert */}
          {generatedLink && (
            <div className="border-2 border-dashed border-[#B9AAFF] rounded-2xl p-4 flex flex-col gap-1.5 text-xs bg-[#FAF8FF] animate-in fade-in">
              <span className="text-[#5E5A70] font-semibold">Lien créé</span>
              <strong className="text-sm text-[#3F25A8] font-bold select-all">
                {generatedLink.link}
              </strong>
              <span className="text-[#16131F] mt-1">
                Code promo : <strong className="text-[#6C4CF1]">{generatedLink.code}</strong>
              </span>
            </div>
          )}
        </section>

        {/* Right Table: Partners List */}
        <section className="lg:col-span-2 bg-white rounded-[18px] shadow-sm border border-[#EEEAFB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[620px]">
              <thead>
                <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider border-b border-[#F0EDFB]">
                  <th className="py-3.5 px-5 font-bold">Partenaire</th>
                  <th className="py-3.5 px-3 font-bold">Catégorie</th>
                  <th className="py-3.5 px-3 font-bold">Code</th>
                  <th className="py-3.5 px-3 font-bold text-right">Inscrits</th>
                  <th className="py-3.5 px-3 font-bold text-right">Abonnés</th>
                  <th className="py-3.5 px-5 font-bold text-right">Commission due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFB]">
                {partners.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9FE]/50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#16131F]">{p.name}</td>
                    <td className="py-3.5 px-3 text-xs text-[#3A3647] font-medium">{p.cat}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-bold bg-[#F4F1FE] text-[#3F25A8] rounded-lg px-2.5 py-1">
                        {p.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-[#16131F]">
                      {p.signups}
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-[#16131F]">
                      {p.subs}
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-[#16131F] whitespace-nowrap">
                      {p.due.toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

