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
import { LandingPage } from './pages/Marketing/LandingPage';
import { Order } from './types';

const VALID_TABS = [
  'dashboard', 'pos', 'orders', 'production', 'delivery',
  'customers', 'inventory', 'payroll', 'finance', 'reports',
  'settings', 'super-admin', 'customer-portal'
];

const MainApp: React.FC = () => {
  const { 
    isAuthenticated, currentRole, currentOutlet, 
    currentTenant, impersonatedTenant, exitImpersonation,
    login
  } = useApp();

  // Helper to parse URL hash or pathname
  const getInitialTab = (): string => {
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    if (VALID_TABS.includes(hash)) return hash;
    return 'dashboard';
  };

  const getInitialUnauthView = (): 'landing' | 'login' | 'register' => {
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    if (hash === 'login') return 'login';
    if (hash === 'register') return 'register';
    return 'landing';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);

  // Marketing & Auth state
  const [unauthView, setUnauthView] = useState<'landing' | 'login' | 'register'>(getInitialUnauthView);
  const [selectedPlan, setSelectedPlan] = useState<any>('trial');

  // Receipt & Tag Modals State
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [tagOrder, setTagOrder] = useState<Order | null>(null);

  // WhatsApp Drawer State
  const [showWhatsAppDrawer, setShowWhatsAppDrawer] = useState<boolean>(false);

  // Sync URL hash when unauthenticated state changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (unauthView === 'landing' && currentHash !== '' && currentHash !== 'landing') {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (unauthView === 'login' && currentHash !== 'login') {
        window.location.hash = '#login';
      } else if (unauthView === 'register' && currentHash !== 'register') {
        window.location.hash = '#register';
      }
    }
  }, [unauthView, isAuthenticated]);

  // Sync URL hash when authenticated tab changes
  React.useEffect(() => {
    if (isAuthenticated) {
      const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (currentHash !== activeTab) {
        window.location.hash = `#${activeTab}`;
      }
    }
  }, [activeTab, isAuthenticated]);

  // Listen to browser Back/Forward navigation (hashchange & popstate)
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (!isAuthenticated) {
        if (hash === 'login') setUnauthView('login');
        else if (hash === 'register') setUnauthView('register');
        else setUnauthView('landing');
      } else {
        if (VALID_TABS.includes(hash)) {
          setActiveTab(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [isAuthenticated]);

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

  // If user is not logged in, show Landing Page or Login Portal
  if (!isAuthenticated) {
    if (unauthView === 'landing') {
      return (
        <LandingPage
          onOpenLogin={(view, plan) => {
            const nextView = view || 'login';
            setUnauthView(nextView);
            window.location.hash = `#${nextView}`;
            if (plan) setSelectedPlan(plan);
          }}
          onExploreDemo={(role) => {
            login(role || 'tenant_owner');
          }}
        />
      );
    }
    return (
      <LoginPortal
        initialView={unauthView}
        defaultPlan={selectedPlan}
        onBackToLanding={() => {
          setUnauthView('landing');
          window.location.hash = '';
          window.history.replaceState(null, '', window.location.pathname);
        }}
      />
    );
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
