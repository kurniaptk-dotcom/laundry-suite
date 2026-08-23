import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/Operations/POS';
import { OrderList } from './pages/Operations/OrderList';
import { ProductionKanban } from './pages/Operations/ProductionKanban';
import { DeliveryManagement } from './pages/Delivery/DeliveryManagement';
import { CustomerCRM } from './pages/Customers/CustomerCRM';
import { InventoryManagement } from './pages/Inventory/InventoryManagement';
import { PayrollHR } from './pages/People/PayrollHR';
import { FinanceAccounting } from './pages/Finance/FinanceAccounting';
import { ReportsAnalytics } from './pages/Reports/ReportsAnalytics';
import { SuperAdminPortal } from './pages/SuperAdmin/SuperAdminPortal';
import { CustomerTrackingPWA } from './pages/CustomerPortal/CustomerTrackingPWA';
import { OutletSettings } from './pages/Settings/OutletSettings';
import { LoginPortal } from './pages/Auth/LoginPortal';
import { ThermalReceiptModal } from './components/modals/ThermalReceiptModal';
import { GarmentTagModal } from './components/modals/GarmentTagModal';
import { WhatsAppSimulatorDrawer } from './components/modals/WhatsAppSimulatorDrawer';
import { Order } from './types';

const MainApp: React.FC = () => {
  const { 
    isAuthenticated, currentRole, currentOutlet, 
    currentTenant, impersonatedTenant, exitImpersonation 
  } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Receipt & Tag Modals State
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [tagOrder, setTagOrder] = useState<Order | null>(null);

  // WhatsApp Drawer State
  const [showWhatsAppDrawer, setShowWhatsAppDrawer] = useState<boolean>(false);

  // If role is switched to customer, redirect tab to customer portal
  React.useEffect(() => {
    if (currentRole === 'customer') {
      setActiveTab('customer-portal');
    } else if (currentRole === 'super_admin') {
      setActiveTab('super-admin');
    } else if (currentRole === 'courier') {
      setActiveTab('delivery');
    } else if (currentRole === 'production_staff' || currentRole === 'qc_staff') {
      setActiveTab('production');
    }
  }, [currentRole]);

  // If user is not logged in, show the Login Portal
  if (!isAuthenticated) {
    return <LoginPortal />;
  }

  const handleOrderCreated = (newOrder: Order) => {
    setReceiptOrder(newOrder);
    setActiveTab('orders');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} onOpenNewOrder={() => setActiveTab('pos')} />;
      case 'pos':
        return <POS onOrderCreated={handleOrderCreated} />;
      case 'orders':
        return <OrderList onPrintReceipt={(order) => setReceiptOrder(order)} onPrintTag={(order) => setTagOrder(order)} />;
      case 'production':
        return <ProductionKanban />;
      case 'delivery':
        return <DeliveryManagement />;
      case 'customers':
        return <CustomerCRM />;
      case 'inventory':
        return <InventoryManagement />;
      case 'payroll':
        return <PayrollHR />;
      case 'finance':
        return <FinanceAccounting />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <OutletSettings />;
      case 'super-admin':
        return <SuperAdminPortal />;
      case 'customer-portal':
        return <CustomerTrackingPWA />;
      default:
        return <Dashboard onNavigate={setActiveTab} onOpenNewOrder={() => setActiveTab('pos')} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-slate-800 overflow-hidden font-sans">
      {/* Support Impersonation Warning Banner */}
      {impersonatedTenant && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-50 animate-in slide-in-from-top shrink-0 border-b border-amber-500">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>
              Viewing as <strong className="underline">{impersonatedTenant.name}</strong> [{impersonatedTenant.plan.toUpperCase()}] — Support Impersonation Mode (Read Only)
            </span>
          </div>
          <button
            onClick={exitImpersonation}
            className="px-3.5 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold transition shadow-xs flex items-center gap-1"
          >
            <span>✕ Keluar dari Impersonation (Kembali ke SaaS Admin)</span>
          </button>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header 
            onOpenNewOrder={() => setActiveTab('pos')}
            onOpenWhatsApp={() => setShowWhatsAppDrawer(true)}
          />

          <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            {renderActiveScreen()}
          </main>
        </div>
      </div>

      {/* Thermal Receipt Print Modal */}
      {receiptOrder && (
        <ThermalReceiptModal
          order={receiptOrder}
          outlet={currentOutlet}
          tenant={currentTenant}
          onClose={() => setReceiptOrder(null)}
        />
      )}

      {/* Garment Tag Label Sticker (50x30mm) Print Modal */}
      {tagOrder && (
        <GarmentTagModal
          order={tagOrder}
          outlet={currentOutlet}
          tenant={currentTenant}
          onClose={() => setTagOrder(null)}
        />
      )}

      {/* WhatsApp Automation Simulator Drawer */}
      <WhatsAppSimulatorDrawer
        isOpen={showWhatsAppDrawer}
        onClose={() => setShowWhatsAppDrawer(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
