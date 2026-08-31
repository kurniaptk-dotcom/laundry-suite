import React, { useState, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AdminTabType } from './pages/SuperAdmin/SuperAdminPortal';
import { Order } from './types';

// Lazy Loaded Pages (Code Splitting for Optimal Performance)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const POS = lazy(() => import('./pages/Operations/POS').then(m => ({ default: m.POS })));
const OrderList = lazy(() => import('./pages/Operations/OrderList').then(m => ({ default: m.OrderList })));
const ProductionKanban = lazy(() => import('./pages/Operations/ProductionKanban').then(m => ({ default: m.ProductionKanban })));
const DeliveryManagement = lazy(() => import('./pages/Delivery/DeliveryManagement').then(m => ({ default: m.DeliveryManagement })));
const CustomerCRM = lazy(() => import('./pages/Customers/CustomerCRM').then(m => ({ default: m.CustomerCRM })));
const InventoryManagement = lazy(() => import('./pages/Inventory/InventoryManagement').then(m => ({ default: m.InventoryManagement })));
const PayrollHR = lazy(() => import('./pages/People/PayrollHR').then(m => ({ default: m.PayrollHR })));
const FinanceAccounting = lazy(() => import('./pages/Finance/FinanceAccounting').then(m => ({ default: m.FinanceAccounting })));
const ReportsAnalytics = lazy(() => import('./pages/Reports/ReportsAnalytics').then(m => ({ default: m.ReportsAnalytics })));
const SuperAdminPortal = lazy(() => import('./pages/SuperAdmin/SuperAdminPortal').then(m => ({ default: m.SuperAdminPortal })));
const CustomerTrackingPWA = lazy(() => import('./pages/CustomerPortal/CustomerTrackingPWA').then(m => ({ default: m.CustomerTrackingPWA })));
const OutletSettings = lazy(() => import('./pages/Settings/OutletSettings').then(m => ({ default: m.OutletSettings })));
const LoginPortal = lazy(() => import('./pages/Auth/LoginPortal').then(m => ({ default: m.LoginPortal })));
const LandingPage = lazy(() => import('./pages/Marketing/LandingPage').then(m => ({ default: m.LandingPage })));

// Lazy Loaded Modals & Drawers
const ThermalReceiptModal = lazy(() => import('./components/modals/ThermalReceiptModal').then(m => ({ default: m.ThermalReceiptModal })));
const GarmentTagModal = lazy(() => import('./components/modals/GarmentTagModal').then(m => ({ default: m.GarmentTagModal })));
const WhatsAppSimulatorDrawer = lazy(() => import('./components/modals/WhatsAppSimulatorDrawer').then(m => ({ default: m.WhatsAppSimulatorDrawer })));
const OnboardingWizard = lazy(() => import('./components/onboarding/OnboardingWizard').then(m => ({ default: m.OnboardingWizard })));

// Ultra Sleek Brand Loading Skeleton Fallback
const PageLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4 animate-in fade-in duration-200">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 font-black text-base tracking-wider animate-bounce">
        LS
      </div>
      <div className="absolute -inset-2 rounded-3xl border-2 border-brand-500/20 border-t-brand-600 animate-spin pointer-events-none" />
    </div>
    <div className="text-center space-y-1">
      <p className="text-xs font-black text-slate-800 tracking-wide uppercase">Memuat Modul...</p>
      <p className="text-[10px] text-slate-400">Sinkronisasi data Laundry Suite</p>
    </div>
  </div>
);

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

const getPathInfo = (): { tab: string; subTab: AdminTabType } => {
  const parts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
  const rawTab = parts[0] || '';
  const tab = TAB_ALIAS_MAP[rawTab] || rawTab;
  let subTab: AdminTabType = 'overview';
  if (parts[1]) {
    const rawSub = parts[1].replace('-', '_') as AdminTabType;
    if (['overview', 'tenants', 'subscriptions', 'billing', 'usage', 'adoption', 'at_risk', 'health', 'support'].includes(rawSub)) {
      subTab = rawSub;
    }
  }
  return { tab, subTab };
};

const MainApp: React.FC = () => {
  const { 
    isAuthenticated, currentRole, currentOutlet, 
    currentTenant, impersonatedTenant, exitImpersonation,
    login
  } = useApp();

  const initialPath = getPathInfo();

  const getInitialTab = (): string => {
    if (VALID_TABS.includes(initialPath.tab)) return initialPath.tab;
    return 'dashboard';
  };

  const getInitialUnauthView = (): 'landing' | 'login' | 'register' | 'track' => {
    const slug = initialPath.tab;
    if (slug === 'login') return 'login';
    if (slug === 'register') return 'register';
    if (slug === 'customer-portal' || slug === 'track' || slug === 'lacak') return 'track';
    return 'landing';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [adminSubTab, setAdminSubTab] = useState<AdminTabType>(initialPath.subTab);
  const [unauthView, setUnauthView] = useState<'landing' | 'login' | 'register' | 'track'>(getInitialUnauthView);
  const [selectedPlan, setSelectedPlan] = useState<any>('trial');

  // Receipt & Tag Modals State
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [tagOrder, setTagOrder] = useState<Order | null>(null);

  // WhatsApp Drawer State
  const [showWhatsAppDrawer, setShowWhatsAppDrawer] = useState<boolean>(false);

  // Onboarding Wizard State (Only triggered ONCE right after initial registration)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Auto trigger Onboarding Wizard only for freshly registered tenants
  React.useEffect(() => {
    if (isAuthenticated && currentRole === 'tenant_owner' && currentTenant && !impersonatedTenant) {
      const isJustRegistered = sessionStorage.getItem('ls_trigger_onboarding') === 'true';
      const isDone = localStorage.getItem(`ls_onboarding_done_${currentTenant.id}`);
      if (isJustRegistered && !isDone && currentTenant.id !== 't-demo') {
        setShowOnboarding(true);
        sessionStorage.removeItem('ls_trigger_onboarding');
      }
    }
  }, [isAuthenticated, currentRole, currentTenant?.id, impersonatedTenant]);

  // Initial route handling
  React.useEffect(() => {
    const { tab, subTab } = getPathInfo();
    if (tab === 'super-admin') {
      if (isAuthenticated && currentRole === 'super_admin') {
        setActiveTab('super-admin');
        setAdminSubTab(subTab);
      } else {
        setUnauthView('login');
      }
    } else if (VALID_TABS.includes(tab) && tab !== 'customer-portal') {
      if (isAuthenticated) {
        setActiveTab(tab);
      } else {
        setUnauthView('landing');
      }
    } else if (tab === 'login') {
      setUnauthView('login');
    } else if (tab === 'register') {
      setUnauthView('register');
    } else if (tab === 'customer-portal' || tab === 'track' || tab === 'lacak') {
      setUnauthView('track');
    }
  }, []);

  // Sync clean URL pathname when unauthenticated view changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      const { tab } = getPathInfo();
      if (tab === 'super-admin' || (VALID_TABS.includes(tab) && tab !== 'customer-portal')) {
        return; // Handled by direct access
      }
      if (unauthView === 'landing') {
        if (tab !== '') {
          window.history.pushState(null, '', '/');
        }
      } else if (unauthView === 'login') {
        if (tab !== 'login') {
          window.history.pushState(null, '', '/login');
        }
      } else if (unauthView === 'register') {
        if (tab !== 'register') {
          window.history.pushState(null, '', '/register');
        }
      } else if (unauthView === 'track') {
        if (tab !== 'track' && tab !== 'customer-portal') {
          window.history.pushState(null, '', '/track');
        }
      }
    }
  }, [unauthView, isAuthenticated]);

  // Sync clean URL pathname when authenticated tab or adminSubTab changes
  React.useEffect(() => {
    if (isAuthenticated) {
      const { tab, subTab } = getPathInfo();
      let targetPath = activeTab === 'dashboard' ? '/dashboard' : `/${activeTab}`;
      if (activeTab === 'super-admin' && adminSubTab !== 'overview') {
        targetPath = `/super-admin/${adminSubTab.replace('_', '-')}`;
      }
      if (tab !== activeTab || (activeTab === 'super-admin' && subTab !== adminSubTab)) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, [activeTab, adminSubTab, isAuthenticated]);

  // Listen to browser Back/Forward navigation (popstate)
  React.useEffect(() => {
    const handlePopState = () => {
      const { tab, subTab } = getPathInfo();
      if (tab === 'super-admin') {
        login('super_admin');
        setActiveTab('super-admin');
        setAdminSubTab(subTab);
      } else if (!isAuthenticated) {
        if (tab === 'login') setUnauthView('login');
        else if (tab === 'register') setUnauthView('register');
        else if (tab === 'customer-portal' || tab === 'track' || tab === 'lacak') setUnauthView('track');
        else setUnauthView('landing');
      } else {
        if (VALID_TABS.includes(tab)) {
          setActiveTab(tab);
        } else if (tab === '' || tab === 'dashboard') {
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
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <CustomerTrackingPWA />
        </Suspense>
      );
    }
    if (unauthView === 'landing') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
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
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <LoginPortal
          initialView={unauthView === 'register' ? 'register' : 'login'}
          defaultPlan={selectedPlan}
          onBackToLanding={() => {
            setUnauthView('landing');
            window.history.pushState(null, '', '/');
          }}
        />
      </Suspense>
    );
  }

  const handleOrderCreated = (newOrder: Order) => {
    setReceiptOrder(newOrder);
    setActiveTab('orders');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setActiveTab} 
            onOpenNewOrder={() => setActiveTab('pos')} 
            onOpenOnboarding={() => setShowOnboarding(true)}
          />
        );
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
        return (
          <SuperAdminPortal 
            activeTab={adminSubTab} 
            onTabChange={(tab) => {
              setAdminSubTab(tab);
            }} 
          />
        );
      case 'customer-portal':
        return <CustomerTrackingPWA />;
      default:
        return (
          <Dashboard 
            onNavigate={setActiveTab} 
            onOpenNewOrder={() => setActiveTab('pos')} 
            onOpenOnboarding={() => setShowOnboarding(true)}
          />
        );
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
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          adminSubTab={adminSubTab} 
          setAdminSubTab={setAdminSubTab} 
        />

        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header 
            onOpenNewOrder={() => setActiveTab('pos')}
            onOpenWhatsApp={() => setShowWhatsAppDrawer(true)}
          />

          <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            <Suspense fallback={<PageLoadingFallback />}>
              {renderActiveScreen()}
            </Suspense>
          </main>
        </div>
      </div>

      {/* Modals & Setup Wizard with Suspense */}
      <Suspense fallback={null}>
        {/* Interactive Onboarding Setup Wizard & Welcome Screen */}
        {showOnboarding && (
          <OnboardingWizard
            onFinish={(target) => {
              setShowOnboarding(false);
              setActiveTab(target);
            }}
            onClose={() => setShowOnboarding(false)}
          />
        )}

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
      </Suspense>
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
