import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, ShoppingCart, ListOrdered, Kanban, 
  Truck, Users, Award, Ticket, Package, UserCheck, 
  DollarSign, BarChart3, Shield, Smartphone, ChevronRight,
  Sparkles, CheckCircle2, QrCode, LogOut, PieChart,
  Building2, CreditCard, Activity, Layers, AlertTriangle, Server
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, orders, deliveryTasks, inventory, logout } = useApp();

  // Badge calculations
  const pendingOrdersCount = orders.filter(o => ['received', 'washing', 'drying', 'ironing', 'packing'].includes(o.status)).length;
  const readyOrdersCount = orders.filter(o => o.status === 'ready').length;
  const pendingDeliveryCount = deliveryTasks.filter(t => t.status === 'pending' || t.status === 'assigned').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStockThreshold).length;

  // Filter navigation items based on current active role
  const isSuperAdmin = currentRole === 'super_admin';
  const isCustomer = currentRole === 'customer';
  const isCourier = currentRole === 'courier';
  const isProduction = currentRole === 'production_staff' || currentRole === 'qc_staff';
  const isCashier = currentRole === 'cashier';

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen shrink-0 sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-black tracking-wider">
          LS
        </div>
        <div>
          <div className="font-extrabold text-base tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
            Laundry Suite
          </div>
          <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
            Operating Suite for Laundry
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-4 space-y-6">
        
        {/* ================= 1. SAAS PLATFORM ADMIN DEDICATED SIDEBAR ================= */}
        {isSuperAdmin ? (
          <div className="space-y-5">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-700" />
                <span className="font-black text-xs text-purple-900">SaaS Platform Admin</span>
              </div>
              <p className="text-[10px] text-purple-700 mt-0.5">Platform Business & System Health</p>
            </div>

            {/* BUSINESS */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Business & Revenue
              </div>
              <button
                onClick={() => setActiveTab('super-admin')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'super-admin'
                    ? 'bg-purple-700 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Platform Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Tenants Management</span>
              </button>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Subscriptions & MRR</span>
              </button>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Billing & Invoices</span>
              </button>
            </div>

            {/* PRODUCT */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Product & Usage
              </div>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Usage & Platform Metrics</span>
              </button>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Feature Adoption</span>
              </button>
            </div>

            {/* CUSTOMER SUCCESS */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Customer Success
              </div>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>At-Risk & Churn</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
                  3
                </span>
              </button>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Support Desk</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black">
                  12
                </span>
              </button>
            </div>

            {/* PLATFORM HEALTH */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Infrastructure
              </div>
              <button
                onClick={() => setActiveTab('super-admin')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>System Health</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
            </div>
          </div>
        ) : isCustomer ? (
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Customer Portal
            </div>
            <button
              onClick={() => setActiveTab('customer-portal')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'customer-portal'
                  ? 'bg-brand-50 text-brand-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-4 h-4 text-brand-600" />
              <span>Lacak Cucian & Booking</span>
            </button>
          </div>
        ) : (
          <>
            {/* Main Dashboard */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-brand-50 text-brand-700 font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-brand-600" />
                  <span>Dashboard Overview</span>
                </div>
              </button>
            </div>

            {/* Operasional Module */}
            {(!isCourier) && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Operasional
                </div>
                <button
                  onClick={() => setActiveTab('pos')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'pos'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-slate-500" />
                    <span>POS / Kasir Baru</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold">POS</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'orders'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ListOrdered className="w-4 h-4 text-slate-500" />
                    <span>Daftar Order</span>
                  </div>
                  {pendingOrdersCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('production')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'production'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Kanban className="w-4 h-4 text-slate-500" />
                    <span>Kanban Produksi & QC</span>
                  </div>
                  {readyOrdersCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      {readyOrdersCount} Siap
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Delivery & Logistics Module */}
            {(!isProduction) && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Logistik & Kurir
                </div>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'delivery'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-slate-500" />
                    <span>Pickup & Delivery</span>
                  </div>
                  {pendingDeliveryCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 font-bold">
                      {pendingDeliveryCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Customer & CRM Module */}
            {(!isCourier && !isProduction) && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Pelanggan & CRM
                </div>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'customers'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Data Pelanggan & CRM</span>
                  </div>
                </button>
              </div>
            )}

            {/* Inventory Module */}
            {(!isCourier && !isCustomer) && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Stok & Bahan Baku
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'inventory'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span>Inventory & Suplai</span>
                  </div>
                  {lowStockCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold animate-pulse">
                      {lowStockCount} Menipis
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* HR, Attendance & Payroll */}
            {(!isCourier && !isProduction && !isCashier) && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  SDM & Penggajian
                </div>
                <button
                  onClick={() => setActiveTab('payroll')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'payroll'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-slate-500" />
                    <span>Presensi & Payroll</span>
                  </div>
                </button>
              </div>
            )}

            {/* Finance & ERP */}
            {(!isCourier && !isProduction && !isCashier) && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Keuangan & ERP
                </div>
                <button
                  onClick={() => setActiveTab('finance')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'finance'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span>Kas, Biaya & Laba Rugi</span>
                  </div>
                </button>
              </div>
            )}

            {/* Reports & BI */}
            {(!isCourier && !isProduction && !isCashier) && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Laporan & BI
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'reports'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                    <span>Analisis Performa</span>
                  </div>
                </button>
              </div>
            )}

            {/* Settings & Whitelabel */}
            {(!isCourier && !isProduction && !isCashier) && (
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                    activeTab === 'settings'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <span>Pengaturan & Whitelabel</span>
                  </div>
                </button>
              </div>
            )}

            {/* Platform Super Admin Module (Super Admin Only) */}
            {isSuperAdmin && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => setActiveTab('super-admin')}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'super-admin'
                      ? 'bg-purple-50 text-purple-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>SaaS Super Admin</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                    SaaS
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer System Status & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Laundry Suite v1.0</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition active:scale-95 shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </aside>
  );
};
