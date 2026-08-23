import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, TrendingUp, Calendar, Download, 
  Store, Weight, DollarSign, Clock, Users, ArrowUpRight
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { orders, outlets, currentTenant } = useApp();
  const [timeRange, setTimeRange] = useState('month');

  // Multi-outlet comparison
  const outletStats = outlets.map(out => {
    const outOrders = orders.filter(o => o.outletId === out.id);
    const revenue = outOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const kg = outOrders.reduce((sum, o) => sum + (o.totalWeightKg || 0), 0);

    return {
      name: out.name,
      city: out.city,
      ordersCount: outOrders.length,
      revenue,
      kg,
    };
  });

  const totalKg = orders.reduce((sum, o) => sum + (o.totalWeightKg || 0), 0);
  const totalRev = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleExportCSV = () => {
    alert('Export data laporan (CSV / Excel format) berhasil di-generate!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            Laporan Analisis & Business Intelligence (BI)
          </h1>
          <p className="text-xs text-slate-500">
            Performa omzet antar cabang, tren pengerjaan kilogram bulanan, dan pemenuhan SLA waktu cuci.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="today">Hari Ini</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">Bulan Ini (Agustus 2026)</option>
            <option value="year">Tahun 2026</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="text-xs font-semibold text-slate-500">Total Omzet Keseluruhan</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            Rp {totalRev.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+22.5% peningkatan MoM</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="text-xs font-semibold text-slate-500">Total Volume KG Dicuci</div>
          <div className="text-2xl font-extrabold text-brand-600 mt-2">
            {totalKg.toFixed(1)} <span className="text-sm font-semibold text-slate-500">Kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Rata-rata 4.8 Kg per nota order
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="text-xs font-semibold text-slate-500">SLA Ketepatan Waktu</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            98.4%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Sesuai janji estimasi selesai nota
          </div>
        </div>
      </div>

      {/* Multi-Outlet Performance Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Perbandingan Kinerja Antar Cabang / Outlet</h2>
            <p className="text-xs text-slate-500">Analisis kontribusi pendapatan dan volume cucian tiap cabang</p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xl">
            {outlets.length} Cabang Terhubung
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outletStats.map((out, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900">{out.name}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border">
                  {out.city}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Omzet Cabang:</span>
                  <span className="font-extrabold text-slate-900">
                    Rp {out.revenue.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume Pengerjaan:</span>
                  <span className="font-semibold text-brand-600">
                    {out.kg.toFixed(1)} Kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Transaksi:</span>
                  <span className="font-semibold text-slate-700">
                    {out.ordersCount} Nota
                  </span>
                </div>
              </div>

              {/* Progress visual */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-brand-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (out.revenue / (totalRev || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA & Production Bottlenecks Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Distribusi Kategori Layanan
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-medium text-slate-700">🧺 Cuci Kiloan Reguler & Express</span>
              <span className="font-bold text-slate-900">68% Volume</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-medium text-slate-700">👔 Pakaian Satuan & Jas Formal</span>
              <span className="font-bold text-slate-900">18% Volume</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-medium text-slate-700">👟 Sepatu & Tas Kulit Premium</span>
              <span className="font-bold text-slate-900">9% Volume</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-medium text-slate-700">🛋️ Bed Cover & Karpet</span>
              <span className="font-bold text-slate-900">5% Volume</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Waktu Pengerjaan per Stasiun Kerja
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-xl bg-blue-50/50">
              <span className="font-medium text-blue-950">1. Antrean Masuk & Pemilahan Bahan</span>
              <span className="font-bold text-blue-800">15 - 30 Menit</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-sky-50/50">
              <span className="font-medium text-sky-950">2. Proses Mesin Cuci + Pengering</span>
              <span className="font-bold text-sky-800">1.5 - 2 Jam</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-purple-50/50">
              <span className="font-medium text-purple-950">3. Setrika Uap Boiler + Pewangi</span>
              <span className="font-bold text-purple-800">45 Menit</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-teal-50/50">
              <span className="font-medium text-teal-950">4. QC Quality Check & Plastik Packing</span>
              <span className="font-bold text-teal-800">15 Menit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
