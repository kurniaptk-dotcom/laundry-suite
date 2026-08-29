import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Play, Star, 
  ShieldCheck, Smartphone, Truck, Users, BarChart3, 
  Layers, ChevronRight, Zap, Building2, Clock, 
  Check, HelpCircle, Phone, MessageSquare, ChevronDown,
  ShoppingBag, Shirt, DollarSign, Wallet, Award,
  Flame, Lock, ArrowUpRight, Plus, Eye
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: (initialView?: 'login' | 'register', defaultPlan?: 'starter' | 'growth' | 'business') => void;
  onExploreDemo: (role?: 'tenant_owner' | 'customer' | 'super_admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onExploreDemo }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'pos' | 'kanban' | 'pwa' | 'superadmin'>('dashboard');

  // ROI Calculator State
  const [outletsCount, setOutletsCount] = useState<number>(2);
  const [ordersPerDay, setOrdersPerDay] = useState<number>(60);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // ROI Calculations
  const monthlyRevenue = outletsCount * ordersPerDay * 30 * 25000;
  const timeSavedHours = outletsCount * 18;
  const estimatedProfitBoost = Math.round(monthlyRevenue * 0.18);

  const FAQS = [
    {
      q: 'Apakah Laundry Suite memerlukan perangkat kasir khusus yang mahal?',
      a: 'Tidak sama sekali. Laundry Suite berbasis cloud dan responsif untuk semua perangkat. Anda dapat menggunakan smartphone Android/iOS, tablet, laptop, ataupun komputer kasir yang sudah Anda miliki.'
    },
    {
      q: 'Bagaimana cara menghubungkan printer struk thermal dan timbangan?',
      a: 'Laundry Suite mendukung seluruh printer thermal bluetooth dan USB standar ukuran 58mm maupun 80mm. Anda bisa mencetak nota transaksi dan stiker barcode tag pakaian secara instan.'
    },
    {
      q: 'Apakah saya bisa mengelola banyak cabang (Multi-Outlet) dalam 1 akun?',
      a: 'Ya, tentu saja. Paket Growth mendukung hingga 5 cabang dan paket Business mendukung cabang tanpa batas. Pemilik dapat melihat omzet konsolidasi seluruh cabang maupun performa outlet perorangan.'
    },
    {
      q: 'Apakah pelanggan saya bisa memantau proses cucian mereka sendiri?',
      a: 'Ya! Pelanggan Anda mendapatkan akses Customer PWA (Web App) tanpa perlu download di PlayStore. Mereka dapat melacak status antrean, melihat kartu membership, saldo deposit wallet, hingga memesan pickup delivery.'
    },
    {
      q: 'Apakah ada biaya tambahan untuk notifikasi WhatsApp otomatis?',
      a: 'Tidak ada biaya tersembunyi dari Laundry Suite. Fitur WhatsApp Auto-Sender terintegrasi langsung untuk mengirim nota digital, notifikasi cucian selesai, dan broadcast promosi.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ======================================================== */}
      {/* 1. TOP ANNOUNCEMENT TICKER BANNER                       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white text-center py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2">
        <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
          Baru v2.4
        </span>
        <span>Fitur Barcode Tag Pakaian, Laporan Laba Rugi ERP & WhatsApp Gateway Otomatis!</span>
        <button 
          onClick={() => onOpenLogin('register', 'growth')}
          className="underline hover:text-blue-100 ml-1 flex items-center gap-0.5 font-extrabold"
        >
          Coba Gratis 14 Hari ➔
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. STICKY HEADER & NAVBAR                                */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-3">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 font-black text-lg">
              LS
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Laundry Suite</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-bold border border-blue-200">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Business Operating System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500">
            <a href="#fitur" className="hover:text-blue-600 transition">Fitur Utama</a>
            <a href="#solusi" className="hover:text-blue-600 transition">Solusi Bisnis</a>
            <a href="#kalkulator" className="hover:text-blue-600 transition">Kalkulator Hemat</a>
            <a href="#harga" className="hover:text-blue-600 transition">Paket & Harga</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLogin('login')}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl transition"
            >
              Masuk Portal
            </button>

            <button
              onClick={() => onOpenLogin('register', 'growth')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/25 transition transform active:scale-95 flex items-center gap-1.5"
            >
              <span>Daftar Gratis 14 Hari</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>


      {/* ======================================================== */}
      {/* 3. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6 bg-gradient-to-b from-blue-50/70 via-white to-white">
        {/* Soft Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 left-0 w-56 h-56 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Software Kasir & Sistem Operasi Laundry Multi-Outlet Terlengkap di Indonesia</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Satu Platform Pintar untuk Mengelola <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 bg-clip-text text-transparent">
              Seluruh Operasional Bisnis Laundry
            </span> Anda
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Tinggalkan nota manual kertas, risiko baju tertukar, dan komplain pelanggan. 
            Kelola kasir POS timbangan kg, alur stasiun cuci uap, armada kurir jemput, notifikasi WhatsApp otomatis, hingga rekap laba rugi dalam satu genggaman.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenLogin('register', 'growth')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-600/25 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Mulai Uji Coba Gratis 14 Hari</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExploreDemo('tenant_owner')}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold border border-slate-200 shadow-sm transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span>Coba Demo Kasir POS</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <span>★★★★★</span>
              <span className="text-slate-700">4.9 / 5.0</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <div>Dipercaya <strong className="text-slate-700">420+ Pengusaha Laundry</strong></div>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="text-emerald-600 font-bold">Tanpa Kontrak Mengikat</div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE APP SHOWCASE PREVIEW                         */}
        {/* ======================================================== */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-5 shadow-xl space-y-4">
            
            {/* Tab Switcher */}
            <div className="flex items-center justify-center gap-2 flex-wrap pb-3 border-b border-slate-100">
              {[
                { key: 'dashboard', label: '📊 Dashboard Owner' },
                { key: 'pos', label: '🛒 Kasir POS' },
                { key: 'kanban', label: '🧺 Kanban Produksi' },
                { key: 'pwa', label: '📱 PWA Mobile' },
                { key: 'superadmin', label: '👑 SaaS Admin' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActivePreviewTab(t.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                    activePreviewTab === t.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Preview Viewport */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200 p-6 min-h-[340px] flex flex-col justify-between">
              
              {activePreviewTab === 'dashboard' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-white rounded-2xl border border-blue-200 shadow-sm">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-wide">Business Operations Dashboard</span>
                      <h3 className="text-lg font-black text-slate-900">Laundry Bersih Jaya (3 Cabang Aktif)</h3>
                      <p className="text-xs text-slate-500">Omzet Konsolidasi: <strong className="text-slate-900">Rp 1.053.100</strong> • SLA Ketepatan: <strong className="text-emerald-600">98.6%</strong></p>
                    </div>
                    <button onClick={() => onExploreDemo('tenant_owner')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md self-start transition">
                      Buka Live Demo ➔
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {[
                      { name: 'Outlet Tebet (Pusat)', rev: 'Rp 351.600 (5 Order)', pct: 45, color: 'bg-blue-500' },
                      { name: 'Outlet Bintaro Sektor 7', rev: 'Rp 421.500 (6 Order)', pct: 55, color: 'bg-sky-500' },
                      { name: 'Outlet Galaxy Bekasi', rev: 'Rp 280.000 (4 Order)', pct: 35, color: 'bg-indigo-500' },
                    ].map(o => (
                      <div key={o.name} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-slate-400 font-bold block">{o.name}</span>
                        <span className="text-sm font-black text-slate-900 mt-1 block">{o.rev}</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className={`${o.color} h-full rounded-full transition-all duration-500`} style={{ width: `${o.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePreviewTab === 'pos' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">⚡ Fast POS Cashier — Timbangan & Struk Thermal</h4>
                      <p className="text-xs text-slate-500 mt-1">Pencatatan kiloan desimal (4.8 kg), aroma parfum, kilat express 6 jam, cetak struk 80mm.</p>
                    </div>
                    <button onClick={() => onExploreDemo('tenant_owner')} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition">
                      Coba Kasir ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {['🧺 Cuci Setrika (Rp 10k/kg)', '⚡ Express 6 Jam (+50%)', '🌸 Aroma Sakura Blossom', '💵 Laci Kasir Shift Open'].map(f => (
                      <div key={f} className="p-3.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-700 shadow-xs">{f}</div>
                    ))}
                  </div>
                </div>
              )}

              {activePreviewTab === 'kanban' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 bg-white rounded-2xl border border-purple-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">🏷️ Stasiun Produksi & Hierarki QR Bag</h4>
                      <p className="text-xs text-slate-500 mt-1">Pakaian dibagi per kantong (BAG-01, BAG-02) dengan QR code mandiri & drag-and-drop antar mesin.</p>
                    </div>
                    <button onClick={() => onExploreDemo('tenant_owner')} className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition">
                      Buka Kanban ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                    {[
                      { s: '1. Antrean', c: 'border-slate-200 bg-white text-slate-600' },
                      { s: '2. Cuci', c: 'border-blue-200 bg-blue-50 text-blue-700' },
                      { s: '3. Kering', c: 'border-amber-200 bg-amber-50 text-amber-700' },
                      { s: '4. Setrika', c: 'border-purple-200 bg-purple-50 text-purple-700' },
                      { s: '5. QC Pack', c: 'border-teal-200 bg-teal-50 text-teal-700' },
                      { s: '6. Selesai ✓', c: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
                    ].map(st => (
                      <div key={st.s} className={`p-3 rounded-xl border font-bold ${st.c}`}>{st.s}</div>
                    ))}
                  </div>
                </div>
              )}

              {activePreviewTab === 'pwa' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 bg-white rounded-2xl border border-sky-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">📱 Mobile PWA Pelanggan & Kurir Antar Jemput</h4>
                      <p className="text-xs text-slate-500 mt-1">Pelanggan pesan pickup, cek live progress cucian, kurir upload foto bukti pengantaran.</p>
                    </div>
                    <button onClick={() => onExploreDemo('customer')} className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-md transition">
                      Coba PWA ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {['📍 Live Tracking Resi', '💳 Kartu Member VIP', '💰 Saldo Wallet Deposit', '📸 Bukti Foto POD Kurir'].map(f => (
                      <div key={f} className="p-3.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-700 shadow-xs">{f}</div>
                    ))}
                  </div>
                </div>
              )}

              {activePreviewTab === 'superadmin' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 bg-white rounded-2xl border border-indigo-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">👑 SaaS Platform Admin Command Center</h4>
                      <p className="text-xs text-slate-500 mt-1">Pantau MRR Rp 128.5M, 391 active tenants, churn 2.1%, system health, dan support impersonation.</p>
                    </div>
                    <button onClick={() => onExploreDemo('super_admin')} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition">
                      Buka SaaS Admin ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {['📈 MRR Rp 128.5M (+12.4%)', '🏢 428 Tenants Total', '⚡ 100% System Uptime', '🛡️ Safe Impersonation'].map(f => (
                      <div key={f} className="p-3.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-700 shadow-xs">{f}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
                <span>Laundry Suite Cloud Infrastructure</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Production Ready v2.4
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 4. VALUE PROPOSITION: 4 PILLARS                          */}
      {/* ======================================================== */}
      <section id="fitur" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Solusi Lengkap & Terintegrasi</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Dibuat Khusus untuk Mengatasi Segala Kerumitan Bisnis Laundry Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Laundry Suite bukan sekadar aplikasi kasir biasa. Kami menyediakan sistem operasi bisnis laundry terpadu end-to-end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {[
              {
                emoji: '🛒',
                title: 'Kasir POS Cepat & Timbangan',
                desc: 'Pencatatan kiloan desimal akurat, katalog satuan, pilihan wangi parfum, toggle kilat 6 jam, dan cetak nota thermal 58/80mm instan.',
                accent: 'blue',
                sub: 'Shift Laci Kasir Aktif'
              },
              {
                emoji: '🏷️',
                title: 'Hierarki QR Bag Anti-Tertukar',
                desc: 'Order dipecah menjadi sub-kantong (BAG-01, BAG-02) ber-QR Code untuk scan mesin cuci, pengering, setrika uap, dan packing seal.',
                accent: 'sky',
                sub: 'Garansi Cuci Ulang Rewash'
              },
              {
                emoji: '📱',
                title: 'WhatsApp Auto-Sender',
                desc: 'Kirim struk digital, update progres otomatis saat pakaian selesai dicuci, dan broadcast kupon promo diskon langsung ke WhatsApp pelanggan.',
                accent: 'emerald',
                sub: 'Tanpa Ribet Kirim Manual'
              },
              {
                emoji: '💼',
                title: 'Payroll & Keuangan ERP',
                desc: 'Hitung gaji pokok + komisi per kg/pcs otomatis, cetak slip gaji karyawan, laporan laba rugi bulanan, dan Chart of Accounts (COA).',
                accent: 'indigo',
                sub: 'Laba Bersih Akurat'
              }
            ].map((p, idx) => {
              const borderHover = p.accent === 'blue' ? 'hover:border-blue-300' : p.accent === 'sky' ? 'hover:border-sky-300' : p.accent === 'emerald' ? 'hover:border-emerald-300' : 'hover:border-indigo-300';
              const bgIcon = p.accent === 'blue' ? 'bg-blue-50' : p.accent === 'sky' ? 'bg-sky-50' : p.accent === 'emerald' ? 'bg-emerald-50' : 'bg-indigo-50';
              const textSub = p.accent === 'blue' ? 'text-blue-600' : p.accent === 'sky' ? 'text-sky-600' : p.accent === 'emerald' ? 'text-emerald-600' : 'text-indigo-600';
              return (
                <div key={idx} className={`p-6 rounded-3xl bg-white border border-slate-200 space-y-4 ${borderHover} transition group shadow-sm hover:shadow-md`}>
                  <div className={`w-12 h-12 rounded-2xl ${bgIcon} flex items-center justify-center text-xl group-hover:scale-110 transition`}>
                    {p.emoji}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                  <div className={`text-[11px] font-bold ${textSub} flex items-center gap-1`}>
                    <span>{p.sub}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 5. INTERACTIVE ROI CALCULATOR                            */}
      {/* ======================================================== */}
      <section id="kalkulator" className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-blue-200 p-8 sm:p-10 shadow-lg space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Kalkulator Penghematan Bisnis</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Hitung Berapa Banyak Waktu & Potensi Omzet yang Bisa Anda Hemat
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Simulasikan efisiensi sistem otomatis Laundry Suite terhadap cabang bisnis laundry Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Jumlah Cabang / Outlet Laundry:</span>
                  <span className="text-blue-700 text-sm font-black font-mono">{outletsCount} Cabang</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={outletsCount}
                  onChange={(e) => setOutletsCount(Number(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Rata-rata Transaksi per Cabang / Hari:</span>
                  <span className="text-blue-700 text-sm font-black font-mono">{ordersPerDay} Nota / Hari</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={200}
                  step={5}
                  value={ordersPerDay}
                  onChange={(e) => setOrdersPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Output */}
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-bold block">Estimasi Omzet Bulanan Bisnis:</span>
                <span className="text-2xl font-black text-slate-900 font-mono">Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200">
                <div>
                  <span className="text-slate-500 font-bold block">Waktu Hemat Admin:</span>
                  <span className="text-lg font-black text-blue-700">{timeSavedHours} Jam / Bln</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Potensi Omzet Ekstra:</span>
                  <span className="text-lg font-black text-emerald-600">+Rp {estimatedProfitBoost.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'growth')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-600/20 transition"
              >
                Raih Penghematan Ini Sekarang ➔
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 6. PRICING TIERS                                         */}
      {/* ======================================================== */}
      <section id="harga" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Harga Sederhana & Transparan</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Pilih Paket Sesuai Skala Bisnis Laundry Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Semua paket sudah termasuk uji coba gratis 14 hari penuh. Tanpa biaya instalasi tersembunyi.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-2xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Tagihan Bulanan
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  billingCycle === 'annually' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Tahunan</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-black border border-emerald-200">
                  Hemat 20%
                </span>
              </button>
            </div>
          </div>

          {/* 4 Pricing Cards Grid (Trial + Starter + Growth + Business) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* TIER 0: TRIAL 14 HARI */}
            <div className="p-6 rounded-3xl bg-emerald-50/50 border-2 border-emerald-500/80 flex flex-col justify-between space-y-5 relative shadow-md shadow-emerald-500/10 hover:shadow-lg transition">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm">
                🎁 14 Hari Gratis
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-extrabold text-emerald-700 uppercase">Trial Experience</span>
                  <h3 className="text-lg font-black text-slate-900">Uji Coba 14 Hari</h3>
                  <p className="text-[11px] text-slate-500">Coba seluruh fitur paket Starter secara gratis tanpa kartu kredit.</p>
                </div>

                <div className="pt-1">
                  <div className="text-2xl font-black text-emerald-700 font-mono">
                    Rp 0
                    <span className="text-xs font-normal text-slate-400"> / 14 hari</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-emerald-100">
                  {[
                    '1 Outlet / Cabang Laundry',
                    'Sama dengan Fitur Starter',
                    'Kasir POS Kiloan & Satuan',
                    'Cetak Struk Thermal 58/80mm',
                    'Database Pelanggan & Omzet',
                    'Akses Langsung Tanpa Bayar'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'trial' as any)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-600/20 transition"
              >
                Mulai Trial Gratis ➔
              </button>
            </div>

            {/* TIER 1: STARTER */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-5 hover:border-blue-300 hover:shadow-lg transition shadow-sm">
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Starter</span>
                  <h3 className="text-lg font-black text-slate-900">Laundry Satuan & Kiloan</h3>
                  <p className="text-[11px] text-slate-500">Cocok untuk 1 outlet laundry mandiri yang baru mulai berkembang.</p>
                </div>

                <div className="pt-1">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    Rp {billingCycle === 'annually' ? '159.000' : '199.000'}
                    <span className="text-xs font-normal text-slate-400"> / bulan</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  {[
                    '1 Outlet / Cabang Laundry',
                    'Kasir POS Kiloan & Satuan',
                    'Cetak Struk Thermal 58/80mm',
                    'Database Pelanggan Dasar',
                    'Laporan Omzet Harian',
                    'Shift Laci Kasir (Cash Drawer)'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="text-[11px]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'starter')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition border border-slate-200"
              >
                Pilih Starter
              </button>
            </div>

            {/* TIER 2: GROWTH (FEATURED) */}
            <div className="p-6 rounded-3xl bg-white border-2 border-blue-500 flex flex-col justify-between space-y-5 relative shadow-xl shadow-blue-500/10 transform lg:-translate-y-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm">
                ⭐ Paling Populer
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">Growth</span>
                  <h3 className="text-lg font-black text-slate-900">Multi-Outlet & Produksi</h3>
                  <p className="text-[11px] text-slate-500">Untuk bisnis laundry 2-5 cabang dengan alur produksi & kurir.</p>
                </div>

                <div className="pt-1">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    Rp {billingCycle === 'annually' ? '399.000' : '499.000'}
                    <span className="text-xs font-normal text-slate-400"> / bulan</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700 pt-3 border-t border-blue-100">
                  {[
                    'Hingga 5 Cabang / Outlet Aktif',
                    'Semua Fitur di Paket Starter',
                    'Kanban Produksi & QR Bag Tag',
                    'Logistik Kurir & Dispatch PWA',
                    'CRM Loyalty Wallet & Deposit',
                    'Manajemen Stok Bahan Baku'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-[11px]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'growth')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-lg shadow-blue-600/25 transition"
              >
                Pilih Growth
              </button>
            </div>

            {/* TIER 3: BUSINESS */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-5 hover:border-indigo-300 hover:shadow-lg transition shadow-sm">
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-indigo-500 uppercase">Business</span>
                  <h3 className="text-lg font-black text-slate-900">Enterprise & Franchise</h3>
                  <p className="text-[11px] text-slate-500">Untuk jaringan franchise laundry skala besar dengan ERP keuangan.</p>
                </div>

                <div className="pt-1">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    Rp {billingCycle === 'annually' ? '999.000' : '1.299.000'}
                    <span className="text-xs font-normal text-slate-400"> / bulan</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  {[
                    'Unlimited Cabang Franchise',
                    'Semua Fitur di Paket Growth',
                    'Penggajian & Komisi Otomatis (HR)',
                    'Keuangan ERP COA & Buku Besar',
                    'WhatsApp Gateway API Resmi',
                    'Dedicated Account Manager'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="text-[11px]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'business')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                Pilih Business
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 7. FAQ ACCORDION                                         */}
      {/* ======================================================== */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8 bg-white">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tanya Jawab (FAQ)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs text-slate-500">
            Punya pertanyaan lain? Tim customer success kami siap membantu Anda 24/7.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border transition cursor-pointer ${isOpen ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-200'}`}
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between font-extrabold text-sm text-slate-900">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-3 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-blue-200 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* ======================================================== */}
      {/* 8. FINAL CTA BANNER                                      */}
      {/* ======================================================== */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 p-10 sm:p-14 text-white text-center space-y-6 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-sky-300/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight relative z-10">
            Siap Mengembangkan Bisnis Laundry Anda <br className="hidden sm:inline" />
            Menjadi Lebih Modern & Menguntungkan?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed relative z-10">
            Bergabunglah bersama 420+ pengusaha laundry modern di seluruh Indonesia. Coba gratis 14 hari penuh tanpa resiko.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={() => onOpenLogin('register', 'growth')}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-blue-50 text-blue-700 rounded-2xl text-sm font-black shadow-xl transition transform active:scale-95"
            >
              Mulai Uji Coba Gratis Sekarang ➔
            </button>
            <button
              onClick={() => onExploreDemo('tenant_owner')}
              className="w-full sm:w-auto px-6 py-4 bg-white/15 hover:bg-white/25 text-white rounded-2xl text-sm font-bold border border-white/30 backdrop-blur-md transition"
            >
              Buka Live Demo Interaktif
            </button>
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 9. FOOTER                                                */}
      {/* ======================================================== */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              LS
            </div>
            <div>
              <div className="font-bold text-slate-700">Laundry Suite Platform</div>
              <p className="text-[11px] text-slate-400">© 2026 PT Laundry Suite Indonesia. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <a href="#fitur" className="hover:text-blue-600 transition">Fitur</a>
            <a href="#harga" className="hover:text-blue-600 transition">Harga</a>
            <a href="#faq" className="hover:text-blue-600 transition">Bantuan</a>
            <button onClick={() => onOpenLogin('login')} className="hover:text-blue-600 transition font-bold">
              Login Portal
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
