import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { KolixAIWidget } from './KolixAIWidget';
import { PWABanner } from './PWABanner';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F1FE] text-[#16131F] font-sans">
      {/* PWA Prompt */}
      <PWABanner />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#16131F]/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar - Fixe & scrollable de manière indépendante */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area - Scrollable de manière indépendante */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-16 lg:pb-0">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto box-border">
          <Outlet />
        </main>
      </div>

      {/* Native-style Mobile Nav */}
      <MobileNav />

      {/* Floating Kolix AI Widget */}
      <KolixAIWidget />
    </div>
  );
};
