import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const PWABanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-[#241D5E] text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#6C4CF1] flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-white" />
        </span>
        <div>
          <div className="font-extrabold text-sm">Installer l'application Kolix</div>
          <div className="text-xs text-[#D9D3F5]">Accédez plus rapidement à votre espace marchand hors ligne</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleInstall} className="text-xs font-bold px-3">
          Installer
        </Button>
        <button
          onClick={() => setShowBanner(false)}
          className="w-8 h-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
