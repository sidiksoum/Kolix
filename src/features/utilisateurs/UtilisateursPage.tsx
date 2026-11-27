import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserCheck, 
  Plus, 
  Shield, 
  User, 
  X, 
  Check, 
  Lock, 
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { usersApi, CollaboratorDto } from '../../api/users.api';
import { useRealtime } from '../../context/RealtimeContext';
import { toast } from 'sonner';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  mods: string[] | 'all';
  status: 'Actif' | 'Suspendu' | 'Invitation envoyée';
  owner?: boolean;
}

const ALL_MODULES = [
  'Accueil', 
  'Boutique', 
  'Produits', 
  'Commandes', 
  'Stock', 
  'Comptabilité', 
  'Portefeuille', 
  'Client', 
  'WhatsApp Marketing', 
  'Analytics', 
  'Kolix AI', 
  'Paramètres'
];

const LOCKED_MODULES = ['WhatsApp Marketing'];

const ROLE_PRESETS: Record<string, string[]> = {
  'Gestionnaire de commandes': ['Accueil', 'Produits', 'Commandes', 'Stock', 'Client'],
  'Livreur': ['Commandes'],
  'Comptable': ['Comptabilité', 'Portefeuille', 'Analytics'],
  'Autre': []
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  'Propriétaire': { bg: '#241D5E', text: '#FFFFFF' },
  'Gestionnaire de commandes': { bg: '#EEE9FF', text: '#3F25A8' },
  'Livreur': { bg: '#FFF0D6', text: '#6B4100' },
  'Comptable': { bg: '#E3F4EC', text: '#1E5E3F' },
  'Autre': { bg: '#ECEAF3', text: '#3A3647' }
};

export const UtilisateursPage: React.FC = () => {
  const { subscribe } = useRealtime();
  const MAX_SEATS = 5;

  const [users, setUsers] = useState<Collaborator[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load collaborators from backend API
  const refreshUsers = useCallback(async (showSpinner = true) => {
    if (showSpinner) setIsLoadingList(true);
    try {
      const data = await usersApi.getCollaborators();
      if (Array.isArray(data)) {
        setUsers(data.map(c => ({
          id: String(c.id),
          name: c.name,
          role: c.role,
          phone: c.phone || '—',
          email: c.email || '—',
          mods: c.permissions?.includes('*') ? 'all' : (c.permissions || []),
          status: (c.status as any) || 'Actif',
          owner: !!c.is_owner
        })));
      }
    } catch {
      // Backend error fallback
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    refreshUsers(true);
  }, [refreshUsers]);

  // Écoute des mises à jour temps réel
  useEffect(() => {
    const unsubCollab = subscribe('COLLABORATOR_UPDATED', () => {
      refreshUsers(false);
    });
    return () => {
      unsubCollab();
    };
  }, [subscribe, refreshUsers]);

  // Drawer Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('Gestionnaire de commandes');
  const [formMods, setFormMods] = useState<string[]>(ROLE_PRESETS['Gestionnaire de commandes']);
  const [formSuspended, setFormSuspended] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirm Dialog State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const usedSeats = users.length;
  const isFull = usedSeats >= MAX_SEATS;

  const initials = (n: string) =>
    n
      .split(' ')
      .map(w => w.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const handleOpenAdd = () => {
    if (isFull) {
      toast.error('Limite d’utilisateurs atteinte sur le plan Grow. Passez à Pro pour débloquer les accès illimités.');
      return;
    }
    setEditingId(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormPassword('');
    setFormRole('Gestionnaire de commandes');
    setFormMods([...ROLE_PRESETS['Gestionnaire de commandes']]);
    setFormSuspended(false);
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (user: Collaborator) => {
    setEditingId(user.id);
    setFormName(user.name);
    setFormEmail(user.email !== '—' ? user.email : '');
    setFormPhone(user.phone !== '—' ? user.phone : '');
    setFormPassword('');
    setFormRole(user.role);
    setFormMods(user.mods === 'all' ? [...ALL_MODULES] : [...user.mods]);
    setFormSuspended(user.status === 'Suspendu');
    setFormError('');
    setFormOpen(true);
  };

  const handleRoleSelect = (role: string) => {
    setFormRole(role);
    if (role !== 'Autre') {
      setFormMods([...(ROLE_PRESETS[role] || [])]);
    }
  };

  const handleToggleModule = (mod: string) => {
    if (LOCKED_MODULES.includes(mod)) return;
    setFormMods(prev =>
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeMods = formMods.filter(m => !LOCKED_MODULES.includes(m));

    if (!formName.trim()) {
      setFormError('Veuillez renseigner le nom et prénom.');
      return;
    }
    if (!formEmail.trim() && !formPhone.trim()) {
      setFormError('Veuillez renseigner au moins une adresse email ou un numéro de téléphone.');
      return;
    }
    if (!editingId && (!formPassword.trim() || formPassword.trim().length < 4)) {
      setFormError('Veuillez définir un mot de passe d’au moins 4 caractères.');
      return;
    }
    if (activeMods.length === 0) {
      setFormError('Veuillez cocher au moins un module autorisé.');
      return;
    }

    const cleanName = formName.trim();
    const cleanEmail = formEmail.trim().toLowerCase() || `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString(36)}@kolix.shop`;
    const cleanPhone = formPhone.trim().replace(/\s+/g, '') || `07${Math.floor(10000000 + Math.random() * 90000000)}`;

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Backend update
        try {
          await usersApi.updateCollaborator(editingId, {
            name: cleanName,
            role: formRole,
            email: formEmail.trim() ? formEmail.trim().toLowerCase() : undefined,
            phone: formPhone.trim() ? formPhone.trim().replace(/\s+/g, '') : undefined,
            status: formSuspended ? 'Suspendu' : 'Actif',
            permissions: activeMods,
            password: formPassword.trim() || undefined
          });
        } catch {
          // Dev fallback
        }
        await refreshUsers();
        toast.success('Permissions et accès du collaborateur mis à jour.');
      } else {
        // Backend create
        const pwdToSave = formPassword.trim() || 'kolix2026!';
        try {
          await usersApi.addCollaborator({
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            role: formRole,
            permissions: activeMods,
            password: pwdToSave
          });
          toast.success(`Accès collaborateur créé pour ${cleanName} ! Mot de passe : ${pwdToSave}`);
        } catch (apiErr: any) {
          console.warn('addCollaborator backend error', apiErr);
          toast.error(apiErr.message || "Erreur de synchronisation backend");
        }

        await refreshUsers();
      }

      setFormOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l’enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTargetId) return;
    const target = users.find(u => u.id === deleteTargetId);
    try {
      await usersApi.deleteCollaborator(deleteTargetId);
      toast.success(`L'accès de ${target?.name || 'l’utilisateur'} a été supprimé.`);
    } catch {
      // Local fallback
    }
    await refreshUsers();
    setDeleteTargetId(null);
  };

  const targetUserToDelete = users.find(u => u.id === deleteTargetId);
  const activeModsCount = formMods.filter(m => !LOCKED_MODULES.includes(m)).length;

  if (isLoadingList && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#5E5A70]">Chargement des utilisateurs de votre boutique...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in font-sans">
      {/* Page Title & Add CTA */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Utilisateurs</h1>
          <p className="text-sm text-[#5E5A70] mt-1 font-medium">
            Donnez à vos collaborateurs (livreurs, gestionnaires, comptables) un accès sur mesure, module par module.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          disabled={isFull}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
            isFull
              ? 'bg-[#CFC7F2] text-white cursor-not-allowed'
              : 'bg-[#6C4CF1] text-white shadow-md shadow-[#6C4CF1]/25 hover:bg-[#5B3FD6] active:scale-95'
          }`}
        >
          <Plus className="w-4 h-4" />
          + Ajouter un collaborateur
        </button>
      </div>

      {/* Quotas & Plan Limits Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Seats used card */}
        <section className="md:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider">
              Places utilisées · Kolix Grow
            </span>
            <span className="text-2xl font-black text-[#3F25A8]">
              {usedSeats} / {MAX_SEATS}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: MAX_SEATS }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all ${
                  i < usedSeats ? 'bg-[#6C4CF1]' : 'bg-[#E2DCF8]'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-[#5E5A70]">
            {isFull
              ? 'Limite de 5 places atteinte. Passez à Pro pour des utilisateurs illimités.'
              : `${MAX_SEATS - usedSeats} place${MAX_SEATS - usedSeats > 1 ? 's' : ''} restante${MAX_SEATS - usedSeats > 1 ? 's' : ''} sur votre plan, propriétaire inclus.`}
          </p>
        </section>

        {/* Plan limits banner */}
        <section className="md:col-span-7 bg-[#EEE9FF] rounded-3xl p-5 sm:p-6 border border-[#E2DCFF] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 text-[#2E1F86]">
            <span className="font-extrabold text-sm block">Limites par forfait</span>
            <p className="text-xs text-[#2E1F86]/80 leading-relaxed">
              Start : 2 utilisateurs · Grow : 5 utilisateurs · Pro et Empire : accès illimités sans restriction.
            </p>
          </div>

          <a
            href="/parametres"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#3F25A8] rounded-xl text-xs sm:text-sm font-extrabold shadow-sm hover:bg-gray-50 active:scale-95 transition-all whitespace-nowrap"
          >
            Passer à Pro <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </section>
      </div>

      {/* Users Table */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[840px]">
            <thead>
              <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider border-b border-[#F0EDFB]">
                <th className="py-3.5 px-6 font-bold">Nom et prénom</th>
                <th className="py-3.5 px-4 font-bold">Fonction</th>
                <th className="py-3.5 px-4 font-bold">Contact</th>
                <th className="py-3.5 px-4 font-bold">Modules accessibles</th>
                <th className="py-3.5 px-4 font-bold">Statut d’accès</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {isLoadingList ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold text-[#5E5A70]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#6C4CF1]" />
                      Chargement des membres de l'équipe...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold text-[#5E5A70]">
                    Aucun utilisateur trouvé pour cette boutique.
                  </td>
                </tr>
              ) : (
                users.map(u => {
                const colorTone = ROLE_COLORS[u.role] || ROLE_COLORS['Autre'];
                const statusBadgeStyle = 
                  u.status === 'Actif'
                    ? 'bg-[#E3F4EC] text-[#1E5E3F]'
                    : u.status === 'Suspendu'
                    ? 'bg-[#FCE3E0] text-[#8A2414]'
                    : 'bg-[#FFF0D6] text-[#6B4100]';

                return (
                  <tr key={u.id} className="hover:bg-[#FAF9FE]/50 transition-colors">
                    {/* User Name & Initials Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span
                          style={{ backgroundColor: colorTone.bg, color: colorTone.text }}
                          className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow-xs"
                        >
                          {initials(u.name)}
                        </span>
                        <span className="font-extrabold text-[#16131F]">{u.name}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        style={{ backgroundColor: colorTone.bg, color: colorTone.text }}
                        className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg"
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 text-[#3A3647] text-xs whitespace-nowrap">
                      <div className="font-semibold">{u.phone}</div>
                      <div className="text-[11px] text-[#5E5A70]">{u.email}</div>
                    </td>

                    {/* Modules Allowed */}
                    <td className="py-4 px-4 max-w-[280px]">
                      <div className="flex flex-wrap gap-1.5">
                        {u.mods === 'all' ? (
                          <span className="text-[11px] font-extrabold bg-[#EEE9FF] text-[#3F25A8] rounded-md px-2 py-0.5">
                            Tous les modules
                          </span>
                        ) : (
                          u.mods.map(m => (
                            <span
                              key={m}
                              className="text-[11px] font-bold bg-[#F4F1FE] text-[#2E1F86] rounded-md px-2 py-0.5"
                            >
                              {m}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-lg ${statusBadgeStyle}`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {u.owner ? (
                        <span className="text-xs text-[#5E5A70] font-semibold italic">
                          Accès complet, non modifiable
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="px-3 py-1.5 bg-[#F4F1FE] text-[#3F25A8] hover:bg-[#EAE4FD] font-extrabold rounded-xl text-xs transition-colors"
                          >
                            Modifier l’accès
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(u.id)}
                            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-[#FAF9FE]/60 text-xs text-[#5E5A70]">
          Le module Utilisateurs reste strictement réservé au propriétaire du compte Kolix.
        </div>
      </section>

      {/* Slide-over Drawer / Modal: Add or Edit User */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-[#16131F]/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="text-xl font-extrabold text-[#16131F]">
                  {editingId ? 'Modifier l’accès' : 'Ajouter un collaborateur'}
                </h2>
                <button
                  onClick={() => setFormOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#F4F1FE] text-gray-500 hover:text-black flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-5">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5E5A70]">Nom et prénom *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Ex. Awa Koné, Ibrahim..."
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                  />
                </div>

                {/* Email de connexion */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-bold text-[#5E5A70]">Adresse e-mail de connexion *</label>
                    <span className="text-[10px] text-[#5E5A70]">Identifiant principal</span>
                  </div>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="ex: awa.kone@gmail.com"
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                  />
                  <p className="text-[11px] text-[#5E5A70]">
                    Le collaborateur utilisera cette adresse pour se connecter à son espace marchand.
                  </p>
                </div>

                {/* Téléphone WhatsApp */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-bold text-[#5E5A70]">Numéro de téléphone / WhatsApp</label>
                    <span className="text-[10px] text-[#5E5A70]">Optionnel</span>
                  </div>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="ex: 07 45 12 88 30"
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                  />
                  <p className="text-[11px] text-[#5E5A70]">
                    Permet aussi de se connecter avec son numéro de téléphone ou de coordonner les livraisons.
                  </p>
                </div>

                {/* Mot de passe de connexion */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-bold text-[#5E5A70]">
                      {editingId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe d’accès initial *'}
                    </label>
                    <span className="text-[10px] text-[#6C4CF1] font-bold">
                      Défini par le propriétaire
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder={editingId ? 'Laisser vide pour ne pas modifier' : 'Ex: MotDePasseSecurise2026!'}
                    required={!editingId}
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 font-mono"
                  />
                  <p className="text-[11px] text-[#5E5A70]">
                    {editingId
                      ? 'Renseignez un mot de passe uniquement si vous souhaitez réinitialiser l’accès du collaborateur.'
                      : 'Ce mot de passe permettra au collaborateur de se connecter directement à son espace marchand.'}
                  </p>
                </div>

                {/* Function / Role Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5E5A70]">Fonction du collaborateur</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(ROLE_PRESETS).map(r => {
                      const active = formRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleSelect(r)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                            active
                              ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF] font-extrabold shadow-xs'
                              : 'bg-white text-[#3A3647] border-[#E2DCF8] hover:bg-gray-50'
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#5E5A70]">
                    Choisir une fonction pré-coche automatiquement les modules habituels. Vous pouvez affiner ci-dessous.
                  </p>
                </div>

                {/* Permissions by module */}
                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-[#5E5A70]">Permissions par module</span>
                    <span className="text-xs font-extrabold text-[#6C4CF1]">
                      {activeModsCount} module{activeModsCount > 1 ? 's' : ''} autorisé{activeModsCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {ALL_MODULES.map(m => {
                      const isChecked = formMods.includes(m);
                      const isLocked = LOCKED_MODULES.includes(m);

                      return (
                        <label
                          key={m}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                            isLocked
                              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                              : isChecked
                              ? 'bg-[#F4F1FE] text-[#2E1F86] border-[#B9AAFF]'
                              : 'bg-white text-[#3A3647] border-[#E2DCF8] hover:border-gray-300 cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked && !isLocked}
                            disabled={isLocked}
                            onChange={() => handleToggleModule(m)}
                            className="w-4 h-4 rounded-md accent-[#6C4CF1]"
                          />
                          <span className="flex-1 truncate">{m}</span>
                          {isLocked && (
                            <span className="text-[9px] font-black bg-[#EEE9FF] text-[#3F25A8] px-1.5 py-0.5 rounded-full">
                              PRO
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Suspend Access switch (in Edit Mode) */}
                {editingId && (
                  <button
                    type="button"
                    onClick={() => setFormSuspended(!formSuspended)}
                    className="w-full text-left flex items-center justify-between p-3.5 bg-[#F8F6FF] rounded-2xl border border-gray-100"
                  >
                    <div>
                      <span className="font-extrabold text-xs text-[#16131F] block">Suspendre l’accès</span>
                      <span className="text-[11px] text-[#5E5A70] block">
                        Le collaborateur ne peut plus se connecter, sans perdre ses données.
                      </span>
                    </div>
                    <div
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                        formSuspended ? 'bg-[#A3202F] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </div>
                  </button>
                )}

                {formError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                    {formError}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-md shadow-[#6C4CF1]/25 hover:bg-[#5B3FD6] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enregistrement…</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Enregistrer les modifications' : 'Créer l’accès du collaborateur'}</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      {deleteTargetId && targetUserToDelete && (
        <div className="fixed inset-0 z-50 bg-[#16131F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#16131F]">
                Supprimer l’accès de {targetUserToDelete.name} ?
              </h3>
              <p className="text-xs text-[#5E5A70] mt-1 leading-relaxed">
                Ce collaborateur ne pourra plus se connecter à votre espace boutique. Les commandes et opérations qu’il a déjà enregistrées seront intégralement conservées.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="py-3 bg-[#F4F1FE] text-[#3F25A8] font-extrabold rounded-xl text-xs hover:bg-[#EEE9FF] transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="py-3 bg-[#A3202F] text-white font-extrabold rounded-xl text-xs hover:bg-red-700 transition-colors shadow-sm"
              >
                Supprimer l’accès
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
