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

const TAB_ALIAS_MAP: Record<string, string> = {
  'admin': 'super-admin',
  'superadmin': 'super-admin',
  'track': 'customer-portal',
  'lacak': 'customer-portal',
  'crm': 'customers',
  'stok': 'inventory',
  'kasir': 'pos',
  'pesanan': 'orders',
  'order': 'orders',
  'kanban': 'production',
  'kurir': 'delivery',
  'keuangan': 'finance',
  'laporan': 'reports',
  'pengaturan': 'settings',
};

const getPathSlug = (): string => {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').split('?')[0];
  if (path) return TAB_ALIAS_MAP[path] || path;
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  if (hash) return TAB_ALIAS_MAP[hash] || hash;
  return '';
};

const MainApp: React.FC = () => {
  const { 
    isAuthenticated, currentRole, currentOutlet, 
    currentTenant, impersonatedTenant, exitImpersonation,
    login
  } = useApp();

  const getInitialTab = (): string => {
    const slug = getPathSlug();
    if (VALID_TABS.includes(slug)) return slug;
    return 'dashboard';
  };

  const getInitialUnauthView = (): 'landing' | 'login' | 'register' | 'track' => {
    const slug = getPathSlug();
    if (slug === 'login') return 'login';
    if (slug === 'register') return 'register';
    if (slug === 'customer-portal' || slug === 'track' || slug === 'lacak') return 'track';
    return 'landing';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [unauthView, setUnauthView] = useState<'landing' | 'login' | 'register' | 'track'>(getInitialUnauthView);
  const [selectedPlan, setSelectedPlan] = useState<any>('trial');

  // Receipt & Tag Modals State
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [tagOrder, setTagOrder] = useState<Order | null>(null);

  // WhatsApp Drawer State
  const [showWhatsAppDrawer, setShowWhatsAppDrawer] = useState<boolean>(false);

  // Initial route handling & auto-login for direct URL access (/super-admin, /pos, /orders, etc.)
  React.useEffect(() => {
    const slug = getPathSlug();
    if (slug === 'super-admin') {
      login('super_admin');
      setActiveTab('super-admin');
    } else if (VALID_TABS.includes(slug) && slug !== 'customer-portal') {
      if (!isAuthenticated) {
        login('tenant_owner');
      }
      setActiveTab(slug);
    }
  }, []);

  // Sync clean URL pathname when unauthenticated view changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      const slug = getPathSlug();
      if (slug === 'super-admin' || (VALID_TABS.includes(slug) && slug !== 'customer-portal')) {
        return; // Handled by direct access
      }
      if (unauthView === 'landing') {
        if (slug !== '') {
          window.history.pushState(null, '', '/');
        }
      } else if (unauthView === 'login') {
        if (slug !== 'login') {
          window.history.pushState(null, '', '/login');
        }
      } else if (unauthView === 'register') {
        if (slug !== 'register') {
          window.history.pushState(null, '', '/register');
        }
      } else if (unauthView === 'track') {
        if (slug !== 'track' && slug !== 'customer-portal') {
          window.history.pushState(null, '', '/track');
        }
      }
    }
  }, [unauthView, isAuthenticated]);

  // Sync clean URL pathname when authenticated tab changes
  React.useEffect(() => {
    if (isAuthenticated) {
      const slug = getPathSlug();
      const targetPath = activeTab === 'dashboard' ? '/dashboard' : `/${activeTab}`;
      if (slug !== activeTab) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, [activeTab, isAuthenticated]);

  // Listen to browser Back/Forward navigation (popstate)
  React.useEffect(() => {
    const handlePopState = () => {
      const slug = getPathSlug();
      if (slug === 'super-admin') {
        login('super_admin');
        setActiveTab('super-admin');
      } else if (!isAuthenticated) {
        if (slug === 'login') setUnauthView('login');
        else if (slug === 'register') setUnauthView('register');
        else if (slug === 'customer-portal' || slug === 'track' || slug === 'lacak') setUnauthView('track');
        else setUnauthView('landing');
      } else {
        if (VALID_TABS.includes(slug)) {
          setActiveTab(slug);
        } else if (slug === '' || slug === 'dashboard') {
          setActiveTab('dashboard');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated]);

  // If role is switched, update active tab
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

  // If user is not logged in, show Landing Page, Login Portal, or Customer Tracker
  if (!isAuthenticated) {
    if (unauthView === 'track') {
      return <CustomerTrackingPWA />;
    }
    if (unauthView === 'landing') {
      return (
        <LandingPage
          onOpenLogin={(view, plan) => {
            const nextView = view || 'login';
            setUnauthView(nextView);
            window.history.pushState(null, '', `/${nextView}`);
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
        initialView={unauthView === 'register' ? 'register' : 'login'}
        defaultPlan={selectedPlan}
        onBackToLanding={() => {
          setUnauthView('landing');
          window.history.pushState(null, '', '/');
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
