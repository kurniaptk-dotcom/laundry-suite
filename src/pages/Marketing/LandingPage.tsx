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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* ======================================================== */}
      {/* 1. TOP ANNOUNCEMENT TICKER BANNER                       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-brand-600 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-inner">
        <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
          Update v2.4 Live
        </span>
        <span>Kini Dilengkapi Fitur Barcode Tag Pakaian, Laporan Laba Rugi ERP & WhatsApp Gateway Otomatis!</span>
        <button 
          onClick={() => onOpenLogin('register', 'growth')}
          className="underline hover:text-sky-200 ml-1 flex items-center gap-0.5 font-extrabold"
        >
          Coba Gratis 14 Hari ➔
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. STICKY HEADER & NAVBAR                                */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 font-black text-lg">
              LS
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                <span>Laundry Suite</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-brand-500/20 text-brand-300 rounded font-bold border border-brand-400/30">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Business Operating System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#fitur" className="hover:text-brand-400 transition">Fitur Utama</a>
            <a href="#solusi" className="hover:text-brand-400 transition">Solusi Bisnis</a>
            <a href="#kalkulator" className="hover:text-brand-400 transition">Kalkulator Hemat</a>
            <a href="#harga" className="hover:text-brand-400 transition">Paket & Harga</a>
            <a href="#faq" className="hover:text-brand-400 transition">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLogin('login')}
              className="px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition"
            >
              Masuk Portal
            </button>

            <button
              onClick={() => onOpenLogin('register', 'growth')}
              className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs font-black rounded-xl shadow-lg shadow-brand-600/30 transition transform active:scale-95 flex items-center gap-1.5"
            >
              <span>Daftar Gratis 14 Hari</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>


      {/* ======================================================== */}
      {/* 3. HERO SECTION (HIGH IMPACT)                           */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-24 px-6">
        {/* Glow Spheres Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-600/20 via-sky-500/15 to-purple-600/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-sky-300 text-xs font-bold shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Software Kasir & Sistem Operasi Laundry Multi-Outlet Terlengkap di Indonesia</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Satu Platform Pintar untuk Mengelola <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-brand-300 to-indigo-400 bg-clip-text text-transparent">
              Seluruh Operasional Bisnis Laundry
            </span> Anda
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Tinggalkan nota manual kertas, risiko baju tertukar, dan komplain pelanggan. 
            Kelola kasir POS timbangan kg, alur stasiun cuci uap, armada kurir jemput, notifikasi WhatsApp otomatis, hingga rekap laba rugi dalam satu genggaman.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenLogin('register', 'growth')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white rounded-2xl text-sm font-black shadow-2xl shadow-brand-600/40 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Mulai Uji Coba Gratis 14 Hari</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExploreDemo('tenant_owner')}
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white rounded-2xl text-sm font-bold border border-slate-700 transition flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
              <span>Coba Demo Interaktif Langsung</span>
            </button>
          </div>

          {/* Social Proof Stars */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 max-w-xl mx-auto">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span>★★★★★</span>
              <span className="text-slate-200">4.9 / 5.0</span>
            </div>
            <div>•</div>
            <div>Dipercaya <strong>420+ Pengusaha Laundry</strong></div>
            <div>•</div>
            <div className="text-emerald-400 font-bold">Tanpa Kontrak Mengikat</div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE APP SHOWCASE PREVIEW TABS                    */}
        {/* ======================================================== */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-2 sm:p-4 shadow-2xl backdrop-blur-xl space-y-4">
            
            {/* Tab Switcher for Showcase */}
            <div className="flex items-center justify-center gap-2 flex-wrap pb-2 border-b border-slate-800">
              {[
                { key: 'dashboard', label: '📊 Dashboard Owner (Multi-Cabang)' },
                { key: 'pos', label: '🛒 Kasir POS & Struk Thermal' },
                { key: 'kanban', label: '🧺 Kanban Produksi & QR Bag' },
                { key: 'pwa', label: '📱 PWA Pelanggan & Kurir' },
                { key: 'superadmin', label: '👑 SaaS Platform Admin' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActivePreviewTab(t.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                    activePreviewTab === t.key
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Interactive Preview Viewport */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 min-h-[380px] flex flex-col justify-between">
              
              {activePreviewTab === 'dashboard' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-gradient-to-r from-blue-950 to-slate-900 rounded-2xl border border-blue-900">
                    <div>
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wide">Business Operations Dashboard</span>
                      <h3 className="text-lg font-black text-white">Laundry Bersih Jaya (3 Cabang Aktif)</h3>
                      <p className="text-xs text-blue-200">Omzet Konsolidasi: <strong>Rp 1.053.100</strong> • SLA Ketepatan: <strong>98.6%</strong></p>
                    </div>
                    <button onClick={() => onExploreDemo('tenant_owner')} className="px-4 py-2 bg-white text-slate-950 font-bold rounded-xl text-xs self-start">
                      Buka Live Demo ➔
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block">Outlet Tebet (Pusat)</span>
                      <span className="text-base font-black text-white mt-1 block">Rp 351.600 (5 Order)</span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-brand-500 h-full w-[45%]" />
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block">Outlet Bintaro Sektor 7</span>
                      <span className="text-base font-black text-white mt-1 block">Rp 421.500 (6 Order)</span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-sky-500 h-full w-[35%]" />
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block">Outlet Galaxy Bekasi</span>
                      <span className="text-base font-black text-white mt-1 block">Rp 280.000 (4 Order)</span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-purple-500 h-full w-[20%]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'pos' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-emerald-300">Fast POS Cashier with Scales & Thermal Print</h4>
                      <p className="text-xs text-slate-300">Pencatatan kiloan desimal (misal 4.8 kg), aroma parfum, kilat express 6 jam, dan cetak struk 80mm.</p>
                    </div>
                    <button onClick={() => onExploreDemo('tenant_owner')} className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs">
                      Coba Kasir ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">🧺 Cuci Setrika (Rp 10k/kg)</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">⚡ Express 6 Jam (+50%)</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">🌸 Aroma Sakura Blossom</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">💵 Laci Kasir Shift Open</div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'kanban' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-purple-950/60 rounded-2xl border border-purple-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-purple-300">Stasiun Produksi & Hierarki QR Bag</h4>
                      <p className="text-xs text-slate-300">Pakaian dibagi per kantong (BAG-01, BAG-02) dengan QR code mandiri anti-tertukar dan drag-and-drop antar mesin.</p>
                    </div>
                    <button onClick={() => onExploreDemo('tenant_owner')} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs">
                      Buka Kanban ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">1. Antrean</div>
                    <div className="p-2.5 bg-blue-950/80 rounded-xl border border-blue-800 text-blue-300">2. Cuci</div>
                    <div className="p-2.5 bg-amber-950/80 rounded-xl border border-amber-800 text-amber-300">3. Kering</div>
                    <div className="p-2.5 bg-purple-950/80 rounded-xl border border-purple-800 text-purple-300">4. Setrika</div>
                    <div className="p-2.5 bg-teal-950/80 rounded-xl border border-teal-800 text-teal-300">5. QC Pack</div>
                    <div className="p-2.5 bg-emerald-950/80 rounded-xl border border-emerald-800 text-emerald-300">6. Selesai</div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'pwa' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-sky-950/60 rounded-2xl border border-sky-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-sky-300">Mobile PWA Pelanggan & Kurir Antar Jemput</h4>
                      <p className="text-xs text-slate-300">Pelanggan bisa pesan pickup, cek live progress nota cucian, dan kurir upload foto bukti pengantaran.</p>
                    </div>
                    <button onClick={() => onExploreDemo('customer')} className="px-4 py-2 bg-sky-500 text-white font-bold rounded-xl text-xs">
                      Coba PWA Mobile ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">📍 Live Tracking Resi</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">💳 Kartu Member VIP</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">💰 Saldo Wallet Deposit</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">📸 Bukti Foto POD Kurir</div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'superadmin' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-indigo-950/60 rounded-2xl border border-indigo-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-indigo-300">SaaS Platform Admin Command Center</h4>
                      <p className="text-xs text-slate-300">Pantau metrik MRR Rp 128.5M, 391 active tenants, churn 2.1%, system health, dan support impersonation.</p>
                    </div>
                    <button onClick={() => onExploreDemo('super_admin')} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                      Buka SaaS Admin ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">📈 MRR Rp 128.5M (+12.4%)</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">🏢 428 Tenants Total</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">⚡ 100% System Uptime</div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">🛡️ Safe Impersonation</div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Laundry Suite Cloud Infrastructure</span>
                <span className="text-emerald-400 font-bold">● Production Ready v2.4</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 4. VALUE PROPOSITION: 4 PILLARS (SOLUSI MASALAH LAUNDRY) */}
      {/* ======================================================== */}
      <section id="fitur" className="py-20 px-6 bg-slate-900/50 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Solusi Lengkap & Terintegrasi</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Dibuat Khusus untuk Mengatasi Segala Kerumitan Bisnis Laundry Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Laundry Suite bukan sekadar aplikasi kasir biasa. Kami menyediakan sistem operasi bisnis laundry terpadu end-to-end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 hover:border-brand-500/50 transition group">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                🛒
              </div>
              <h3 className="text-lg font-black text-white">Kasir POS Cepat & Timbangan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pencatatan kiloan desimal akurat, katalog satuan, pilihan wangi parfum, toggle kilat 6 jam, dan cetak nota thermal 58/80mm instan.
              </p>
              <div className="text-[11px] font-bold text-brand-400 flex items-center gap-1">
                <span>Shift Laci Kasir Aktif</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 hover:border-sky-500/50 transition group">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                🏷️
              </div>
              <h3 className="text-lg font-black text-white">Hierarki QR Bag Anti-Tertukar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Order dipecah menjadi sub-kantong (BAG-01, BAG-02) ber-QR Code untuk scan mesin cuci, pengering, setrika uap, dan packing seal.
              </p>
              <div className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                <span>Garansi Cuci Ulang Rewash</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 hover:border-emerald-500/50 transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                📱
              </div>
              <h3 className="text-lg font-black text-white">WhatsApp Auto-Sender</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kirim struk digital, update progres otomatis saat pakaian selesai dicuci, dan broadcast kupon promo diskon langsung ke WhatsApp pelanggan.
              </p>
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <span>Tanpa Ribet Kirim Manual</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 hover:border-purple-500/50 transition group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                💼
              </div>
              <h3 className="text-lg font-black text-white">Payroll & Keuangan ERP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hitung gaji pokok + komisi per kg/pcs otomatis, cetak slip gaji karyawan, laporan laba rugi bulanan, dan Chart of Accounts (COA).
              </p>
              <div className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
                <span>Laba Bersih Akurat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 5. INTERACTIVE ROI CALCULATOR                            */}
      {/* ======================================================== */}
      <section id="kalkulator" className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl border border-blue-500/30 p-8 sm:p-10 shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Kalkulator Penghematan Bisnis</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Hitung Berapa Banyak Waktu & Potensi Omzet yang Bisa Anda Hemat
            </h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Simulasikan efisiensi sistem otomatis Laundry Suite terhadap cabang bisnis laundry Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders Input */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Jumlah Cabang / Outlet Laundry:</span>
                  <span className="text-sky-400 text-sm font-black font-mono">{outletsCount} Cabang</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={outletsCount}
                  onChange={(e) => setOutletsCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Rata-rata Transaksi per Cabang / Hari:</span>
                  <span className="text-sky-400 text-sm font-black font-mono">{ordersPerDay} Nota / Hari</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={200}
                  step={5}
                  value={ordersPerDay}
                  onChange={(e) => setOrdersPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="p-6 bg-slate-950/80 rounded-2xl border border-blue-400/30 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Estimasi Omzet Bulanan Bisnis:</span>
                <span className="text-2xl font-black text-white font-mono">Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 font-bold block">Waktu Hemat Admin:</span>
                  <span className="text-lg font-black text-sky-400">{timeSavedHours} Jam / Bln</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Potensi Omzet Ekstra:</span>
                  <span className="text-lg font-black text-emerald-400">+Rp {estimatedProfitBoost.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'growth')}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black text-xs shadow-lg transition"
              >
                Raih Penghematan Ini Sekarang ➔
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 6. PRICING TIERS: 3 TRANSPARENT PACKAGES                 */}
      {/* ======================================================== */}
      <section id="harga" className="py-20 px-6 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Harga Sederhana & Transparan</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Pilih Paket Sesuai Skala Bisnis Laundry Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Semua paket sudah termasuk uji coba gratis 14 hari penuh. Tanpa biaya instalasi tersembunyi.
            </p>

            {/* Billing Switcher (Monthly vs Annually) */}
            <div className="inline-flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl pt-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  billingCycle === 'monthly' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tagihan Bulanan
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  billingCycle === 'annually' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Tahunan</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-400/30">
                  Hemat 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* TIER 1: STARTER */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Starter</span>
                  <h3 className="text-xl font-black text-white">Laundry Satuan & Kiloan</h3>
                  <p className="text-xs text-slate-400">Cocok untuk 1 outlet laundry mandiri yang baru mulai berkembang.</p>
                </div>

                <div className="pt-2">
                  <div className="text-3xl font-black text-white font-mono">
                    Rp {billingCycle === 'annually' ? '159.000' : '199.000'}
                    <span className="text-xs font-normal text-slate-400"> / bulan</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  {[
                    '1 Outlet / Cabang Laundry',
                    'Kasir POS Kiloan & Satuan',
                    'Cetak Struk Thermal 58/80mm',
                    'Database Pelanggan Dasar',
                    'Laporan Omzet Harian',
                    'Shift Laci Kasir (Cash Drawer)'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'starter')}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs transition"
              >
                Pilih Starter & Coba 14 Hari
              </button>
            </div>

            {/* TIER 2: GROWTH (FEATURED) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/80 to-slate-950 border-2 border-brand-500 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-brand-500/20 transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] rounded-full uppercase tracking-wider shadow-lg">
                ⭐ Paling Populer (Rekomendasi)
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-sky-400 uppercase">Growth</span>
                  <h3 className="text-xl font-black text-white">Multi-Outlet & Produksi</h3>
                  <p className="text-xs text-slate-300">Untuk bisnis laundry 2-5 cabang dengan alur produksi & kurir.</p>
                </div>

                <div className="pt-2">
                  <div className="text-3xl font-black text-white font-mono">
                    Rp {billingCycle === 'annually' ? '399.000' : '499.000'}
                    <span className="text-xs font-normal text-slate-400"> / bulan</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
                  {[
                    'Hingga 5 Cabang / Outlet Aktif',
                    'Semua Fitur di Paket Starter',
                    'Kanban Produksi & QR Bag Tag',
                    'Logistik Kurir & Dispatch PWA',
                    'CRM Loyalty Wallet & Saldo Deposit',
                    'Manajemen Stok Bahan Baku & Alert',
                    'Garansi Cuci Ulang (Rewash Ticket)'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'growth')}
                className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-black rounded-2xl text-xs shadow-xl transition"
              >
                Pilih Growth & Coba 14 Hari
              </button>
            </div>

            {/* TIER 3: BUSINESS ENTERPRISE */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-purple-500/50 transition">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-400 uppercase">Business</span>
                  <h3 className="text-xl font-black text-white">Enterprise & Franchise</h3>
                  <p className="text-xs text-slate-400">Untuk jaringan franchise laundry skala besar dengan ERP keuangan.</p>
                </div>

                <div className="pt-2">
                  <div className="text-3xl font-black text-white font-mono">
                    Rp {billingCycle === 'annually' ? '999.000' : '1.299.000'}
                    <span className="text-xs font-normal text-slate-400"> / bulan</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  {[
                    'Unlimited Cabang / Outlet Franchise',
                    'Semua Fitur di Paket Growth',
                    'Penggajian & Komisi Otomatis (HR)',
                    'Keuangan ERP COA & Buku Besar',
                    'WhatsApp Gateway API Resmi',
                    'Business Intelligence (BI) Dashboard',
                    'Dedicated Account Manager 24/7'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenLogin('register', 'business')}
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-2xl text-xs transition"
              >
                Pilih Business & Coba 14 Hari
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 7. FAQ ACCORDION SECTION                                */}
      {/* ======================================================== */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Tanya Jawab (FAQ)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs text-slate-400">
            Punya pertanyaan lain? Tim customer success kami siap membantu Anda 24/7.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 transition cursor-pointer"
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between font-extrabold text-sm text-white">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-sky-400' : ''}`} />
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800/80 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* ======================================================== */}
      {/* 8. FINAL HIGH-CONVERSION CTA BANNER                     */}
      {/* ======================================================== */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-brand-600 to-sky-500 p-10 sm:p-14 text-white text-center space-y-6 shadow-2xl shadow-brand-600/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Siap Mengembangkan Bisnis Laundry Anda <br className="hidden sm:inline" />
            Menjadi Lebih Modern & Menguntungkan?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Bergabunglah bersama 420+ pengusaha laundry modern di seluruh Indonesia. Coba gratis 14 hari penuh tanpa resiko.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenLogin('register', 'growth')}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-blue-50 text-brand-900 rounded-2xl text-sm font-black shadow-xl transition transform active:scale-95"
            >
              Mulai Uji Coba Gratis Sekarang ➔
            </button>
            <button
              onClick={() => onExploreDemo('tenant_owner')}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 backdrop-blur-md transition"
            >
              Buka Live Demo Interaktif
            </button>
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 9. FOOTER                                                */}
      {/* ======================================================== */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
              LS
            </div>
            <div>
              <div className="font-bold text-slate-300">Laundry Suite Platform</div>
              <p className="text-[11px] text-slate-600">© 2026 PT Laundry Suite Indonesia. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#fitur" className="hover:text-slate-300">Fitur</a>
            <a href="#harga" className="hover:text-slate-300">Harga</a>
            <a href="#faq" className="hover:text-slate-300">Bantuan</a>
            <button onClick={() => onOpenLogin('login')} className="hover:text-slate-300 font-bold">
              Login Portal
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
