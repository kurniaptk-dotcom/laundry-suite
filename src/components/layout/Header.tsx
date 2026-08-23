import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Building2, Store, Users, Bell, Search, Plus, 
  MessageSquare, Sparkles, ChevronDown, Check, ShieldCheck,
  User, Smartphone, ExternalLink, Activity, LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenNewOrder: () => void;
  onOpenWhatsApp: () => void;
}

const ROLE_LABELS: Record<UserRole, { title: string; badge: string; color: string }> = {
  super_admin: { title: 'Super Admin SaaS', badge: 'Platform SaaS', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  tenant_owner: { title: 'Owner (Pemilik Bisnis)', badge: 'Semua Akses', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  outlet_manager: { title: 'Manajer Outlet', badge: 'Operasional Cabang', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cashier: { title: 'Kasir / Front Office', badge: 'POS & Kas', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  production_staff: { title: 'Staff Produksi (Cuci/Setrika)', badge: 'Kanban Produksi', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  qc_staff: { title: 'Staff Quality Control (QC)', badge: 'QC & Rewash', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  courier: { title: 'Kurir / Driver PWA', badge: 'Pickup & Delivery', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  finance: { title: 'Finance & Accounting', badge: 'Keuangan & ERP', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  hr: { title: 'HR & Payroll', badge: 'SDM & Penggajian', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  customer: { title: 'Customer Portal (PWA)', badge: 'Pelanggan Akhir', color: 'bg-violet-100 text-violet-700 border-violet-200' },
};

export const Header: React.FC<HeaderProps> = ({ onOpenNewOrder, onOpenWhatsApp }) => {
  const { 
    currentRole, setCurrentRole, logout,
    tenants, currentTenant, setCurrentTenant,
    outlets, currentOutlet, setCurrentOutlet,
    whatsappMessages
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showOutletMenu, setShowOutletMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tenantOutlets = outlets.filter(o => o.tenantId === currentTenant.id);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200/80 shadow-subtle">
      {/* Left side: Context selectors */}
      <div className="flex items-center gap-3">
        {/* Tenant Badge (Locked to Owner's own tenant) */}
        {currentRole !== 'super_admin' && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="max-w-[150px] truncate">{currentTenant.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-brand-100 text-brand-700 font-extrabold uppercase tracking-wider">
              {currentTenant.plan}
            </span>
          </div>
        )}

        {/* Super Admin Tenant Switcher (Super Admin only) */}
        {currentRole === 'super_admin' && (
          <div className="relative">
            <button
              onClick={() => setShowTenantMenu(!showTenantMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold text-purple-800 transition"
              title="Kelola Tenant SaaS"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span className="max-w-[140px] truncate">Tenant: {currentTenant.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-500" />
            </button>

            {showTenantMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Daftar Semua Tenant SaaS
                </div>
                {tenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTenant(t);
                      const matchingOutlets = outlets.filter(o => o.tenantId === t.id);
                      if (matchingOutlets.length > 0) setCurrentOutlet(matchingOutlets[0]);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      currentTenant.id === t.id ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.outletsCount} Cabang • Paket {t.plan.toUpperCase()}</div>
                    </div>
                    {currentTenant.id === t.id && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Outlet / Branch Selector (Owner can switch between their own branches or view All Outlets) */}
        {currentRole !== 'super_admin' && currentRole !== 'customer' && (
          <div className="relative">
            <button
              onClick={() => setShowOutletMenu(!showOutletMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
              title="Ganti Cabang / Outlet"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[150px] truncate">{currentOutlet.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showOutletMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Cabang Aktif
                </div>

                {/* All Outlets Option */}
                <button
                  onClick={() => {
                    setCurrentOutlet({
                      id: 'all',
                      tenantId: currentTenant.id,
                      name: 'Semua Cabang (All Outlets)',
                      code: 'ALL-OUTLETS',
                      address: 'Seluruh Wilayah Operasional',
                      city: 'Konsolidasi',
                      phone: currentTenant.ownerPhone,
                      isMain: true,
                      operationalHours: '24 Jam Terpadu',
                      services: outlets[0]?.services || []
                    });
                    setShowOutletMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    currentOutlet.id === 'all' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>🌐</span>
                      <span>Semua Cabang (All Outlets)</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Konsolidasi Multi-Cabang ({tenantOutlets.length} Outlet)</div>
                  </div>
                  {currentOutlet.id === 'all' && <Check className="w-4 h-4 text-emerald-600" />}
                </button>

                <div className="my-1 border-t border-slate-100" />

                {tenantOutlets.map(o => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setCurrentOutlet(o);
                      setShowOutletMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      currentOutlet.id === o.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{o.name}</div>
                      <div className="text-[10px] text-slate-500">{o.city} • #{o.code}</div>
                    </div>
                    {currentOutlet.id === o.id && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative ml-2">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari order, nota, nama customer, atau telp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72 pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Right side: Actions, WhatsApp Business, Role Switcher, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Action: New Order POS */}
        {currentRole !== 'customer' && currentRole !== 'super_admin' && (
          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Order POS</span>
          </button>
        )}

        {/* WhatsApp Business API Integration Status & Drawer */}
        <button
          onClick={onOpenWhatsApp}
          className="relative flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition shadow-2xs"
          title="WhatsApp Business API Management & Notification Log"
        >
          <div className="relative">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse"></span>
          </div>
          <span className="hidden sm:inline">WhatsApp Business</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-200/80 text-emerald-900 font-extrabold">
            ● Connected
          </span>
        </button>

        {/* Role Persona Switcher Button (Demo Multi-Role Persona) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition ${ROLE_LABELS[currentRole].color}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <div className="text-left">
              <span className="hidden lg:inline text-[10px] block opacity-70">Persona Role:</span>
              <span className="font-bold">{ROLE_LABELS[currentRole].title}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-800">Simulasi Ganti Role Persona</div>
                <div className="text-[11px] text-slate-500">Uji coba tampilan & hak akses per peran pengguna</div>
              </div>
              <div className="py-1 max-h-[380px] overflow-y-auto space-y-0.5">
                {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition ${
                      currentRole === role ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{ROLE_LABELS[role].title}</div>
                      <div className="text-[10px] text-slate-400">{ROLE_LABELS[role].badge}</div>
                    </div>
                    {currentRole === role && <Check className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-xs font-semibold text-slate-600 transition"
          title="Keluar / Ganti Akun"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
