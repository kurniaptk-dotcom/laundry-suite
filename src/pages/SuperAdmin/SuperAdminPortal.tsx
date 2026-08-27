import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tenant, PlanType } from '../../types';
import { 
  Shield, Building2, DollarSign, Users, 
  TrendingUp, Plus, Check, Star, Sparkles, 
  ArrowUpRight, AlertCircle, RefreshCw, Activity,
  Server, Database, Lock, CreditCard, MessageSquare,
  Zap, PieChart, Layers, Clock, AlertTriangle,
  UserCheck, ExternalLink, Eye, ArrowRight, X,
  Radio, HardDrive, CheckCircle2, Sliders, BarChart3,
  Flame, HelpCircle, Phone, Send, Search, Filter
} from 'lucide-react';

export type AdminTabType = 
  | 'overview' 
  | 'tenants' 
  | 'subscriptions' 
  | 'billing' 
  | 'usage' 
  | 'adoption' 
  | 'at_risk' 
  | 'health' 
  | 'support';

interface SuperAdminPortalProps {
  activeTab?: AdminTabType;
  onTabChange?: (tab: AdminTabType) => void;
}

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({ 
  activeTab: controlledTab, 
  onTabChange 
}) => {
  const { 
    tenants, createTenant, updateTenantPlan, 
    impersonateTenant 
  } = useApp();

  // Active SaaS Admin Sub-Module
  const [internalTab, setInternalTab] = useState<AdminTabType>('overview');

  const adminTab = controlledTab || internalTab;
  const setAdminTab = (tab: AdminTabType) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  // Tenant Modal & Drawer State
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [selectedTenantDetail, setSelectedTenantDetail] = useState<Tenant | null>(null);
  const [tenantDrawerTab, setTenantDrawerTab] = useState<
    'overview' | 'users' | 'outlets' | 'usage' | 'subscription' | 'billing' | 'activity' | 'support'
  >('overview');

  // Search & Filter in Tenants table
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantPlanFilter, setTenantPlanFilter] = useState<string>('all');
  const [tenantStatusFilter, setTenantStatusFilter] = useState<string>('all');

  // New Tenant Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [plan, setPlan] = useState<PlanType>('growth');

  // Extended SaaS Platform Multi-Tenant Mock Data
  const EXTENDED_TENANTS = [
    { id: 't-1', name: 'Laundry Bersih Jaya', code: 'LBJ', plan: 'growth' as PlanType, status: 'active' as const, mrr: 499000, outletsCount: 3, ownerName: 'Hendra Gunawan', ownerEmail: 'owner@bersihjaya.id', ownerPhone: '081234567890', createdAt: '2025-01-10', ordersCount: 8421, activeUsers: 21, lastActive: '5 menit lalu', healthScore: '98%' },
    { id: 't-2', name: 'CleanFast Premium Laundry', code: 'CFP', plan: 'business' as PlanType, status: 'active' as const, mrr: 1299000, outletsCount: 6, ownerName: 'Jessica Suryanto', ownerEmail: 'jessica@cleanfast.co.id', ownerPhone: '081198765432', createdAt: '2024-11-05', ordersCount: 18421, activeUsers: 48, lastActive: '12 menit lalu', healthScore: '99%' },
    { id: 't-3', name: 'FreshKlin Kiloan Express', code: 'FKE', plan: 'starter' as PlanType, status: 'active' as const, mrr: 199000, outletsCount: 1, ownerName: 'Ahmad Fauzi', ownerEmail: 'ahmad@freshklin.com', ownerPhone: '085712349988', createdAt: '2025-03-01', ordersCount: 1240, activeUsers: 4, lastActive: '1 jam lalu', healthScore: '94%' },
    { id: 't-4', name: 'SuperWash Laundry Mart', code: 'SWM', plan: 'business' as PlanType, status: 'active' as const, mrr: 1299000, outletsCount: 8, ownerName: 'David Pratama', ownerEmail: 'david@superwash.id', ownerPhone: '081399887711', createdAt: '2024-09-12', ordersCount: 24190, activeUsers: 64, lastActive: '2 menit lalu', healthScore: '99%' },
    { id: 't-5', name: 'Klinik Cuci Sepatu & Tas', code: 'KCS', plan: 'starter' as PlanType, status: 'trial' as const, mrr: 0, outletsCount: 1, ownerName: 'Rian Hidayat', ownerEmail: 'rian@klinikcuci.id', ownerPhone: '081244556677', createdAt: '2026-08-15', ordersCount: 180, activeUsers: 2, lastActive: '3 jam lalu', healthScore: '89%' },
    { id: 't-6', name: 'Laundry Sejahtera Abadi', code: 'LSA', plan: 'growth' as PlanType, status: 'past_due' as const, mrr: 499000, outletsCount: 2, ownerName: 'Budi Wicaksono', ownerEmail: 'budi@sejahtera.id', ownerPhone: '085611223399', createdAt: '2025-04-18', ordersCount: 3410, activeUsers: 8, lastActive: '9 hari lalu', healthScore: '42%' },
    { id: 't-7', name: 'Diva Dry Cleaning & Care', code: 'DDC', plan: 'growth' as PlanType, status: 'suspended' as const, mrr: 499000, outletsCount: 3, ownerName: 'Siti Maryam', ownerEmail: 'siti@divadry.id', ownerPhone: '087811990022', createdAt: '2025-02-20', ordersCount: 920, activeUsers: 0, lastActive: '21 hari lalu', healthScore: '15%' },
  ];

  const allTenantsList = [
    ...tenants.map(t => ({
      ...t,
      ordersCount: 0,
      activeUsers: 1,
      lastActive: 'Baru saja',
      healthScore: '100%'
    })),
    ...EXTENDED_TENANTS.filter(et => !tenants.some(t => t.id === et.id || t.code === et.code))
  ];

  // Filtered Tenants
  const filteredTenants = allTenantsList.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.code.toLowerCase().includes(tenantSearch.toLowerCase());
    const matchPlan = tenantPlanFilter === 'all' || t.plan === tenantPlanFilter;
    const matchStatus = tenantStatusFilter === 'all' || t.status === tenantStatusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName) return;

    createTenant({
      name,
      code: code.toUpperCase() || name.slice(0, 3).toUpperCase(),
      plan,
      status: 'active',
      mrr: plan === 'starter' ? 199000 : plan === 'growth' ? 499000 : 1299000,
      ownerName,
      ownerEmail: ownerEmail || 'owner@laundry.id',
      ownerPhone: ownerPhone || '08123456789',
    });

    setShowAddTenantModal(false);
    setName('');
    setCode('');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPhone('');
    alert(`Tenant "${name}" berhasil didaftarkan di Laundry Suite Platform!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* SaaS Admin Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#130E2E] to-[#2E1065] p-7 md:p-8 text-white shadow-2xl border border-purple-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[11px] font-extrabold tracking-wide uppercase">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Laundry Suite Platform Admin</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Microservices Operational</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Platform Health & Business Command Center
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              Memantau pertumbuhan MRR, metrik aktivasi tenant, pemakaian sistem (Usage & Analytics), status penagihan billing, dan kesehatan infrastruktur SaaS Laundry Suite.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddTenantModal(true)}
              className="px-5 py-3 bg-white hover:bg-purple-50 text-purple-950 text-xs font-black rounded-2xl shadow-xl shadow-black/20 hover:shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-purple-700" />
              <span>+ Tambah Tenant Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* SaaS Admin Sub-Navigation Hub */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto">
        {[
          { key: 'overview', label: '📊 Platform Overview', icon: PieChart },
          { key: 'tenants', label: `🏢 Tenants (${allTenantsList.length})`, icon: Building2 },
          { key: 'subscriptions', label: '💳 Subscriptions & MRR', icon: CreditCard },
          { key: 'billing', label: '💸 Billing & Invoices', icon: DollarSign },
          { key: 'usage', label: '📈 Usage & Analytics', icon: Activity },
          { key: 'adoption', label: '🎯 Feature Adoption', icon: Layers },
          { key: 'at_risk', label: '⚠️ At-Risk / Churn Prevention', icon: AlertTriangle },
          { key: 'health', label: '⚡ System Health', icon: Server },
          { key: 'support', label: '🎧 Support Desk (12)', icon: HelpCircle },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setAdminTab(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shrink-0 ${
              adminTab === tab.key
                ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>


      {/* ======================================================== */}
      {/* 1. VIEW: PLATFORM OVERVIEW (SAAS METRICS)               */}
      {/* ======================================================== */}
      {adminTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Primary SaaS North-Star Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* MRR */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Recurring Revenue</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">MRR</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                Rp 128.500.000
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.4% vs bulan lalu</span>
              </div>
            </div>

            {/* ARR */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Run Rate</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">ARR</span>
              </div>
              <div className="text-2xl font-black text-blue-900 mt-2">
                Rp 1.542.000.000
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Proyeksi tahunan terdiskon</div>
            </div>

            {/* Active Tenants */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total & Active Tenants</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">91.3% Active</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                391 <span className="text-sm font-semibold text-slate-400">/ 428 Tenant</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">
                +32 Tenant Baru Bulan Ini
              </div>
            </div>

            {/* Churn & ARPU */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Churn Rate & ARPU</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">SaaS Health</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                2.1% <span className="text-xs font-semibold text-slate-400">Churn</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                ARPU: <strong>Rp 302.000</strong> / tenant / bln
              </div>
            </div>

          </div>

          {/* Attention Required Action Box (Command Center Principle) */}
          <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>⚠️ Attention Required (Tindakan Diperlukan Hari Ini)</span>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                4 Isu Terdeteksi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Gagal Bayar Langganan:</span>
                  <span className="font-black text-rose-600 text-sm">7 Subscriptions</span>
                </div>
                <button 
                  onClick={() => setAdminTab('billing')}
                  className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg text-[10px] hover:bg-rose-100"
                >
                  Resolve ➔
                </button>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Masa Trial Berakhir (48 Jam):</span>
                  <span className="font-black text-amber-900 text-sm">12 Tenant</span>
                </div>
                <button 
                  onClick={() => alert('Broadcast WhatsApp promo upgrade paket terkirim ke 12 tenant!')}
                  className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-lg text-[10px] hover:bg-amber-100"
                >
                  Follow-up WA
                </button>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Tiket Bantuan Mendesak:</span>
                  <span className="font-black text-purple-900 text-sm">2 Urgent Tickets</span>
                </div>
                <button 
                  onClick={() => setAdminTab('support')}
                  className="px-2.5 py-1 bg-purple-50 text-purple-800 font-bold rounded-lg text-[10px] hover:bg-purple-100"
                >
                  Buka Desk
                </button>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">System Incidents:</span>
                  <span className="font-black text-emerald-600 text-sm">0 Incidents (100% Up)</span>
                </div>
                <button 
                  onClick={() => setAdminTab('health')}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[10px] hover:bg-emerald-100"
                >
                  Live Health
                </button>
              </div>
            </div>
          </div>

          {/* SaaS Charts: Revenue Growth, Subscription Mix & Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* MRR Growth Trend (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-sm text-slate-900">Pertumbuhan MRR & Tenant (Jan - Jul 2026)</h3>
                  <p className="text-xs text-slate-400">Pertumbuhan pendapatan berulang bersih bulanan (Net MRR Growth)</p>
                </div>
                <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  +157% YTD
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { month: 'Jan 2026', mrr: 'Rp 50.0M', tenants: 120, pct: 39 },
                  { month: 'Feb 2026', mrr: 'Rp 70.2M', tenants: 154, pct: 54 },
                  { month: 'Mar 2026', mrr: 'Rp 85.4M', tenants: 198, pct: 66 },
                  { month: 'Apr 2026', mrr: 'Rp 103.1M', tenants: 241, pct: 80 },
                  { month: 'Mei 2026', mrr: 'Rp 114.0M', tenants: 301, pct: 88 },
                  { month: 'Jun 2026', mrr: 'Rp 121.2M', tenants: 356, pct: 94 },
                  { month: 'Jul 2026', mrr: 'Rp 128.5M', tenants: 428, pct: 100 },
                ].map(m => (
                  <div key={m.month} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{m.month} • {m.tenants} Tenants</span>
                      <span className="font-mono text-purple-900">{m.mrr}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full" style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Mix & Revenue Breakdown (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-sm text-slate-900">Subscription Mix & Revenue by Plan</h3>
                <p className="text-xs text-slate-400">Komposisi paket berlangganan dan kontribusi omzet</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-black text-blue-950">
                    <span>GROWTH (Rp 499k / bln)</span>
                    <span>151 Tenants (35%)</span>
                  </div>
                  <div className="text-[11px] text-blue-800 flex justify-between font-bold">
                    <span>Kontribusi MRR: Rp 75.350.000</span>
                    <span>58.6% of MRR</span>
                  </div>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '58.6%' }} />
                  </div>
                </div>

                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-black text-purple-950">
                    <span>BUSINESS (Rp 1.299k / bln)</span>
                    <span>67 Tenants (16%)</span>
                  </div>
                  <div className="text-[11px] text-purple-800 flex justify-between font-bold">
                    <span>Kontribusi MRR: Rp 87.033.000</span>
                    <span>67.7% of MRR</span>
                  </div>
                  <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '67.7%' }} />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-black text-slate-900">
                    <span>STARTER (Rp 199k / bln)</span>
                    <span>210 Tenants (49%)</span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between font-bold">
                    <span>Kontribusi MRR: Rp 41.790.000</span>
                    <span>32.5% of MRR</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-600 h-full rounded-full" style={{ width: '32.5%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Customer Lifecycle Funnel & Activation Metric */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-slate-900">Customer Lifecycle Funnel & Activation Rate</h3>
                <p className="text-xs text-slate-400">Konversi dari Sign-up ➔ Trial ➔ Activated (7-Day Metric) ➔ Paid ➔ Retained</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Activation Rate:</span>
                <span className="text-base font-black text-emerald-600 ml-1.5 font-mono">72.4% (↑ 8.2%)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
              {[
                { step: '1. Signups', count: '1,200', desc: 'Pengunjung mendaftar', rate: '100%' },
                { step: '2. Started Trial', count: '780', desc: 'Setup outlet & menu', rate: '65.0%' },
                { step: '3. Activated', count: '540', desc: 'Memproses order pertama', rate: '69.2%' },
                { step: '4. Paid Subscribed', count: '320', desc: 'Bayar paket bulanan', rate: '59.2%' },
                { step: '5. Retained (>3 Mo)', count: '295', desc: 'Pelanggan loyal jangka panjang', rate: '92.1%' },
              ].map((fn, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 relative">
                  <div className="text-[10px] font-bold text-purple-700 uppercase">{fn.step}</div>
                  <div className="text-xl font-black text-slate-900 font-mono">{fn.count}</div>
                  <div className="text-[10px] text-slate-400">{fn.desc}</div>
                  <div className="text-[10px] font-bold text-emerald-600 pt-1">Conv: {fn.rate}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}


      {/* ======================================================== */}
      {/* 2. VIEW: TENANTS MANAGEMENT & DETAIL DRAWER             */}
      {/* ======================================================== */}
      {adminTab === 'tenants' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-700" />
                Manajemen Tenant Laundry Suite ({allTenantsList.length} Terdaftar)
              </h2>
              <p className="text-xs text-slate-500">
                Audit data tenant, aktivasi paket lisensi, inspect performa outlet, dan support impersonation.
              </p>
            </div>
            <button
              onClick={() => setShowAddTenantModal(true)}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Tenant Baru</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama tenant, pemilik, kode..."
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <select
                value={tenantPlanFilter}
                onChange={(e) => setTenantPlanFilter(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
              >
                <option value="all">Semua Paket</option>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="business">Business</option>
              </select>

              <select
                value={tenantStatusFilter}
                onChange={(e) => setTenantStatusFilter(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="past_due">Past Due</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Tenant / Bisnis</th>
                  <th className="py-3 px-4">Paket Plan</th>
                  <th className="py-3 px-4">Cabang</th>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Total Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">MRR</th>
                  <th className="py-3 px-4 text-center">Aksi Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.ownerName} ({t.ownerPhone}) • #{t.code}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        t.plan === 'business' ? 'bg-purple-100 text-purple-800' :
                        t.plan === 'growth' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{t.outletsCount} Cabang</td>
                    <td className="py-3.5 px-4 text-slate-600">{t.activeUsers} User</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{t.ordersCount.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        t.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'trial' ? 'bg-amber-100 text-amber-800' :
                        t.status === 'past_due' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-purple-900 font-mono">
                      Rp {t.mrr.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedTenantDetail(t as any);
                            setTenantDrawerTab('overview');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold"
                          title="Lihat Rincian Detail Tenant"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => {
                            impersonateTenant(t.id);
                          }}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-bold border border-purple-200 flex items-center gap-1"
                          title="Login sebagai Tenant (Support Impersonation Mode)"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Login As</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 3. VIEW: FEATURE ADOPTION & PLATFORM USAGE              */}
      {/* ======================================================== */}
      {(adminTab === 'usage' || adminTab === 'adoption') && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Usage Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-bold block">Total Orders Processed</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">1,284,421</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">Platform All-Time</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-bold block">Active Laundry Customers</span>
              <div className="text-2xl font-black text-brand-700 mt-1 font-mono">284,521</div>
              <div className="text-[11px] text-slate-500 mt-1">Di seluruh Indonesia</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-bold block">Bag QR Scans Performed</span>
              <div className="text-2xl font-black text-purple-700 mt-1 font-mono">932,421</div>
              <div className="text-[11px] text-purple-600 font-bold mt-1">Stasiun Produksi Aktif</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-bold block">WhatsApp Notifications Sent</span>
              <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">2,841,920</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">99.8% Delivered</div>
            </div>
          </div>

          {/* Feature Adoption Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Feature Adoption Across 428 Tenants</h3>
              <p className="text-xs text-slate-400">Persentase tenant yang aktif menggunakan modul sistem setiap minggunya</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                { feature: '🛒 POS Kasir & Transaksi', pct: 94, status: 'High Adoption' },
                { feature: '🧺 Kanban Produksi & Stasiun Cuci', pct: 91, status: 'High Adoption' },
                { feature: '📱 WhatsApp Notification Gateway', pct: 71, status: 'Strong' },
                { feature: '👥 CRM, Deposit & Loyalty Points', pct: 63, status: 'Good' },
                { feature: '🚚 Dispatch Antar Jemput Kurir (PWA)', pct: 48, status: 'Growing' },
                { feature: '🏆 Membership Tiers & Vouchers', pct: 42, status: 'Growing' },
                { feature: '📦 Stok Bahan Baku & Alert Minimum', pct: 38, status: 'Moderate' },
                { feature: '💼 Payroll & Slip Gaji Komisi', pct: 21, status: 'Needs Education' },
                { feature: '📊 Keuangan ERP & COA Akuntansi', pct: 14, status: 'Opportunity' },
              ].map(f => (
                <div key={f.feature} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-extrabold text-slate-800">
                    <span>{f.feature}</span>
                    <span className="font-mono text-purple-900">{f.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        f.pct >= 70 ? 'bg-emerald-600' : f.pct >= 40 ? 'bg-blue-600' : 'bg-amber-500'
                      }`} 
                      style={{ width: `${f.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 4. VIEW: AT-RISK & CHURN PREVENTION COMMAND CENTER       */}
      {/* ======================================================== */}
      {adminTab === 'at_risk' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Tenant At-Risk & Churn Prevention Command Center
            </h2>
            <p className="text-xs text-slate-500">
              Deteksi dini tenant dengan penurunan pemakaian (&gt;50%), tidak aktif lebih dari 7 hari, atau kendala pembayaran kartu kredit/debit.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Laundry Sejahtera Abadi', owner: 'Budi Wicaksono (085611223399)', reason: 'Tidak aktif 9 hari berturut-turut • Penurunan order 72%', plan: 'Growth', status: 'Payment Past Due' },
              { name: 'Diva Dry Cleaning & Care', owner: 'Siti Maryam (087811990022)', reason: 'Gagal auto-debit kartu 3x • Akun pending suspend', plan: 'Growth', status: 'Suspended' },
              { name: 'Klinik Cuci Sepatu & Tas', owner: 'Rian Hidayat (081244556677)', reason: 'Trial berakhir dalam 24 jam belum upgrade paket', plan: 'Starter Trial', status: 'Trial Ending' },
            ].map((risk, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{risk.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                      {risk.status}
                    </span>
                  </div>
                  <div className="text-slate-600 mt-1">{risk.owner} • Paket: <strong>{risk.plan}</strong></div>
                  <p className="text-rose-700 font-semibold mt-0.5">⚠️ {risk.reason}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => alert(`Membuka WhatsApp ke ${risk.owner} dengan template retensi diskon 20%!`)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hubungi WA</span>
                  </button>
                  <button 
                    onClick={() => alert(`Kupon diskon retensi 20% berhasil dikirim ke akun ${risk.name}!`)}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl"
                  >
                    Beri Diskon Retensi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 5. VIEW: SYSTEM HEALTH MONITORING                        */}
      {/* ======================================================== */}
      {adminTab === 'health' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { service: 'API Gateway & REST Routes', status: 'Operational', latency: '38ms', uptime: '99.99%', icon: Server },
              { service: 'PostgreSQL Multi-Tenant DB', status: 'Operational', latency: '12ms', uptime: '100.0%', icon: Database },
              { service: 'Authentication & JWT Auth', status: 'Operational', latency: '18ms', uptime: '99.98%', icon: Lock },
              { service: 'Payment Gateway (Midtrans/QRIS)', status: 'Operational', latency: '120ms', uptime: '99.95%', icon: CreditCard },
              { service: 'WhatsApp Cloud API Gateway', status: 'Operational', latency: '240ms', uptime: '99.92%', icon: MessageSquare },
              { service: 'Redis Background Jobs & Cron', status: 'Operational', latency: '4ms', uptime: '100.0%', icon: Zap },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.service} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{s.status}</span>
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{s.service}</h4>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                      <span>Response: <strong>{s.latency}</strong></span>
                      <span>Uptime: <strong>{s.uptime}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Midtrans SaaS Payment Gateway Configuration */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Konfigurasi Midtrans Payment Gateway</h3>
                  <p className="text-[11px] text-slate-400">Pengaturan API Key Snap Checkout untuk penerimaan pembayaran langganan SaaS</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                Snap API Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Midtrans Client Key</label>
                <input
                  type="text"
                  defaultValue={localStorage.getItem('midtrans_client_key') || 'SB-Mid-client-DEMO-SAMPLE'}
                  onChange={(e) => localStorage.setItem('midtrans_client_key', e.target.value)}
                  placeholder="SB-Mid-client-xxxx..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Midtrans Server Key</label>
                <input
                  type="password"
                  defaultValue={localStorage.getItem('midtrans_server_key') || 'SB-Mid-server-••••••••'}
                  onChange={(e) => localStorage.setItem('midtrans_server_key', e.target.value)}
                  placeholder="SB-Mid-server-xxxx..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mode Environment</label>
                <select
                  defaultValue={localStorage.getItem('midtrans_is_production') === 'true' ? 'production' : 'sandbox'}
                  onChange={(e) => {
                    localStorage.setItem('midtrans_is_production', e.target.value === 'production' ? 'true' : 'false');
                    alert(`Mode Midtrans berhasil diubah ke: ${e.target.value.toUpperCase()}`);
                  }}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="sandbox">🛠️ Sandbox / Testing</option>
                  <option value="production">🚀 Production (Live Payments)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>💳 Saluran Aktif: <strong>QRIS (GoPay, ShopeePay), BCA VA, Mandiri Bill, BNI/BRI VA, Kartu Kredit 3DS</strong></span>
              <a 
                href="https://dashboard.midtrans.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Buka Dashboard Midtrans ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. VIEW: SUPPORT DESK & TICKETS                          */}
      {/* ======================================================== */}
      {adminTab === 'support' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-700" />
                Customer Support Desk & Ticket Queue
              </h2>
              <p className="text-xs text-slate-400">12 Tiket Menunggu Respon • 2 Tiket Kategori Urgent</p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              18 Tiket Selesai Hari Ini
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { id: 'TCK-401', tenant: 'Laundry Bersih Jaya', issue: 'Integrasi printer thermal bluetooth 58mm di tablet Android', cat: 'POS Hardware', priority: 'Normal', time: '10 menit lalu' },
              { id: 'TCK-402', tenant: 'CleanFast Premium', issue: 'Request penambahan kuota 2 cabang baru untuk paket Business', cat: 'Subscription', priority: 'Urgent', time: '25 menit lalu' },
              { id: 'TCK-403', tenant: 'FreshKlin Express', issue: 'Template pesan WhatsApp kustom untuk promo akhir pekan', cat: 'WhatsApp API', priority: 'Normal', time: '1 jam lalu' },
            ].map(tck => (
              <div key={tck.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-900">#{tck.id}</span>
                    <span className="font-black text-slate-900">{tck.tenant}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      tck.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tck.priority}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold mt-1">"{tck.issue}"</p>
                  <div className="text-[10px] text-slate-400 mt-0.5">Kategori: {tck.cat} • Dilaporkan: {tck.time}</div>
                </div>

                <button 
                  onClick={() => alert(`Membuka live ticket chat dengan admin ${tck.tenant}!`)}
                  className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-sm shrink-0"
                >
                  Jawab Tiket
                </button>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* DRAWER / MODAL: TENANT DETAIL (8 TABS)                  */}
      {/* ======================================================== */}
      {selectedTenantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-950 to-purple-950 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black">{selectedTenantDetail.name}</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/30 uppercase border border-purple-400/30">
                    Paket {selectedTenantDetail.plan}
                  </span>
                </div>
                <p className="text-xs text-purple-200 mt-0.5">
                  Pemilik: {selectedTenantDetail.ownerName} ({selectedTenantDetail.ownerPhone}) • ID: #{selectedTenantDetail.code}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const tid = selectedTenantDetail.id;
                    setSelectedTenantDetail(null);
                    impersonateTenant(tid);
                  }}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-md transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Login As Tenant</span>
                </button>

                <button 
                  onClick={() => setSelectedTenantDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100 bg-slate-50 text-xs overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'outlets', label: 'Outlets (Cabang)' },
                { key: 'usage', label: 'Usage & Orders' },
                { key: 'subscription', label: 'Subscription Plan' },
                { key: 'billing', label: 'Billing Invoices' },
              ].map(dTab => (
                <button
                  key={dTab.key}
                  onClick={() => setTenantDrawerTab(dTab.key as any)}
                  className={`pb-3 px-3 font-extrabold transition border-b-2 ${
                    tenantDrawerTab === dTab.key
                      ? 'border-purple-700 text-purple-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {dTab.label}
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {tenantDrawerTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">Status Lisensi:</span>
                      <span className="font-black text-emerald-700 uppercase">ACTIVE</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">MRR Bulanan:</span>
                      <span className="font-black text-purple-900 font-mono">Rp {selectedTenantDetail.mrr.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">Total Cabang:</span>
                      <span className="font-black text-slate-900">{selectedTenantDetail.outletsCount} Outlet</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">Bergabung Sejak:</span>
                      <span className="font-bold text-slate-700">{selectedTenantDetail.createdAt}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                    <div className="font-bold text-purple-950">Ganti Paket Langganan Tenant:</div>
                    <div className="flex gap-2">
                      {(['starter', 'growth', 'business'] as PlanType[]).map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            updateTenantPlan(selectedTenantDetail.id, p);
                            setSelectedTenantDetail({ ...selectedTenantDetail, plan: p });
                            alert(`Paket ${selectedTenantDetail.name} berhasil diubah ke ${p.toUpperCase()}!`);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs ${
                            selectedTenantDetail.plan === p
                              ? 'bg-purple-700 text-white'
                              : 'bg-white text-slate-700 border border-slate-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tenantDrawerTab !== 'overview' && (
                <div className="py-8 text-center text-slate-400 font-semibold">
                  Menampilkan data detail modul {tenantDrawerTab} untuk {selectedTenantDetail.name}.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedTenantDetail(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Tutup Drawer
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* MODAL: TAMBAH TENANT BARU                                */}
      {/* ======================================================== */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Daftarkan Tenant Laundry Baru</h3>
              <button onClick={() => setShowAddTenantModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Bisnis / Brand Laundry *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kilau Wangi Laundry"
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kode Singkatan</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="KWL"
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilihan Paket Lisensi</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="starter">Starter (1 Outlet - Rp 199k)</option>
                    <option value="growth">Growth (5 Outlet - Rp 499k)</option>
                    <option value="business">Business (Unlimited - Rp 1.299k)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap Owner *</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Nama pemilik bisnis"
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Owner</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@laundry.id"
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor WA Owner</label>
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-700 text-white rounded-xl font-black shadow-md"
                >
                  Aktivasi Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
