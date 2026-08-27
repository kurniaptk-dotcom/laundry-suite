import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, Building2, Store, Palette, 
  Printer, Tag, Save, Check, Plus, Trash2, 
  Sparkles, Image, ShieldCheck, Globe
} from 'lucide-react';

const BRAND_THEMES = [
  { id: 'blue', name: 'Laundry Blue (Default)', primary: '#2563EB', deep: '#1D4ED8', bg: '#EFF6FF' },
  { id: 'emerald', name: 'Fresh Emerald Eco', primary: '#059669', deep: '#047857', bg: '#ECFDF5' },
  { id: 'indigo', name: 'Premium Indigo Suite', primary: '#4F46E5', deep: '#4338CA', bg: '#EEF2FF' },
  { id: 'purple', name: 'Royal Purple Luxe', primary: '#7C3AED', deep: '#6D28D9', bg: '#F5F3FF' },
  { id: 'rose', name: 'Clean Rose Blossom', primary: '#E11D48', deep: '#BE123C', bg: '#FFF1F2' },
];

export const OutletSettings: React.FC = () => {
  const { currentTenant, currentOutlet, setCurrentTenant, setCurrentOutlet } = useApp();

  // Tenant Whitelabel Form
  const [tenantName, setTenantName] = useState(currentTenant?.name || 'Laundry Bersih Jaya');
  const [tenantCode, setTenantCode] = useState(currentTenant?.code || 'LBJ');
  const [ownerEmail, setOwnerEmail] = useState(currentTenant?.ownerEmail || 'owner@bersihjaya.id');
  const [ownerPhone, setOwnerPhone] = useState(currentTenant?.ownerPhone || '081234567890');
  const [selectedTheme, setSelectedTheme] = useState('blue');

  // Outlet Profile Form
  const [outletName, setOutletName] = useState(currentOutlet?.name || 'Outlet Tebet (Pusat)');
  const [outletAddress, setOutletAddress] = useState(currentOutlet?.address || 'Jl. Tebet Raya No. 45');
  const [outletPhone, setOutletPhone] = useState(currentOutlet?.phone || '081234567890');
  const [outletHours, setOutletHours] = useState(currentOutlet?.operationalHours || '07:00 - 21:00 WIB');

  // Thermal Receipt Customization
  const [receiptHeaderMsg, setReceiptHeaderMsg] = useState('Terima kasih atas kunjungan Anda');
  const [receiptFooterTerms, setReceiptFooterTerms] = useState('Pakaian yang tidak diambil dalam 30 hari di luar tanggung jawab kami. Tunjukkan nota saat pengambilan.');
  const [receiptPaperWidth, setReceiptPaperWidth] = useState<'80mm' | '58mm'>('80mm');
  const [autoPrintTags, setAutoPrintTags] = useState(true);

  // Services Catalog list
  const [servicesList, setServicesList] = useState(currentOutlet?.services || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    setCurrentTenant({
      ...currentTenant,
      name: tenantName,
      code: tenantCode,
      ownerEmail,
      ownerPhone,
    });

    setCurrentOutlet({
      ...currentOutlet,
      name: outletName,
      address: outletAddress,
      phone: outletPhone,
      operationalHours: outletHours,
      services: servicesList,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdateServicePrice = (index: number, newPrice: number) => {
    const updated = [...servicesList];
    updated[index].price = newPrice;
    setServicesList(updated);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in">
      {/* Title & Save Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" />
            Pengaturan Outlet & Kustomisasi Whitelabel
          </h1>
          <p className="text-xs text-slate-500">
            Kustomisasi nama usaha laundry, tema warna brand, format struk thermal 80mm/58mm, dan katalog harga.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 transition active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan Whitelabel & Outlet berhasil disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Whitelabel Branding & Theme Colors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            <Palette className="w-4 h-4 text-brand-600" />
            <span>1. Identitas Brand & Tema Warna Whitelabel</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Bisnis / Brand SaaS *</label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Kode Resi (Singkatan Prefix) *</label>
              <input
                type="text"
                required
                maxLength={5}
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value.toUpperCase())}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-mono uppercase font-bold"
              />
            </div>
          </div>

          {/* Color Palettes Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">Pilihan Tema Warna Antarmuka (Whitelabel)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BRAND_THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                    selectedTheme === theme.id ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: theme.primary }} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{theme.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{theme.primary}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Outlet Branch Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>2. Informasi Cabang / Outlet Aktif ({currentOutlet.name})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Cabang / Outlet *</label>
              <input
                type="text"
                required
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">No. Telepon / Hotline WhatsApp *</label>
              <input
                type="tel"
                required
                value={outletPhone}
                onChange={(e) => setOutletPhone(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Alamat Lengkap Outlet *</label>
              <textarea
                required
                rows={2}
                value={outletAddress}
                onChange={(e) => setOutletAddress(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Jam Operasional</label>
              <input
                type="text"
                value={outletHours}
                onChange={(e) => setOutletHours(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Thermal Printer & Receipt Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            <Printer className="w-4 h-4 text-brand-600" />
            <span>3. Pengaturan Printer Kasir & Struk Thermal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Ukuran Kertas Thermal Printer</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReceiptPaperWidth('80mm')}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    receiptPaperWidth === '80mm' ? 'bg-brand-50 border-brand-600 text-brand-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  80 mm (Standar POS)
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptPaperWidth('58mm')}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    receiptPaperWidth === '58mm' ? 'bg-brand-50 border-brand-600 text-brand-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  58 mm (Mini Portable)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-800">Cetak Stiker Tag Otomatis</div>
                <div className="text-[10px] text-slate-500">Tampilkan prompt cetak stiker tag label pakaian setelah POS</div>
              </div>
              <input
                type="checkbox"
                checked={autoPrintTags}
                onChange={(e) => setAutoPrintTags(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Catatan Syarat & Ketentuan di Footer Struk</label>
            <textarea
              rows={2}
              value={receiptFooterTerms}
              onChange={(e) => setReceiptFooterTerms(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Section 4: Outlet Pricing Catalog */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            <Tag className="w-4 h-4 text-purple-600" />
            <span>4. Katalog Tarif Layanan Cabang Ini</span>
          </div>

          <div className="space-y-3">
            {servicesList.map((srv, idx) => (
              <div key={srv.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-800">{srv.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    Kategori: {srv.category} • Satuan: /{srv.unit} • SLA: {srv.durationHours} Jam
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Rp</span>
                  <input
                    type="number"
                    value={srv.price}
                    onChange={(e) => handleUpdateServicePrice(idx, parseFloat(e.target.value) || 0)}
                    className="w-28 p-1.5 text-right font-extrabold text-slate-900 border border-slate-300 rounded-lg bg-white"
                  />
                  <span className="text-slate-400 text-[11px]">/{srv.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
