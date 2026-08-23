import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, PlanType } from '../../types';
import { 
  ArrowLeft, Eye, EyeOff, Sparkles, MessageSquare, 
  Store, CheckCircle2, ShieldCheck, HelpCircle, PhoneCall,
  Lock, Mail, Phone, ChevronDown, Check, Zap, Layers, Award, UserCheck, AlertCircle
} from 'lucide-react';

interface LoginPortalProps {
  initialView?: 'welcome' | 'login' | 'register';
  defaultPlan?: PlanType;
  onBackToLanding?: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ 
  initialView = 'login', 
  defaultPlan = 'trial',
  onBackToLanding 
}) => {
  const { login, createTenant, tenants, customers, employees } = useApp();

  // Screen View: 'welcome' | 'login' | 'register'
  const [viewState, setViewState] = useState<'welcome' | 'login' | 'register'>(initialView);
  
  // Login Tab: 'wa' | 'email'
  const [loginMethod, setLoginMethod] = useState<'wa' | 'email'>('email');

  // Login Form States (Clean & Empty by Default)
  const [waNumber, setWaNumber] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register Form States (Clean & Empty by Default)
  const [regName, setRegName] = useState('');
  const [regLaundryName, setRegLaundryName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlan, setRegPlan] = useState<PlanType>(defaultPlan);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Handle Strict Authentication
  const handlePerformLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);

    // 1. WhatsApp Authentication
    if (loginMethod === 'wa') {
      const cleanPhone = waNumber.trim().replace(/^(\+62|62)/, '0');
      if (!cleanPhone) {
        setLoginError('Harap masukkan nomor WhatsApp yang terdaftar.');
        return;
      }

      // Super Admin WhatsApp
      if (cleanPhone === '080011223344' || cleanPhone === '081299999999') {
        login('super_admin');
        return;
      }

      // Registered Tenant Owner
      const matchedTenant = tenants.find(t => 
        t.ownerPhone.trim().replace(/^(\+62|62)/, '0') === cleanPhone
      );
      if (matchedTenant) {
        login('tenant_owner', matchedTenant.id);
        return;
      }

      // Registered Staff / Employee
      const matchedEmployee = employees.find(emp => 
        emp.phone.trim().replace(/^(\+62|62)/, '0') === cleanPhone
      );
      if (matchedEmployee) {
        let assignedRole: UserRole = 'cashier';
        if (matchedEmployee.division === 'Produksi') assignedRole = 'production_staff';
        if (matchedEmployee.division === 'Kurir') assignedRole = 'courier';
        login(assignedRole, matchedEmployee.tenantId, matchedEmployee.outletId);
        return;
      }

      // Registered Customer
      const matchedCustomer = customers.find(c => 
        c.phone.trim().replace(/^(\+62|62)/, '0') === cleanPhone
      );
      if (matchedCustomer) {
        login('customer', matchedCustomer.tenantId);
        return;
      }

      // NOT FOUND
      setLoginError('Nomor WhatsApp ini belum terdaftar di sistem. Silakan daftar akun baru atau periksa kembali nomor Anda.');
      return;
    }

    // 2. Email & Password Authentication
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail || !cleanPass) {
      setLoginError('Harap masukkan alamat email dan kata sandi.');
      return;
    }

    // Super Admin Email
    if (cleanEmail === 'admin@laundrysuite.id' && cleanPass === 'admin123') {
      login('super_admin');
      return;
    }

    // Registered Tenant Owner
    const matchedTenant = tenants.find(t => 
      t.ownerEmail.trim().toLowerCase() === cleanEmail
    );
    if (matchedTenant) {
      if (matchedTenant.password && matchedTenant.password !== cleanPass) {
        setLoginError('Kata sandi yang Anda masukkan salah. Silakan coba lagi.');
        return;
      }
      login('tenant_owner', matchedTenant.id);
      return;
    }

    // Registered Staff / Employee
    const matchedEmployee = employees.find(emp => 
      emp.email.trim().toLowerCase() === cleanEmail
    );
    if (matchedEmployee) {
      let assignedRole: UserRole = 'cashier';
      if (matchedEmployee.division === 'Produksi') assignedRole = 'production_staff';
      if (matchedEmployee.division === 'Kurir') assignedRole = 'courier';
      login(assignedRole, matchedEmployee.tenantId, matchedEmployee.outletId);
      return;
    }

    // Registered Customer
    const matchedCustomer = customers.find(c => 
      c.email.trim().toLowerCase() === cleanEmail
    );
    if (matchedCustomer) {
      login('customer', matchedCustomer.tenantId);
      return;
    }

    // NOT FOUND
    setLoginError('Akun dengan email ini belum terdaftar. Silakan lakukan pendaftaran terlebih dahulu.');
  };

  // Handle Strict Registration
  const handlePerformRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const name = regName.trim();
    const laundryName = regLaundryName.trim();
    const phone = regPhone.trim().replace(/^(\+62|62)/, '0');
    const email = regEmail.trim().toLowerCase();
    const password = regPassword.trim();

    if (!name || !laundryName || !phone || !email || !password) {
      setLoginError('Harap lengkapi semua kolom pendaftaran (Nama, Laundry, WA, Email, dan Kata Sandi).');
      return;
    }

    if (password.length < 5) {
      setLoginError('Kata sandi minimal 5 karakter untuk keamanan akun Anda.');
      return;
    }

    // Check duplicate
    const existing = tenants.find(t => 
      t.ownerEmail.trim().toLowerCase() === email || 
      t.ownerPhone.trim().replace(/^(\+62|62)/, '0') === phone
    );
    if (existing) {
      setLoginError('Email atau Nomor WhatsApp ini sudah terdaftar. Silakan langsung masuk ke akun Anda.');
      return;
    }

    const newTenantCode = (laundryName.replace(/[^A-Za-z0-9]/g, '').slice(0, 3) || 'LND').toUpperCase();
    const newTenant = createTenant({
      name: laundryName,
      code: newTenantCode,
      plan: regPlan,
      status: regPlan === 'trial' ? 'trial' : 'active',
      mrr: regPlan === 'trial' ? 0 : regPlan === 'starter' ? 199000 : regPlan === 'growth' ? 499000 : 1299000,
      ownerName: name,
      ownerEmail: email,
      ownerPhone: phone,
      password: password,
    });

    // Auto login to the newly registered business
    login('tenant_owner', newTenant.id);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-4 font-sans antialiased select-none">
      {/* Main Split Window Container */}
      <div className="w-full max-w-6xl min-h-screen md:min-h-[660px] md:h-[680px] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/80">
        
        {/* ================= LEFT COLUMN: BRAND HERO BANNER ================= */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-300/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Hero Text */}
          <div className="relative z-10 space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-xs border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Free Trial & Langganan SaaS</span>
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-xs pt-1">
              Laundry Suite
            </h1>
            <p className="text-xs md:text-sm font-medium text-blue-100">
              Satu Sistem Operasi untuk Seluruh Bisnis Laundry
            </p>
          </div>

          {/* Center Visual Mockup: Animated Smart Laundry Machine & Operations Hub */}
          <div className="relative z-10 my-auto py-6 flex items-center justify-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
              
              {/* Outer Decorative Rotating Tech Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-300/30 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-white/20" />

              {/* Central Smart Washing Machine Unit (Glassmorphism & Realistic Metallic Finish) */}
              <div className="w-44 h-52 bg-gradient-to-b from-white/95 via-blue-50/90 to-slate-100/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/60 p-3 flex flex-col justify-between relative group transform transition hover:scale-105 duration-300">
                
                {/* Machine Top Control Panel */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <div className="text-[9px] font-black text-slate-800 tracking-wider uppercase font-mono">
                      SMART WASH
                    </div>
                  </div>
                  {/* Digital LED Timer Screen */}
                  <div className="bg-slate-900 text-sky-400 font-mono text-[9px] font-black px-1.5 py-0.5 rounded-md border border-slate-700 shadow-inner flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span>24:00</span>
                  </div>
                </div>

                {/* Main Washing Drum (Front Load Animated Glass Porthole) */}
                <div className="relative my-auto flex items-center justify-center">
                  {/* Outer Chrome Rim */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-300 p-1.5 shadow-xl flex items-center justify-center relative">
                    {/* Dark Glass Door Interior */}
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-blue-950 via-sky-900 to-blue-900 overflow-hidden relative flex items-center justify-center shadow-inner">
                      
                      {/* Water Wave Gradient Effect */}
                      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-sky-400/50 via-cyan-300/30 to-transparent animate-pulse" />
                      
                      {/* Spinning Drum Perforations & Laundry Bubbles */}
                      <div className="absolute inset-1 rounded-full border border-dashed border-sky-300/40 animate-spin" style={{ animationDuration: '6s' }} />
                      <div className="absolute inset-3 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                      
                      {/* Laundry Foam / Bubble Particles */}
                      <div className="absolute w-4 h-4 rounded-full bg-white/70 blur-[0.5px] top-4 left-5 animate-bounce-gentle" />
                      <div className="absolute w-3 h-3 rounded-full bg-sky-200/80 blur-[0.5px] bottom-5 right-6 animate-pulse" />
                      <div className="absolute w-2 h-2 rounded-full bg-white/90 top-8 right-5" />
                      
                      {/* Center Hub Glass Reflection */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/40 via-sky-200/20 to-transparent backdrop-blur-xs border border-white/40 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-sky-200 animate-spin-slow" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Machine Bottom Drawer / Filter Cap */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-500">Auto Detergent 100%</span>
                </div>
              </div>

              {/* Floating Operational Management Badges */}
              
              {/* Badge 1: WhatsApp Autosender */}
              <div className="absolute -top-2 right-0 bg-white/95 text-slate-800 px-3 py-1.5 rounded-xl shadow-xl text-[11px] font-extrabold flex items-center gap-1.5 border border-white/80 animate-bounce-gentle">
                <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageSquare className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-800 leading-none">WhatsApp Otomatis</div>
                  <div className="text-[8px] text-emerald-600 font-semibold">Resi & Notif Siap Ambil</div>
                </div>
              </div>

              {/* Badge 2: POS Kasir & QRIS */}
              <div className="absolute -bottom-2 -left-2 bg-white/95 text-slate-800 px-3 py-1.5 rounded-xl shadow-xl text-[11px] font-extrabold flex items-center gap-1.5 border border-white/80">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Store className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-800 leading-none">POS & Timbangan</div>
                  <div className="text-[8px] text-blue-600 font-semibold">Cetak Struk & QRIS</div>
                </div>
              </div>

              {/* Badge 3: Kurir Live Tracking */}
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-white/95 text-slate-800 px-2.5 py-1.5 rounded-xl shadow-xl text-[10px] font-bold flex items-center gap-1.5 border border-white/80">
                <div className="w-5 h-5 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-800 leading-none">Manajemen Kurir</div>
                  <div className="text-[8px] text-amber-600 font-semibold">Pickup & Antar Jemput</div>
                </div>
              </div>

              {/* Badge 4: Produksi & Kanban */}
              <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-white/95 text-slate-800 px-2.5 py-1.5 rounded-xl shadow-xl text-[10px] font-bold flex items-center gap-1.5 border border-white/80">
                <div className="w-5 h-5 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Layers className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-800 leading-none">Kanban Mesin</div>
                  <div className="text-[8px] text-indigo-600 font-semibold">Cuci, Kering, Setrika</div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Bullet Points */}
          <div className="relative z-10 space-y-2 text-xs text-blue-100 font-medium pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multi-Outlet, POS Kasir, & Integrasi WA Otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tersedia 14 Hari Trial Gratis • Terhubung Cloud Supabase</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto bg-white">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-600/20">
                LS
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                Laundry<span className="text-brand-600">Suite</span>
              </span>
            </div>

            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-200"
              >
                <span>← Halaman Utama</span>
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="my-auto py-2">
            
            {/* ----------------- STATE: LOGIN FORM ----------------- */}
            {viewState === 'login' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    Masuk ke Akun Laundry
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Masukkan email atau nomor WhatsApp yang telah terdaftar
                  </p>
                </div>

                {/* Login Method Toggle Pills */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('email'); setLoginError(null); }}
                    className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      loginMethod === 'email'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-brand-600" />
                    <span>Email & Sandi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginMethod('wa'); setLoginError(null); }}
                    className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      loginMethod === 'wa'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handlePerformLogin} className="space-y-3 pt-1">
                  {loginMethod === 'email' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Alamat Email Terdaftar <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="nama@laundry.com"
                          required
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Kata Sandi <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Masukkan kata sandi akun"
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
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nomor WhatsApp Terdaftar <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={waNumber}
                        onChange={(e) => setWaNumber(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 font-mono"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-600/25 transition active:scale-[0.99]"
                  >
                    Masuk ke Sistem
                  </button>
                </form>

                {/* Switch to Register */}
                <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
                  Belum punya akun laundry?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewState('register'); setLoginError(null); }}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Daftar Akun / Free Trial
                  </button>
                </div>
              </div>
            )}


            {/* ----------------- STATE: REGISTER FORM ----------------- */}
            {viewState === 'register' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">
                      Daftar Akun Bisnis Baru
                    </h2>
                    <p className="text-[11px] text-slate-400">Buat database laundry Anda & mulai kelola operasional</p>
                  </div>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handlePerformRegister} className="space-y-2.5">
                  {/* Plan Selector with 4 Options (Trial + Starter + Growth + Business) */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Pilihan Paket Berlangganan
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { 
                          key: 'trial', 
                          name: 'Trial 14 Hari', 
                          badge: 'Gratis',
                          price: 'Rp 0', 
                          desc: 'Sama Fitur Starter' 
                        },
                        { 
                          key: 'starter', 
                          name: 'Starter', 
                          price: 'Rp 199k/bln', 
                          desc: '1 Outlet • POS & Resi' 
                        },
                        { 
                          key: 'growth', 
                          name: 'Growth ⭐', 
                          price: 'Rp 499k/bln', 
                          desc: '5 Outlet • Produksi' 
                        },
                        { 
                          key: 'business', 
                          name: 'Business', 
                          price: 'Rp 1.2jt/bln', 
                          desc: 'Unlimited • Multi ERP' 
                        }
                      ].map(plan => (
                        <button
                          key={plan.key}
                          type="button"
                          onClick={() => setRegPlan(plan.key as any)}
                          className={`p-2 rounded-xl border text-left transition relative ${
                            regPlan === plan.key
                              ? plan.key === 'trial'
                                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30 shadow-xs'
                                : 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[11px] text-slate-900">{plan.name}</span>
                            {plan.badge && (
                              <span className="text-[8px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] font-extrabold mt-0.5 ${plan.key === 'trial' ? 'text-emerald-700' : 'text-brand-700'}`}>
                            {plan.price}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{plan.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Nama Pemilik *</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Nama Usaha Laundry *</label>
                      <input
                        type="text"
                        value={regLaundryName}
                        onChange={(e) => setRegLaundryName(e.target.value)}
                        placeholder="Contoh: Berkah Laundry"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="081234567890"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Alamat Email *</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="owner@laundry.com"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Kata Sandi Baru *</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 5 karakter"
                        required
                        className="w-full px-3 pr-10 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 text-white rounded-xl text-xs font-black shadow-lg transition active:scale-[0.99] mt-1 flex items-center justify-center gap-1.5 ${
                      regPlan === 'trial'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-emerald-600/25'
                        : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/25'
                    }`}
                  >
                    <span>
                      {regPlan === 'trial' 
                        ? '🎁 Mulai Trial 14 Hari Gratis Sekarang ➔' 
                        : 'Daftar & Masuk ke Dashboard ➔'
                      }
                    </span>
                  </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-1 border-t border-slate-100">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewState('login'); setLoginError(null); }}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Masuk ke akun
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Help Contact */}
          <div className="pt-3 border-t border-slate-100 text-left text-xs text-slate-500 space-y-0.5">
            <p className="text-[10px] text-slate-400">Butuh bantuan pendaftaran atau demo?</p>
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
