import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Weight, Clock, 
  TrendingUp, AlertCircle, ArrowUpRight, CheckCircle2,
  Truck, Users, Sparkles, ChevronRight, Store, ArrowDownRight,
  Banknote, Wallet, Building2, Layers, BarChart3, Activity
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenNewOrder: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenNewOrder }) => {
  const { currentTenant, currentOutlet, outlets, orders, customers, deliveryTasks, inventory, employees } = useApp();

  const isAllOutlets = currentOutlet.id === 'all';
  const tenantOutlets = outlets.filter(o => o.tenantId === currentTenant.id);

  // Metrics calculation
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalKgProcessed = orders
    .reduce((sum, o) => sum + (o.totalWeightKg || 0), 0);

  const activeOrdersCount = orders
    .filter(o => !['completed', 'cancelled'].includes(o.status)).length;

  const readyOrdersCount = orders
    .filter(o => o.status === 'ready').length;

  const pendingDeliveryCount = deliveryTasks
    .filter(t => t.status === 'pending' || t.status === 'assigned').length;

  const lowStockItems = inventory
    .filter(i => i.currentStock <= i.minStockThreshold);

  // Multi-outlet comparison mock data
  const OUTLET_PERFORMANCE = [
    { name: 'Outlet Tebet (Pusat)', code: 'LBJ-TBT', revenue: 351600, orders: 5, sla: '98.8%', status: 'Optimal', share: 45 },
    { name: 'Outlet Bintaro Sektor 7', code: 'LBJ-BIN', revenue: 421500, orders: 6, sla: '97.5%', status: 'Optimal', share: 35 },
    { name: 'Outlet Galaxy Bekasi', code: 'LBJ-GLX', revenue: 280000, orders: 4, sla: '99.1%', status: 'Optimal', share: 20 },
  ];

  const consolidatedRevenue = OUTLET_PERFORMANCE.reduce((a, b) => a + b.revenue, 0);
  const consolidatedOrders = OUTLET_PERFORMANCE.reduce((a, b) => a + b.orders, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Exclusive & Premium Welcome Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0B1E48] to-[#1E3A8A] p-7 md:p-8 text-white shadow-2xl border border-blue-400/20">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Greeting, Tenant Name, Subtitle */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold tracking-wide uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Paket {currentTenant.plan.toUpperCase()} • {currentTenant.outletsCount} Cabang</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{isAllOutlets ? 'Multi-Outlet Consolidated Active' : 'Live System Active'}</span>
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-blue-200 tracking-wider uppercase">
                BUSINESS OPERATIONS DASHBOARD
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mt-0.5">
                Selamat Datang, <span className="bg-gradient-to-r from-white via-sky-100 to-blue-200 bg-clip-text text-transparent">{currentTenant.name}</span>
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-1.5 leading-relaxed">
                {isAllOutlets ? (
                  <span>
                    Tampilan Konsolidasi Seluruh Cabang (<strong className="text-white font-bold">{tenantOutlets.length} Outlet Aktif</strong>). Memantau omzet gabungan, volume pencucian, dan kinerja operasional terpadu.
                  </span>
                ) : (
                  <span>
                    Cabang Aktif: <strong className="text-white font-bold">{currentOutlet.name}</strong> ({currentOutlet.city}). Pantau seluruh transaksi kasir, antrean mesin cuci, dan pengantaran kurir secara terpadu.
                  </span>
                )}
              </p>
            </div>

            {/* Quick Metrics Pill Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200/90 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SLA Tepat Waktu: <strong className="text-white font-bold">98.6%</strong></span>
              </div>
              <div className="hidden sm:inline text-white/30">•</div>
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-sky-400" />
                <span>Cakupan: <strong className="text-white font-bold">{isAllOutlets ? `${tenantOutlets.length} Cabang` : currentOutlet.code}</strong></span>
              </div>
              <div className="hidden sm:inline text-white/30">•</div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-300">★</span>
                <span>Kepuasan Pelanggan: <strong className="text-white font-bold">4.9 / 5.0</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={onOpenNewOrder}
              className="px-5 py-3 bg-white hover:bg-blue-50 text-blue-900 text-xs font-black rounded-2xl shadow-xl shadow-black/20 hover:shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>+ Kasir POS Baru</span>
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
            </button>

            <button
              onClick={() => onNavigate('production')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 backdrop-blur-md transition flex items-center justify-center gap-2"
            >
              <span>Lihat Antrean Produksi</span>
              <ChevronRight className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid with Localized Indonesian Currency Icon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {isAllOutlets ? 'Omzet Konsolidasi Seluruh Cabang' : 'Omzet Penjualan'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            Rp {(isAllOutlets ? consolidatedRevenue : totalRevenue).toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% dari minggu lalu</span>
          </div>
        </div>

        {/* Volume KG */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Volume Cucian Diproses</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Weight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {isAllOutlets ? '72.4' : totalKgProcessed.toFixed(1)} <span className="text-base font-semibold text-slate-500">Kg</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <span>Rata-rata 4.8 Kg per transaksi</span>
          </div>
        </div>

        {/* Active In-Progress Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sedang Dikerjakan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {isAllOutlets ? consolidatedOrders : activeOrdersCount} <span className="text-base font-semibold text-slate-500">Order</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
            <span>{readyOrdersCount} order siap diambil</span>
          </div>
        </div>

        {/* Kurir & Delivery */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tugas Kurir Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {isAllOutlets ? '4' : pendingDeliveryCount} <span className="text-base font-semibold text-slate-500">Tugas</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-700 font-semibold mt-1">
            <span>Pickup & Pengantaran siap jalan</span>
          </div>
        </div>
      </div>

      {/* Multi-Outlet Consolidated Performance Card (Visible when All Outlets is selected or for Owner) */}
      {isAllOutlets && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                Perbandingan Performa Antar Cabang (Multi-Outlet Overview)
              </h2>
              <p className="text-xs text-slate-500">
                Peringkat omzet, volume, dan pemenuhan SLA dari seluruh cabang di bawah naungan {currentTenant.name}.
              </p>
            </div>
            <span className="text-xs font-bold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
              Total 3 Cabang
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {OUTLET_PERFORMANCE.map((op, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs text-slate-900">{op.name}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {op.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-black text-slate-900">
                    Rp {op.revenue.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>{op.orders} Pesanan Selesai</span>
                    <span className="font-semibold text-brand-700">SLA: {op.sla}</span>
                  </div>
                </div>

                {/* Contribution progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Kontribusi Omzet</span>
                    <span>{op.share}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: `${op.share}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Low-Stock Alert (Action-Oriented Alert) */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs">
                Peringatan: {lowStockItems.length} Bahan Baku Menipis di Bawah Stok Minimum!
              </div>
              <div className="text-[11px] text-rose-700 mt-0.5">
                {lowStockItems.map(i => `${i.name} (Sisa: ${i.currentStock} ${i.unit})`).join(' • ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
          >
            Buat Purchase Order
          </button>
        </div>
      )}

      {/* Real-time Order Stream & Active Production Stations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Transactions List (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Transaksi & Order Terbaru</h2>
              <p className="text-xs text-slate-400">Pantau status pengerjaan setiap nota laundry</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Nota / Resi</th>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">Layanan</th>
                  <th className="py-2.5 px-3 text-center">Status Cucian</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900">#{order.trackingCode}</span>
                      <div className="text-[10px] text-slate-400">{order.invoiceNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-700">{order.items[0]?.serviceName}</div>
                      <div className="text-[10px] text-slate-400">{order.totalWeightKg ? `${order.totalWeightKg} kg` : `${order.totalPcs} pcs`}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        order.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'washing' ? 'bg-sky-100 text-sky-800' :
                        order.status === 'ironing' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-extrabold text-slate-900">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Production Workstations (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Stasiun Produksi Aktif
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-2xl flex items-center justify-between border border-blue-100">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Proses Cuci & Kering</span>
                </div>
                <span className="font-extrabold text-blue-900">
                  {orders.filter(o => o.status === 'washing' || o.status === 'drying').length} antrean
                </span>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-2xl flex items-center justify-between border border-purple-100">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Setrika & Packing Uap</span>
                </div>
                <span className="font-extrabold text-purple-900">
                  {orders.filter(o => o.status === 'ironing' || o.status === 'packing').length} order
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl flex items-center justify-between border border-emerald-100">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Selesai / Siap Diambil</span>
                </div>
                <span className="font-extrabold text-emerald-900">
                  {readyOrdersCount} order
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('production')}
              className="w-full py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-extrabold transition text-center block"
            >
              Buka Layar Kanban Produksi
            </button>
          </div>

          {/* CRM & Loyalty Quick Glance */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Status Pelanggan & Loyalty
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Pelanggan Terdaftar</span>
                <span className="font-extrabold text-slate-900">{customers.length} Orang</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Member Platinum / VIP</span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full text-[10px]">
                  {customers.filter(c => c.membershipTier === 'Platinum').length} Member
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Saldo Deposit Mengendap</span>
                <span className="font-bold text-emerald-600">
                  Rp {customers.reduce((s, c) => s + c.depositBalance, 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
