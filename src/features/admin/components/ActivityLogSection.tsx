// src/features/admin/components/ActivityLogSection.tsx
import React from 'react';
import { ActivityLogItem } from '../types';

interface ActivityLogSectionProps {
  logs: ActivityLogItem[];
}

export const ActivityLogSection: React.FC<ActivityLogSectionProps> = ({ logs }) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Journal d’activité</h1>
        <p className="text-sm text-[#5E5A70] mt-1 font-medium">
          Toutes les actions des administrateurs, pour la traçabilité.
        </p>
      </div>

      <section className="bg-white rounded-[18px] p-6 shadow-sm border border-[#EEEAFB] flex flex-col">
        {logs.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#8B869C] font-semibold">
            Aucune action consignée pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-[#F0EDFB]">
            {logs.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-3.5 text-sm">
                <span className="w-28 shrink-0 text-xs text-[#5E5A70] font-semibold">
                  {item.when}
                </span>
                <span className="flex-1 text-[#16131F]">
                  <strong className="font-bold text-[#241D5E]">{item.who}</strong> {item.what}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

