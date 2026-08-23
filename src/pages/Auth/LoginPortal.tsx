import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, PlanType } from '../../types';
import { 
  ArrowLeft, Eye, EyeOff, Sparkles, MessageSquare, 
  Store, CheckCircle2, ShieldCheck, HelpCircle, PhoneCall,
  Lock, Mail, Phone, ChevronDown, Check, Zap, Layers, Award, UserCheck, AlertCircle,
  Monitor, Receipt, BarChart3, TrendingUp, Smartphone, Truck, FileText, Wallet, QrCode,
  Headphones, Cloud, Building2, Play, Calendar, Shield
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
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-6 font-sans antialiased select-none">
      {/* Main Split Window Container */}
      <div className="w-full max-w-7xl min-h-screen md:min-h-[720px] bg-white md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/90">
        
        {/* ================= LEFT COLUMN: HERO BANNER & 3D LAUNDRY DASHBOARD ================= */}
        <div className="w-full md:w-7/12 bg-gradient-to-b from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          
          {/* Background Ambient Glow & Mesh Patterns */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-12 right-12 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md border border-white/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>FREE TRIAL & LANGGANAN SAAS</span>
            </span>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm pt-1">
              Laundry <span className="text-sky-300">Suite</span>
            </h1>
            
            <p className="text-xs md:text-sm font-semibold text-blue-100 max-w-md">
              Satu Sistem Operasi untuk Seluruh Bisnis Laundry
            </p>

            {/* 4 Feature Badges Row (Matches Reference Mockup) */}
            <div className="flex flex-wrap items-center gap-3 md:gap-5 pt-3">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm">
                  <Building2 className="w-5 h-5 text-sky-200" />
                </div>
                <div className="text-[10px] font-extrabold text-white leading-tight">Multi-Outlet</div>
                <div className="text-[8px] text-blue-200">Management</div>
              </div>

              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm">
                  <Smartphone className="w-5 h-5 text-sky-200" />
                </div>
                <div className="text-[10px] font-extrabold text-white leading-tight">POS Kasir</div>
                <div className="text-[8px] text-blue-200">Terintegrasi</div>
              </div>

              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm">
                  <MessageSquare className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="text-[10px] font-extrabold text-white leading-tight">WhatsApp</div>
                <div className="text-[8px] text-blue-200">Otomatis</div>
              </div>

              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm">
                  <Cloud className="w-5 h-5 text-sky-300" />
                </div>
                <div className="text-[10px] font-extrabold text-white leading-tight">Cloud</div>
                <div className="text-[8px] text-blue-200">Supabase</div>
              </div>
            </div>
          </div>

          {/* ================= 3D / ISOMETRIC DASHBOARD & LAUNDRY ASSETS VISUAL ================= */}
          <div className="relative z-10 my-auto py-6 flex items-center justify-center">
            <div className="relative w-full max-w-[500px] h-[260px] flex items-center justify-center">
              
              {/* Tilted Glassmorphic Tablet Mockup */}
              <div className="w-full bg-white/95 text-slate-900 rounded-2xl shadow-2xl border-2 border-white/80 p-3.5 backdrop-blur-md flex flex-col justify-between transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                
                {/* Tablet Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="text-[11px] font-black text-slate-900">Dashboard Overview</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 font-mono">
                    <span>LIVE</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="text-[8px] text-slate-400 font-bold">Omzet Hari Ini</div>
                    <div className="text-[11px] font-black text-slate-900 font-mono">Rp 25.430.000</div>
                    <div className="text-[8px] text-emerald-600 font-bold">+12,2% vs kemarin</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="text-[8px] text-slate-400 font-bold">Order Aktif</div>
                    <div className="text-[11px] font-black text-slate-900 font-mono">128</div>
                    <div className="text-[8px] text-amber-600 font-bold">3 menunggu QC</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="text-[8px] text-slate-400 font-bold">Cucian Selesai</div>
                    <div className="text-[11px] font-black text-slate-900 font-mono">86</div>
                    <div className="text-[8px] text-blue-600 font-bold">Siap diambil</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="text-[8px] text-slate-400 font-bold">Tugas Kurir</div>
                    <div className="text-[11px] font-black text-slate-900 font-mono">12</div>
                    <div className="text-[8px] text-slate-500 font-bold">Proses hari ini</div>
                  </div>
                </div>

                {/* Production Stepper Bar */}
                <div className="pt-2">
                  <div className="text-[8px] font-black text-slate-700 uppercase mb-1 flex items-center justify-between">
                    <span>Status Produksi</span>
                    <span className="text-[8px] text-blue-600">68 Total Mesin</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    <div className="bg-blue-50/80 p-1 rounded-lg border border-blue-100 text-[8px]">
                      <span className="font-extrabold text-blue-800">Cuci</span>
                      <div className="font-mono font-black text-blue-700 text-[10px]">24</div>
                    </div>
                    <div className="bg-sky-50/80 p-1 rounded-lg border border-sky-100 text-[8px]">
                      <span className="font-extrabold text-sky-800">Kering</span>
                      <div className="font-mono font-black text-sky-700 text-[10px]">18</div>
                    </div>
                    <div className="bg-amber-50/80 p-1 rounded-lg border border-amber-100 text-[8px]">
                      <span className="font-extrabold text-amber-800">Setrika</span>
                      <div className="font-mono font-black text-amber-700 text-[10px]">12</div>
                    </div>
                    <div className="bg-purple-50/80 p-1 rounded-lg border border-purple-100 text-[8px]">
                      <span className="font-extrabold text-purple-800">QC</span>
                      <div className="font-mono font-black text-purple-700 text-[10px]">8</div>
                    </div>
                    <div className="bg-emerald-50/80 p-1 rounded-lg border border-emerald-100 text-[8px]">
                      <span className="font-extrabold text-emerald-800">Packing</span>
                      <div className="font-mono font-black text-emerald-700 text-[10px]">6</div>
                    </div>
                  </div>
                </div>

                {/* Live Transactions Row Preview */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[8px] text-slate-600 font-medium">
                    <span className="font-mono font-bold text-slate-800">#LBJ-6321</span>
                    <span>Aisyah Putri • Cuci Setrika (5 kg)</span>
                    <span className="bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-mono font-black">WASHING</span>
                    <span className="font-mono font-bold text-slate-800">Rp 55.000</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-slate-600 font-medium">
                    <span className="font-mono font-bold text-slate-800">#LBJ-3194</span>
                    <span>Budi Santoso • Cuci Express (8 kg)</span>
                    <span className="bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded font-mono font-black">READY</span>
                    <span className="font-mono font-bold text-slate-800">Rp 81.000</span>
                  </div>
                </div>

              </div>

              {/* Floating Left Kanban Badge Card (Matches Reference Image) */}
              <div className="absolute -left-5 top-8 bg-white text-slate-900 p-2.5 rounded-2xl shadow-2xl border border-white/90 w-36 space-y-1 animate-bounce-gentle">
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-800 border-b border-slate-100 pb-1">
                  <Layers className="w-3 h-3 text-blue-600" />
                  <span>Kanban Produksi</span>
                </div>
                <div className="space-y-0.5 text-[8px]">
                  <div className="flex justify-between font-semibold text-slate-600"><span>● RECEIVED</span><span className="font-mono font-black text-slate-800">12</span></div>
                  <div className="flex justify-between font-semibold text-blue-600"><span>● WASHING</span><span className="font-mono font-black text-blue-700">24</span></div>
                  <div className="flex justify-between font-semibold text-amber-600"><span>● DRYING</span><span className="font-mono font-black text-amber-700">18</span></div>
                  <div className="flex justify-between font-semibold text-purple-600"><span>● QC</span><span className="font-mono font-black text-purple-700">8</span></div>
                  <div className="flex justify-between font-semibold text-emerald-600"><span>● PACKING</span><span className="font-mono font-black text-emerald-700">6</span></div>
                </div>
              </div>

              {/* Bottom 3D Laundry Assets Row (Washing Machine, Laundry Basket, Towels, Detergent) */}
              <div className="absolute -bottom-8 left-2 right-2 flex items-end justify-between px-3 pointer-events-none">
                
                {/* 3D Washing Machine Item */}
                <div className="w-14 h-16 bg-gradient-to-b from-white via-sky-50 to-slate-200 rounded-xl shadow-2xl border-2 border-white/80 p-1 flex flex-col justify-between items-center pointer-events-auto transform -rotate-3 hover:rotate-0 transition">
                  <div className="w-full flex justify-between items-center px-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <div className="w-3 h-1 bg-slate-800 rounded-xs" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-300 p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-blue-900 flex items-center justify-center relative overflow-hidden">
                      <div className="w-3 h-3 rounded-full bg-sky-300/40 animate-spin" />
                    </div>
                  </div>
                  <div className="w-full h-1 bg-slate-300 rounded-full" />
                </div>

                {/* 3D Laundry Basket with White Clean Clothes */}
                <div className="w-14 h-11 bg-gradient-to-b from-sky-400 to-blue-600 rounded-b-xl shadow-xl border border-sky-300 p-1 flex items-center justify-center relative transform translate-y-1">
                  <div className="absolute -top-2 w-11 h-4 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center">
                    <div className="w-8 h-2 bg-sky-100 rounded-full" />
                  </div>
                </div>

                {/* 3D Neat Stack of Folded Clothes */}
                <div className="flex flex-col items-center space-y-0.5 pointer-events-auto">
                  <div className="w-14 h-2.5 bg-white rounded-md shadow-md border border-slate-100" />
                  <div className="w-14 h-2.5 bg-sky-300 rounded-md shadow-md border border-sky-200" />
                  <div className="w-14 h-2.5 bg-blue-600 rounded-md shadow-md border border-blue-500" />
                </div>

                {/* 3D Detergent Jug Bottle */}
                <div className="w-10 h-14 bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700 rounded-2xl shadow-xl border border-sky-200 p-1 flex flex-col justify-between items-center relative transform rotate-3">
                  <div className="w-4 h-2 bg-white rounded-t-sm" />
                  <div className="w-5 h-6 bg-white/30 backdrop-blur-xs rounded-lg flex items-center justify-center">
                    <DropletIcon className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-[6px] font-black text-white font-mono">ECO</div>
                </div>

              </div>

            </div>
          </div>

          {/* ================= BOTTOM 3 BENEFIT CARDS (Matches Reference Mockup) ================= */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/20 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 shrink-0 border border-white/20">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-xs">14 Hari Trial Gratis</div>
                <div className="text-[10px] text-blue-200 leading-tight">Semua fitur dapat dicoba tanpa kartu kredit</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-emerald-300 shrink-0 border border-white/20">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-xs">Data Aman & Terpercaya</div>
                <div className="text-[10px] text-blue-200 leading-tight">Tersimpan aman di cloud dengan enkripsi tingkat enterprise</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-sky-300 shrink-0 border border-white/20">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-xs">Support Responsif</div>
                <div className="text-[10px] text-blue-200 leading-tight">Tim CS siap membantu Anda setiap hari kerja</div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
        <div className="w-full md:w-5/12 p-8 md:p-10 flex flex-col justify-between overflow-y-auto bg-white">
          
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
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">
                    Masuk ke Akun Laundry
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
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
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="nama@laundry.com"
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Kata Sandi <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Masukkan kata sandi akun"
                            required
                            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
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
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          value={waNumber}
                          onChange={(e) => setWaNumber(e.target.value)}
                          placeholder="Contoh: 081234567890"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Options Row (Remember Me & Forgot Password) */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)} 
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>Ingat saya</span>
                    </label>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert('Silakan hubungi CS Laundry Suite untuk reset sandi melalui WhatsApp 0812-9988-7766.'); }}
                      className="font-bold text-brand-600 hover:underline"
                    >
                      Lupa kata sandi?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-brand-600 hover:from-blue-700 hover:to-brand-700 text-white rounded-xl text-xs font-black shadow-lg shadow-brand-600/25 transition active:scale-[0.99] flex items-center justify-center gap-1.5"
                  >
                    <span>Masuk ke Sistem</span>
                    <span>→</span>
                  </button>
                </form>

                {/* Switch to Register */}
                <div className="text-center text-xs text-slate-500 pt-2">
                  Belum punya akun laundry?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewState('register'); setLoginError(null); }}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Daftar Akun / Free Trial
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute">atau</span>
                </div>

                {/* Coba Demo Button (Matches Reference Image) */}
                <button
                  type="button"
                  onClick={() => login('tenant_owner')}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition flex flex-col items-center justify-center text-center group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 group-hover:text-brand-600">
                    <Play className="w-3.5 h-3.5 text-brand-600 fill-brand-600" />
                    <span>Coba Demo Sistem</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lihat bagaimana Laundry Suite bekerja</div>
                </button>
              </div>
            )}


            {/* ----------------- STATE: REGISTER FORM ----------------- */}
            {viewState === 'register' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    Daftar Akun Bisnis Baru
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Buat database laundry Anda & mulai uji coba gratis 14 hari</p>
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

const DropletIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
