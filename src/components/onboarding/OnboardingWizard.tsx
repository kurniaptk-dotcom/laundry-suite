import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Store, CheckCircle2, ArrowRight, ArrowLeft, 
  DollarSign, Shirt, Droplets, Printer, Check, ShoppingBag, 
  LayoutDashboard, ShieldCheck, Clock, MapPin, Phone
} from 'lucide-react';

interface OnboardingWizardProps {
  onFinish: (targetScreen: 'pos' | 'dashboard') => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onFinish }) => {
  const { 
    currentTenant, 
    currentOutlet, 
    setCurrentTenant, 
    setCurrentOutlet, 
    services, 
    updateService,
    perfumes,
    addPerfume
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State: Profile
  const [tenantName, setTenantName] = useState(currentTenant?.name || 'Laundry Saya');
  const [outletName, setOutletName] = useState(currentOutlet?.name || 'Outlet Pusat');
  const [outletAddress, setOutletAddress] = useState(currentOutlet?.address || 'Jl. Sudirman No. 88');
  const [outletPhone, setOutletPhone] = useState(currentOutlet?.phone || currentTenant?.ownerPhone || '081234567890');
  const [operationalHours, setOperationalHours] = useState(currentOutlet?.operationalHours || '07:00 - 21:00 WIB');

  // Step 2 State: Pricing
  const [servicePrices, setServicePrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    services.forEach(s => {
      initial[s.id] = s.price;
    });
    return initial;
  });

  // Step 3 State: Perfume & Receipt
  const [selectedPerfumes, setSelectedPerfumes] = useState<string[]>([
    'Sakura Blossom (Favorit)',
    'Lavender Dream',
    'Ocean Soft',
    'Snappy Fresh'
  ]);
  const [receiptFooter, setReceiptFooter] = useState(
    'Terima kasih atas kepercayaan Anda!\nBarang tidak diambil > 30 hari di luar tanggung jawab kami.'
  );

  const handlePriceChange = (serviceId: string, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setServicePrices(prev => ({ ...prev, [serviceId]: num }));
  };

  const handleCompleteSetup = (target: 'pos' | 'dashboard') => {
    // 1. Save Tenant & Outlet updates
    if (currentTenant) {
      setCurrentTenant({
        ...currentTenant,
        name: tenantName,
      });
    }

    if (currentOutlet) {
      setCurrentOutlet({
        ...currentOutlet,
        name: outletName,
        address: outletAddress,
        phone: outletPhone,
        operationalHours,
      });
    }

    // 2. Save modified service prices
    Object.entries(servicePrices).forEach(([id, price]) => {
      updateService(id, { price });
    });

    // 3. Mark onboarding as completed for this tenant
    localStorage.setItem(`ls_onboarding_done_${currentTenant?.id || 'default'}`, 'true');

    // 4. Navigate
    onFinish(target);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in duration-300">
        
        {/* Top Header Progress */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white font-black shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-200">
                  Panduan Setup Awal Tenant
                </span>
                <h1 className="text-xl font-black tracking-tight text-white">
                  Selamat Datang di Laundry Suite! 🎉
                </h1>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold">
              <span>Langkah {step} dari 4</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mt-6 relative z-10">
            {[
              { num: 1, title: 'Profil Outlet' },
              { num: 2, title: 'Tarif & Harga' },
              { num: 3, title: 'Parfum & Nota' },
              { num: 4, title: 'Selesai' }
            ].map(s => (
              <div key={s.num} className="space-y-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= s.num ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-white/20'}`} />
                <span className={`text-[10px] font-bold block truncate ${step >= s.num ? 'text-white' : 'text-white/50'}`}>
                  {s.num}. {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[65vh]">
          
          {/* STEP 1: PROFIL OUTLET */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right duration-200">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <Store className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <strong>Halo, {currentTenant?.ownerName || 'Pemilik Bisnis'}!</strong> Akun bisnis laundry Anda telah aktif. Konfirmasikan informasi cabang pertama Anda di bawah ini agar nota kasir tercetak dengan rapi.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Usaha Laundry
                  </label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={e => setTenantName(e.target.value)}
                    placeholder="Contoh: Berkah Laundry"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Cabang / Outlet
                  </label>
                  <input
                    type="text"
                    value={outletName}
                    onChange={e => setOutletName(e.target.value)}
                    placeholder="Contoh: Cabang Utama (Diponegoro)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Outlet
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={outletAddress}
                      onChange={e => setOutletAddress(e.target.value)}
                      placeholder="Alamat lengkap lokasi laundry"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Kasir
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={outletPhone}
                      onChange={e => setOutletPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Operasional
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={operationalHours}
                      onChange={e => setOperationalHours(e.target.value)}
                      placeholder="07:00 - 21:00 WIB"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TARIF & HARGA LAYANAN */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    Sesuaikan Tarif Cuci Outlet Anda
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kami telah menyiapkan layanan laundry populer. Anda dapat mengubah harga sesuai tarif di outlet Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {services.slice(0, 6).map(srv => (
                  <div 
                    key={srv.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:border-brand-400 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {srv.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold uppercase">{srv.unit}</span>
                        <span>• Estimasi {srv.durationHours} Jam</span>
                      </div>
                    </div>

                    <div className="relative w-32 shrink-0">
                      <span className="text-[11px] font-bold text-slate-400 absolute left-2.5 top-2.5">Rp</span>
                      <input
                        type="text"
                        value={(servicePrices[srv.id] || srv.price).toLocaleString('id-ID')}
                        onChange={e => handlePriceChange(srv.id, e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-800 text-right focus:ring-2 focus:ring-brand-500 outline-none transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PARFUM & FORMAT STRUK */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right duration-200">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-brand-600" />
                  <span>Aroma Parfum Pilihan di Kasir</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pilihan aroma wangi yang dapat dipilih kasir saat pelanggan menitipkan pakaian.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'Sakura Blossom (Favorit)',
                  'Lavender Dream',
                  'Ocean Soft',
                  'Snappy Fresh',
                  'Vanilla Sweet',
                  'Baby Soft Downy',
                  'Non-Parfum (Alergi)'
                ].map(p => {
                  const isSelected = selectedPerfumes.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPerfumes(prev => prev.filter(x => x !== p));
                        } else {
                          setSelectedPerfumes(prev => [...prev, p]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 text-brand-600" /> : <div className="w-3.5 h-3.5" />}
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-brand-600" />
                  <span>Pesan Footer Struk Thermal Kasir</span>
                </label>
                <textarea
                  rows={3}
                  value={receiptFooter}
                  onChange={e => setReceiptFooter(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* STEP 4: SELESAI & LAUNCHPAD */}
          {step === 4 && (
            <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl font-black text-slate-900">
                  🎉 Setup Selesai! Outlet Anda Siap Beroperasi
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Data outlet, daftar harga layanan, dan preferensi kasir telah berhasil disimpan. Anda dapat langsung mulai melayani pelanggan atau menjelajahi dashboard.
                </p>
              </div>

              {/* Action Buttons Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
                <button
                  onClick={() => handleCompleteSetup('pos')}
                  className="p-5 bg-gradient-to-br from-brand-600 to-blue-700 hover:from-brand-700 hover:to-blue-800 text-white rounded-2xl shadow-lg shadow-brand-600/25 flex flex-col items-center justify-center text-center group transition transform hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-extrabold text-sm mb-1 flex items-center gap-1">
                    <span>Mulai Kasir POS Baru</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </span>
                  <span className="text-[11px] text-white/80">
                    Langsung input transaksi & timbang cucian pertama
                  </span>
                </button>

                <button
                  onClick={() => handleCompleteSetup('dashboard')}
                  className="p-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg shadow-slate-900/20 flex flex-col items-center justify-center text-center group transition transform hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-extrabold text-sm mb-1 flex items-center gap-1">
                    <span>Buka Dashboard Utama</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Pantau ringkasan omzet, mesin cuci, & kurir
                  </span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/25 transition ml-auto"
            >
              <span>Lanjut: {step === 1 ? 'Atur Tarif' : step === 2 ? 'Parfum & Struk' : 'Selesai'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
};
