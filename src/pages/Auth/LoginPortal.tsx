import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ArrowLeft, Eye, EyeOff, Sparkles, MessageSquare, 
  Store, CheckCircle2, ShieldCheck, HelpCircle, PhoneCall,
  Lock, Mail, Phone, ChevronDown, Check, Zap, Layers, Award
} from 'lucide-react';

interface LoginPortalProps {
  initialView?: 'welcome' | 'login' | 'register';
  defaultPlan?: 'starter' | 'growth' | 'business';
  onBackToLanding?: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ 
  initialView = 'login', 
  defaultPlan = 'growth',
  onBackToLanding 
}) => {
  const { login, createTenant, tenants, customers, employees } = useApp();

  // Screen View: 'welcome' | 'login' | 'register'
  const [viewState, setViewState] = useState<'welcome' | 'login' | 'register'>(initialView);
  
  // Login Tab: 'wa' | 'email'
  const [loginMethod, setLoginMethod] = useState<'wa' | 'email'>('wa');

  // Login Form States
  const [waNumber, setWaNumber] = useState('081234567890');
  const [emailInput, setEmailInput] = useState('owner@bersihjaya.id');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regLaundryName, setRegLaundryName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlan, setRegPlan] = useState<'starter' | 'growth' | 'business'>(defaultPlan);

  // Handle Login Submission with Smart Role & Subscription Detection
  const handlePerformLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const inputVal = loginMethod === 'wa' ? waNumber.trim() : emailInput.trim().toLowerCase();

    // 1. Super Admin Match
    if (inputVal === 'admin@laundrysuite.id' || inputVal === '080011223344') {
      login('super_admin');
      return;
    }

    // 2. Tenant Owner Match (or Match against registered tenants)
    const matchedTenant = tenants.find(t => 
      t.ownerEmail.toLowerCase() === inputVal || 
      t.ownerPhone === inputVal ||
      (inputVal.startsWith('0812') && t.id === 't-1') // Fallback demo
    );

    if (matchedTenant) {
      login('tenant_owner', matchedTenant.id);
      return;
    }

    // 3. Employee (Cashier / Production / Courier) Match
    const matchedEmployee = employees.find(emp => 
      emp.email.toLowerCase() === inputVal || 
      emp.phone === inputVal
    );

    if (matchedEmployee) {
      let assignedRole: UserRole = 'cashier';
      if (matchedEmployee.division === 'Produksi') assignedRole = 'production_staff';
      if (matchedEmployee.division === 'Kurir') assignedRole = 'courier';
      login(assignedRole, matchedEmployee.tenantId, matchedEmployee.outletId);
      return;
    }

    // 4. Customer Match
    const matchedCustomer = customers.find(c => 
      c.phone === inputVal || 
      c.email.toLowerCase() === inputVal ||
      inputVal === '0856864327294' // Sample from mockup
    );

    if (matchedCustomer) {
      login('customer', matchedCustomer.tenantId);
      return;
    }

    // Default smart routing fallback: if user typed anything, route to owner or customer
    if (inputVal.includes('@')) {
      login('tenant_owner', tenants[0]?.id);
    } else {
      login('customer', tenants[0]?.id);
    }
  };

  // Handle Register Submission
  const handlePerformRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regLaundryName.trim() || !regName.trim()) {
      setLoginError('Harap lengkapi semua kolom pendaftaran.');
      return;
    }

    const newTenantCode = regLaundryName.slice(0, 3).toUpperCase();
    createTenant({
      name: regLaundryName,
      code: newTenantCode,
      plan: regPlan,
      status: 'active',
      mrr: regPlan === 'starter' ? 199000 : regPlan === 'growth' ? 499000 : 1299000,
      ownerName: regName,
      ownerEmail: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      ownerPhone: regPhone || '081299887766',
    });

    // Auto login to Owner Role
    login('tenant_owner');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-sans antialiased select-none">
      {/* Main Split Window Container */}
      <div className="w-full max-w-6xl min-h-screen md:min-h-[660px] md:h-[680px] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/80">
        
        {/* ================= LEFT COLUMN: BRAND HERO BANNER ================= */}
        <div className="w-full md:w-1/2 bg-linear-to-b from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-300/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Hero Text */}
          <div className="relative z-10 space-y-1">
            <p className="text-sm md:text-base font-medium text-blue-100 tracking-wide">
              Selamat Datang di Aplikasi Laundry
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Laundry Suite
            </h1>
          </div>

          {/* Center Graphic Showcase with Floating Badges */}
          <div className="relative z-10 my-8 flex items-center justify-center">
            {/* Center Circular Device Illustration */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-linear-to-tr from-blue-700/60 to-sky-400/30 border border-white/20 p-4 flex items-center justify-center backdrop-blur-xs shadow-2xl">
              
              {/* WhatsApp Autosender Highlight Pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 text-slate-800 px-3.5 py-1.5 rounded-full shadow-lg border border-blue-100 flex items-center gap-1.5 z-20 animate-bounce duration-1000">
                <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <div className="text-[11px] font-extrabold leading-tight">
                  <span className="text-[9px] block text-slate-400 font-bold -mb-0.5">WhatsApp</span>
                  Autosender
                </div>
              </div>

              {/* Washing Machine Icon Pill */}
              <div className="absolute left-2 top-20 bg-white/90 text-slate-800 p-2.5 rounded-2xl shadow-md border border-white/40 flex items-center justify-center z-20">
                <Store className="w-5 h-5 text-brand-600" />
              </div>

              {/* Charts & Analytics Pill */}
              <div className="absolute right-2 top-20 bg-white/90 text-slate-800 p-2.5 rounded-2xl shadow-md border border-white/40 flex items-center justify-center z-20">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>

              {/* QRIS & Nota Invoice Floating Pill */}
              <div className="absolute bottom-4 right-4 bg-white/95 text-slate-800 px-3 py-1.5 rounded-xl shadow-lg border border-white/50 flex items-center gap-1.5 z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-black text-slate-800">QRIS & POS</span>
              </div>

              {/* Person working avatar / illustration */}
              <div className="w-44 h-44 rounded-full bg-linear-to-b from-sky-300 to-blue-600 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
                  alt="Laundry Owner" 
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Bottom Highlight Bullet List */}
          <div className="relative z-10 text-xs text-blue-100 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-sky-300" />
              <span>Multi-Outlet, POS Kasir, & Integrasi WA Otomatis</span>
            </div>
          </div>
        </div>


        {/* ================= RIGHT COLUMN: INTERACTIVE FORM AREA ================= */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white overflow-y-auto">
          
          {/* Top Logo and Back Button */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-500/20">
                LS
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Laundry<span className="text-brand-600">Suite</span>
              </span>
            </div>

            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-[11px] font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-slate-50"
              >
                <span>← Halaman Utama</span>
              </button>
            )}
          </div>

          {/* Dynamic Content based on ViewState */}
          <div className="my-auto py-6">

            {/* ----------------- STATE 1: WELCOME SCREEN ----------------- */}
            {viewState === 'welcome' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Smart Laundry Management
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Atur, kelola & pantau seluruh operasional usaha laundry Anda kapanpun dan dimanapun dengan mudah.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setViewState('register')}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-600/25 transition active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Daftar Akun Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewState('login')}
                    className="w-full py-3.5 bg-white hover:bg-slate-50 text-brand-600 border-2 border-brand-600 rounded-xl text-xs font-extrabold transition active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Login ke Akun Anda</span>
                  </button>
                </div>

                {/* Quick 1-Click Multi-Tenant SaaS Simulation */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Simulasi Multi-Tenant Database Terisolasi:</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
                      100% Isolated
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => login('tenant_owner', 't-1')}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/50 text-left transition text-xs font-bold text-slate-800"
                    >
                      <div className="text-brand-700 font-extrabold">🏢 Tenant 1: Laundry Bersih Jaya</div>
                      <div className="text-[10px] text-slate-500 font-normal">Paket Growth • 3 Cabang • Data T-1</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => login('tenant_owner', 't-2')}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/50 text-left transition text-xs font-bold text-slate-800"
                    >
                      <div className="text-purple-700 font-extrabold">🏢 Tenant 2: Klin Laundry Express</div>
                      <div className="text-[10px] text-slate-500 font-normal">Paket Business • 5 Cabang • Data T-2</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => login('tenant_owner', 't-3')}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 text-left transition text-xs font-bold text-slate-800"
                    >
                      <div className="text-amber-700 font-extrabold">🏢 Tenant 3: Fresh & Clean</div>
                      <div className="text-[10px] text-slate-500 font-normal">Paket Starter • 1 Cabang • Data T-3</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => login('super_admin')}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition text-xs font-bold text-slate-800"
                    >
                      <div className="text-emerald-700 font-extrabold">👑 SaaS Super Admin</div>
                      <div className="text-[10px] text-slate-500 font-normal">Platform Owner • Semua Tenant & MRR</div>
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* ----------------- STATE 2: LOGIN FORM ----------------- */}
            {viewState === 'login' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Back Button & Title */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setViewState('welcome')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <ArrowLeft className="w-5 h-5 text-brand-600" />
                  </button>
                  <h2 className="text-xl font-black text-slate-900">
                    Login
                  </h2>
                </div>

                {/* Tabs: Nomor WA | Email/Username */}
                <div className="flex border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('wa')}
                    className={`flex-1 pb-2.5 text-xs font-bold transition text-center border-b-2 ${
                      loginMethod === 'wa'
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Nomor Wa
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 pb-2.5 text-xs font-bold transition text-center border-b-2 ${
                      loginMethod === 'email'
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Email/Username
                  </button>
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handlePerformLogin} className="space-y-4">
                  {/* TAB 1: NOMOR WA */}
                  {loginMethod === 'wa' ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Silahkan masukkan <strong className="text-slate-900">nomor Whatsapp</strong> Anda, kami akan mengarahkan akun Anda sesuai paket berlangganan.
                      </p>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nomor Whatsapp <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-600">
                          <div className="bg-slate-50 px-3 py-2.5 flex items-center gap-1.5 border-r border-slate-300 text-xs font-semibold text-slate-700 shrink-0">
                            <span>🇮🇩</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <input
                            type="tel"
                            value={waNumber}
                            onChange={(e) => setWaNumber(e.target.value)}
                            placeholder="856864327294"
                            required
                            className="flex-1 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* TAB 2: EMAIL / USERNAME */
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Silahkan masukkan <strong className="text-slate-900">Email/Username</strong> dan <strong className="text-slate-900">kata sandi</strong> Anda untuk login.
                      </p>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Email/Username <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="contoh@email.com"
                          required
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-slate-700">
                            Kata sandi <span className="text-rose-500">*</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="kata sandi"
                            required
                            className="w-full px-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="mt-1">
                          <a href="#" onClick={(e) => { e.preventDefault(); alert('Instruksi reset sandi telah dikirim ke email Anda.'); }} className="text-[11px] font-bold text-brand-600 hover:underline">
                            Lupa Kata Sandi?
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-600/25 transition active:scale-[0.99]"
                  >
                    Login
                  </button>
                </form>

                {/* Footer Navigation within Login */}
                <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
                  <p>
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setViewState('register')}
                      className="font-bold text-brand-600 hover:underline"
                    >
                      Daftar Laundry Suite
                    </button>
                  </p>
                </div>
              </div>
            )}


            {/* ----------------- STATE 3: REGISTER & SUBSCRIPTION SELECTION ----------------- */}
            {viewState === 'register' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Back Button & Title */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setViewState('welcome')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <ArrowLeft className="w-5 h-5 text-brand-600" />
                  </button>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">
                      Daftar Akun Bisnis Laundry
                    </h2>
                    <p className="text-[11px] text-slate-400">Pilih paket sesuai kebutuhan skala usaha Anda</p>
                  </div>
                </div>

                <form onSubmit={handlePerformRegister} className="space-y-3">
                  {/* Plan Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Pilihan Paket Berlangganan
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'starter', name: 'Starter', price: 'Rp 199k/bln', desc: '1 Outlet • POS' },
                        { key: 'growth', name: 'Growth', price: 'Rp 499k/bln', desc: '3 Outlet • Kanban & Kurir' },
                        { key: 'business', name: 'Business', price: 'Rp 1.2jt/bln', desc: 'Unlimited • Whitelabel' }
                      ].map(plan => (
                        <button
                          key={plan.key}
                          type="button"
                          onClick={() => setRegPlan(plan.key as any)}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            regPlan === plan.key
                              ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-extrabold text-xs text-slate-900">{plan.name}</div>
                          <div className="text-[10px] text-brand-700 font-bold">{plan.price}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{plan.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Nama Pemilik *</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Budi Santoso"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Nama Usaha Laundry *</label>
                      <input
                        type="text"
                        value={regLaundryName}
                        onChange={(e) => setRegLaundryName(e.target.value)}
                        placeholder="KlinKlin Laundry"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="081234567890"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Email Akun</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="owner@laundry.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-600/25 transition active:scale-[0.99] mt-2"
                  >
                    Daftar & Masuk ke Dashboard ➔
                  </button>
                </form>

                <div className="text-center text-xs text-slate-500">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setViewState('login')}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Login di sini
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Help Contact (Matches mockup) */}
          <div className="pt-4 border-t border-slate-100 text-left text-xs text-slate-500 space-y-1">
            <p className="text-[11px] text-slate-400">Atau mengalami kesulitan?</p>
            <p className="text-xs">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert('CS Laundry Suite siap membantu melalui WhatsApp 0812-9988-7766.'); }}
                className="font-bold text-brand-600 hover:underline"
              >
                Hubungi CS Kami
              </a>{' '}
              atau Telp ke <span className="font-semibold text-slate-700">(021) 5082494</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
