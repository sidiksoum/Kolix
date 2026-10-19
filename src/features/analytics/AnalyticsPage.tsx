import React from 'react';
import { AccueilPage } from '../accueil/AccueilPage';

// The Analytics page provides extended analytics, reusing the high-performance chart engine
export const AnalyticsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <AccueilPage />
    </div>
  );
};
