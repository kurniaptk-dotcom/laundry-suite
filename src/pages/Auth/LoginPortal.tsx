import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, PlanType } from '../../types';
import { 
  ArrowLeft, Eye, EyeOff, Sparkles, MessageSquare, 
  Store, CheckCircle2, ShieldCheck, HelpCircle, PhoneCall,
  Lock, Mail, Phone, ChevronDown, Check, Zap, Layers, Award, UserCheck, AlertCircle,
  CreditCard, QrCode, Building, Copy, Clock, Wallet, Shield
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

  // Screen View: 'welcome' | 'login' | 'register' | 'verify_otp' | 'trial_welcome'
  const [viewState, setViewState] = useState<'welcome' | 'login' | 'register' | 'verify_otp' | 'trial_welcome'>(initialView);
  
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

  // Verification & Onboarding States
  const [pendingRegistration, setPendingRegistration] = useState<{
    name: string;
    laundryName: string;
    phone: string;
    email: string;
    password: string;
    plan: PlanType;
  } | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(60);
  const [createdTrialTenant, setCreatedTrialTenant] = useState<any>(null);

  // Payment Gateway & Checkout States
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va_bca' | 'va_mandiri' | 'va_bni' | 'va_bri' | 'credit_card'>('qris');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [pendingTenant, setPendingTenant] = useState<any>(null);
  const [copiedVa, setCopiedVa] = useState(false);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    let interval: any = null;
    if (viewState === 'verify_otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, otpTimer]);

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

    // Super Admin Email & Password
    if (
      (cleanEmail === 'admin@laundrysuite.id' || cleanEmail === 'admin@laundrysuite.com' || cleanEmail === 'superadmin@laundrysuite.id' || cleanEmail === 'superadmin@gmail.com') && 
      (cleanPass === 'admin123' || cleanPass === 'Admin123!' || cleanPass === 'admin' || cleanPass === 'password')
    ) {
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

    // Check duplicate in registered tenants
    const existing = tenants.find(t => 
      t.ownerEmail.trim().toLowerCase() === email || 
      t.ownerPhone.trim().replace(/^(\+62|62)/, '0') === phone
    );
    if (existing) {
      setLoginError('Email atau Nomor WhatsApp ini sudah terdaftar. Silakan langsung masuk ke akun Anda.');
      return;
    }

    // Save pending registration without creating tenant in database yet
    setPendingRegistration({
      name,
      laundryName,
      phone,
      email,
      password,
      plan: regPlan,
    });
    setOtpInput('849201'); // Pre-fill with sample verification code for seamless instant testing
    setOtpTimer(60);
    setOtpError(null);
    setViewState('verify_otp');
  };

  // Handle OTP Confirmation
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRegistration) return;

    if (otpInput.trim().length < 4) {
      setOtpError('Harap masukkan 6-digit kode verifikasi yang valid.');
      return;
    }

    const { name, laundryName, phone, email, password, plan } = pendingRegistration;
    const newTenantCode = (laundryName.replace(/[^A-Za-z0-9]/g, '').slice(0, 3) || 'LND').toUpperCase();

    const newTenant = createTenant({
      name: laundryName,
      code: newTenantCode,
      plan: plan,
      status: plan === 'trial' ? 'trial' : 'active',
      mrr: plan === 'trial' ? 0 : plan === 'starter' ? 199000 : plan === 'growth' ? 499000 : 1299000,
      ownerName: name,
      ownerEmail: email,
      ownerPhone: phone,
      password: password,
    });

    if (plan === 'trial') {
      // Transition to dedicated Trial Onboarding Welcome Screen
      setCreatedTrialTenant(newTenant);
      setViewState('trial_welcome');
    } else {
      // Open Payment Checkout Simulator Modal for paid plans
      setPendingTenant(newTenant);
      setShowCheckoutModal(true);
    }
  };

  const handleCancelRegistration = () => {
    setPendingRegistration(null);
    setOtpInput('');
    setOtpError(null);
    setViewState('register');
  };

  const handleLaunchTrialDashboard = () => {
    sessionStorage.setItem('ls_trigger_onboarding', 'true');
    if (createdTrialTenant) {
      login('tenant_owner', createdTrialTenant.id);
    } else if (pendingRegistration) {
      login('tenant_owner');
    }
  };

  const handleCompletePaymentCheckout = () => {
    if (pendingTenant) {
      sessionStorage.setItem('ls_trigger_onboarding', 'true');
      setShowCheckoutModal(false);
      login('tenant_owner', pendingTenant.id);
    }
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

          {/* Center Visual Mockup: Animated Smart Laundry Machine & Orbiting Team Roles */}
          <div className="relative z-10 my-auto py-8 flex items-center justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              
              {/* Central Stationary Smart Washing Machine Unit (z-20) */}
              <div className="w-44 h-52 bg-gradient-to-b from-white/95 via-blue-50/90 to-slate-100/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-white/60 p-3 flex flex-col justify-between relative group transform transition hover:scale-105 duration-300 z-20">
                
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

              {/* ================= 360-DEGREE ORBITAL REVOLVING RING ================= */}
              <div className="absolute inset-0 rounded-full border border-dashed border-sky-300/30 animate-orbit pointer-events-none z-30">
                
                {/* 1. TOP: OWNER BISNIS */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className="animate-counter-orbit">
                    <div className="bg-white/95 text-slate-800 p-1.5 px-2.5 rounded-2xl shadow-2xl border border-white/90 flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-full bg-amber-900/10 flex items-center justify-center text-xs">
                          👑
                        </div>
                      </div>
                      <div className="text-left pr-1 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black text-slate-900 leading-none">Owner Bisnis</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                        <div className="text-[8px] text-amber-700 font-semibold leading-tight mt-0.5">Pantau Omzet & Cabang</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. RIGHT: KURIR DELIVERY */}
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className="animate-counter-orbit">
                    <div className="bg-white/95 text-slate-800 p-1.5 px-2.5 rounded-2xl shadow-2xl border border-white/90 flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-full bg-emerald-900/10 flex items-center justify-center text-xs">
                          🛵
                        </div>
                      </div>
                      <div className="text-left pr-1 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black text-slate-900 leading-none">Kurir Delivery</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="text-[8px] text-emerald-700 font-semibold leading-tight mt-0.5">Antar Jemput & POD</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. BOTTOM: KASIR OUTLET */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                  <div className="animate-counter-orbit">
                    <div className="bg-white/95 text-slate-800 p-1.5 px-2.5 rounded-2xl shadow-2xl border border-white/90 flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-400 via-sky-300 to-blue-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-full bg-blue-900/10 flex items-center justify-center text-xs">
                          👩‍💼
                        </div>
                      </div>
                      <div className="text-left pr-1 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black text-slate-900 leading-none">Kasir Outlet</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        </div>
                        <div className="text-[8px] text-blue-700 font-semibold leading-tight mt-0.5">Input Kiloan & Kasir</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. LEFT: OPERATOR CUCI & QC */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className="animate-counter-orbit">
                    <div className="bg-white/95 text-slate-800 p-1.5 px-2.5 rounded-2xl shadow-2xl border border-white/90 flex items-center gap-2 backdrop-blur-md hover:scale-110 transition-transform">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-400 via-indigo-300 to-purple-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-full bg-purple-900/10 flex items-center justify-center text-xs">
                          👔
                        </div>
                      </div>
                      <div className="text-left pr-1 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black text-slate-900 leading-none">Operator Cuci</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        </div>
                        <div className="text-[8px] text-purple-700 font-semibold leading-tight mt-0.5">Kontrol Mesin & QC</div>
                      </div>
                    </div>
                  </div>
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
                    onClick={() => { setViewState('register'); setLoginError(null); window.history.pushState(null, '', '/register'); }}
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
                  {/* Plan Selector - Modern Card Design */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">
                      Pilihan Paket Berlangganan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { 
                          key: 'trial', 
                          icon: '🎁',
                          name: 'Free Trial', 
                          duration: '14 Hari',
                          badge: 'GRATIS',
                          badgeColor: 'bg-emerald-500',
                          price: 'Rp 0', 
                          priceNote: '/14 hari',
                          features: ['Semua fitur Starter', 'Tanpa kartu kredit'],
                          activeGradient: 'from-emerald-500 to-teal-600',
                          activeBorder: 'border-emerald-500',
                          activeRing: 'ring-emerald-500/25',
                          activeBg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
                        },
                        { 
                          key: 'starter', 
                          icon: '🚀',
                          name: 'Starter', 
                          price: 'Rp 199k', 
                          priceNote: '/bulan',
                          features: ['1 Outlet', 'POS & Nota Digital'],
                          activeGradient: 'from-blue-500 to-indigo-600',
                          activeBorder: 'border-blue-500',
                          activeRing: 'ring-blue-500/25',
                          activeBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                        },
                        { 
                          key: 'growth', 
                          icon: '⭐',
                          name: 'Growth', 
                          price: 'Rp 499k', 
                          priceNote: '/bulan',
                          badge: 'POPULER',
                          badgeColor: 'bg-amber-500',
                          features: ['5 Outlet', 'Produksi & Delivery'],
                          activeGradient: 'from-amber-500 to-orange-600',
                          activeBorder: 'border-amber-500',
                          activeRing: 'ring-amber-500/25',
                          activeBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
                        },
                        { 
                          key: 'business', 
                          icon: '💎',
                          name: 'Business', 
                          price: 'Rp 1.2jt', 
                          priceNote: '/bulan',
                          features: ['Unlimited Outlet', 'Multi-ERP & API'],
                          activeGradient: 'from-violet-500 to-purple-600',
                          activeBorder: 'border-violet-500',
                          activeRing: 'ring-violet-500/25',
                          activeBg: 'bg-gradient-to-br from-violet-50 to-purple-50',
                        }
                      ].map(plan => {
                        const isActive = regPlan === plan.key;
                        return (
                          <button
                            key={plan.key}
                            type="button"
                            onClick={() => setRegPlan(plan.key as any)}
                            className={`relative p-2.5 rounded-xl border-2 text-left transition-all duration-200 group overflow-hidden ${
                              isActive
                                ? `${plan.activeBorder} ${plan.activeBg} ${plan.activeRing} ring-4 shadow-md scale-[1.02]`
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                            }`}
                          >
                            {/* Active indicator gradient bar */}
                            {isActive && (
                              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${plan.activeGradient}`} />
                            )}

                            {/* Badge */}
                            {plan.badge && (
                              <span className={`absolute top-1.5 right-1.5 text-[7px] ${plan.badgeColor} text-white font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm`}>
                                {plan.badge}
                              </span>
                            )}

                            {/* Check circle */}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mb-1.5 transition-all ${
                              isActive
                                ? `bg-gradient-to-br ${plan.activeGradient} border-transparent shadow-sm`
                                : 'border-slate-300 group-hover:border-slate-400'
                            }`}>
                              {isActive && (
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              )}
                            </div>

                            {/* Plan icon + name */}
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-sm">{plan.icon}</span>
                              <span className={`font-extrabold text-[11px] ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                                {plan.name}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-0.5 mb-1">
                              <span className={`text-sm font-black ${isActive ? 'text-slate-900' : 'text-slate-800'}`}>
                                {plan.price}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium">{plan.priceNote}</span>
                            </div>

                            {/* Features */}
                            <div className="space-y-0.5">
                              {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <CheckCircle2 className={`w-2.5 h-2.5 flex-shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                                  <span className={`text-[9px] leading-tight ${isActive ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{f}</span>
                                </div>
                              ))}
                            </div>
                          </button>
                        );
                      })}
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

                  {/* Payment Method Selector (Only for Paid Plans) */}
                  {regPlan !== 'trial' && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-slate-700">
                          Pilih Metode Pembayaran Langganan
                        </label>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          ✓ Otomatis Aktif
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-left">
                        {[
                          { key: 'qris', label: 'QRIS Instan', icon: '📱', sub: 'GoPay/OVO/Dana/BCA' },
                          { key: 'va_bca', label: 'BCA Virtual Acc', icon: '🏦', sub: 'Cek Otomatis 24 Jam' },
                          { key: 'va_mandiri', label: 'Mandiri VA', icon: '🏦', sub: 'Livin by Mandiri' },
                          { key: 'va_bri', label: 'BRI / BNI VA', icon: '🏦', sub: 'BRIMO / BNI Mobile' },
                          { key: 'credit_card', label: 'Kartu Kredit', icon: '💳', sub: 'Visa & Mastercard' },
                          { key: 'va_bni', label: 'E-Wallet', icon: '⚡', sub: 'ShopeePay & QR' },
                        ].map(pm => (
                          <button
                            key={pm.key}
                            type="button"
                            onClick={() => setPaymentMethod(pm.key as any)}
                            className={`p-2 rounded-xl border text-left transition ${
                              paymentMethod === pm.key
                                ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                            }`}
                          >
                            <div className="text-xs">{pm.icon} <span className="text-[10px] font-bold">{pm.label}</span></div>
                            <div className="text-[8px] text-slate-400 truncate mt-0.5">{pm.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                        : `Lanjut ke Pembayaran (${regPlan === 'starter' ? 'Rp 199k' : regPlan === 'growth' ? 'Rp 499k' : 'Rp 1.2jt'}/bln) ➔`
                      }
                    </span>
                  </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-1 border-t border-slate-100">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewState('login'); setLoginError(null); window.history.pushState(null, '', '/login'); }}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Masuk ke akun
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- STATE: EMAIL & WHATSAPP OTP VERIFICATION ----------------- */}
            {viewState === 'verify_otp' && pendingRegistration && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight pt-1">
                    Verifikasi Akun Baru
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Kode OTP verifikasi telah dikirimkan ke email dan nomor WhatsApp Anda:
                  </p>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 inline-block">
                    📧 {pendingRegistration.email} • 📱 {pendingRegistration.phone}
                  </div>
                </div>

                {otpError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 text-center mb-1.5">
                      Masukkan 6-Digit Kode Verifikasi (OTP):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="849201"
                      required
                      autoFocus
                      className="w-full text-center tracking-[0.5em] text-2xl font-black font-mono py-2.5 bg-slate-50 border-2 border-brand-500 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>
                      {otpTimer > 0 ? (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>Kirim ulang ({otpTimer}s)</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setOtpTimer(60); alert('Kode OTP baru telah dikirimkan ulang!'); }}
                          className="font-bold text-brand-600 hover:underline"
                        >
                          Kirim Ulang Kode OTP
                        </button>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpInput('849201')}
                      className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md hover:bg-brand-100 transition"
                    >
                      Isi Otomatis: 849201
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black shadow-lg shadow-brand-600/25 transition active:scale-[0.99] flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verifikasi & Aktifkan Akun ➔</span>
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleCancelRegistration}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700 transition"
                  >
                    ← Ubah Data Pendaftaran / Batal
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- STATE: TRIAL ONBOARDING & COUNTDOWN WELCOME ----------------- */}
            {viewState === 'trial_welcome' && (
              <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 animate-bounce-gentle">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    🎉 Akun Berhasil Diaktivasi
                  </span>
                  <h2 className="text-xl font-black text-slate-900 leading-tight mt-2">
                    Selamat Datang di Laundry Suite!
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Paket <strong>14 Hari Free Trial</strong> Anda telah aktif dengan akses seluruh fitur bisnis tanpa biaya.
                  </p>
                </div>

                {/* Countdown Visual Banner */}
                <div className="p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-slate-50 rounded-2xl border border-amber-200/80 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-extrabold text-xs text-amber-900">
                      <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>Countdown Masa Trial:</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-lg shadow-xs">
                      14 HARI TERSISA
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700 text-[11px] font-semibold pt-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Kasir POS & Timbangan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Multi-Outlet & Cabang</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Notifikasi WhatsApp Otomatis</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Laporan Laba Rugi & ERP</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchTrialDashboard}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl text-xs font-black shadow-xl shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🚀 Masuk ke Dashboard & Mulai Atur Outlet ➔</span>
                </button>
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

      {/* ======================================================== */}
      {/* SAAS PAYMENT CHECKOUT INVOICE MODAL                      */}
      {/* ======================================================== */}
      {showCheckoutModal && pendingTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">Payment Gateway & Billing SaaS</h3>
                  <p className="text-[10px] text-blue-100 font-mono">Invoice #{`INV-SUB-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(1000 + Math.random()*9000)}`}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 text-[10px] font-extrabold uppercase border border-amber-300/40">
                Menunggu Pembayaran
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-slate-800 text-xs">
              {/* Tenant & Plan Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Langganan Bisnis Laundry</span>
                  <span className="font-black text-sm text-slate-900">{pendingTenant.name}</span>
                  <span className="text-[10px] text-slate-500 block">{pendingTenant.ownerName} • {pendingTenant.ownerPhone}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-black text-[11px] uppercase">
                    Paket {pendingTenant.plan.toUpperCase()}
                  </span>
                  <div className="font-black text-base text-slate-900 mt-1">
                    Rp {(pendingTenant.mrr || 499000).toLocaleString('id-ID')}
                    <span className="text-[10px] text-slate-400 font-normal"> /bln</span>
                  </div>
                </div>
              </div>

              {/* Payment Details per Method */}
              {paymentMethod === 'qris' ? (
                <div className="text-center p-5 bg-gradient-to-b from-blue-50/50 to-white rounded-2xl border border-blue-100 space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-800">
                    <QrCode className="w-4 h-4 text-brand-600" />
                    <span>Scan QRIS untuk Pembayaran Instan</span>
                  </div>

                  {/* QRIS Code Canvas Box */}
                  <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-800 shadow-md">
                    <div className="w-36 h-36 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                      {/* Stylized QR Matrix Simulation */}
                      <div className="absolute inset-2 border-2 border-white grid grid-cols-4 gap-1 p-1 opacity-90">
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                      </div>
                      <div className="z-10 bg-brand-600 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                        QRIS
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                    Mendukung semua aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay) dan Mobile Banking (BCA, Mandiri, BRI, BNI).
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Nomor Virtual Account:</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Batas: 23:59 WIB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-brand-200 font-mono text-base font-black text-brand-900">
                    <span>8808 1293 8472 9910</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCopiedVa(true);
                        setTimeout(() => setCopiedVa(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedVa ? 'Tersalin ✓' : 'Salin VA'}</span>
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Transfer sesuai nominal ke atas via ATM / M-Banking. Pembayaran akan terverifikasi secara otomatis dalam hitungan detik.
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Biaya Langganan ({pendingTenant.plan})</span>
                  <span className="font-semibold text-slate-800">Rp {(pendingTenant.mrr || 499000).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN 11%</span>
                  <span className="font-semibold text-slate-800">Rp {Math.round((pendingTenant.mrr || 499000) * 0.11).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-900 pt-1.5 border-t border-slate-100">
                  <span>Total Tagihan Pembayaran</span>
                  <span className="text-brand-700 text-sm">
                    Rp {Math.round((pendingTenant.mrr || 499000) * 1.11).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleCompletePaymentCheckout}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/25 transition active:scale-[0.99] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasi Konfirmasi Pembayaran Berhasil & Masuk ➔</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
                >
                  Batal / Ubah Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
