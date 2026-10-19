import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { AccueilPage } from '../features/accueil/AccueilPage';
import { CommandesPage } from '../features/commandes/CommandesPage';
import { BoutiquePage } from '../features/boutique/BoutiquePage';
import { ProduitsPage } from '../features/produits/ProduitsPage';
import { StockPage } from '../features/stock/StockPage';
import { PortefeuillePage } from '../features/portefeuille/PortefeuillePage';
import { ComptabilitePage } from '../features/comptabilite/ComptabilitePage';
import { ClientsPage } from '../features/clients/ClientsPage';
import { WhatsAppMarketingPage } from '../features/whatsapp/WhatsAppMarketingPage';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { UtilisateursPage } from '../features/utilisateurs/UtilisateursPage';
import { ParametresPage } from '../features/parametres/ParametresPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AccueilPage />} />
        <Route path="commandes" element={<CommandesPage />} />
        <Route path="boutique" element={<BoutiquePage />} />
        <Route path="produits" element={<ProduitsPage />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="portefeuille" element={<PortefeuillePage />} />
        <Route path="comptabilite" element={<ComptabilitePage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="whatsapp" element={<WhatsAppMarketingPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="utilisateurs" element={<UtilisateursPage />} />
        <Route path="parametres" element={<ParametresPage />} />
        {/* Alias paths */}
        <Route path="ai" element={<AccueilPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
