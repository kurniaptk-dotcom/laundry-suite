import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Tenant, Outlet, UserRole, User, Customer, Order, OrderStatus, 
  PaymentMethod, ServiceItem, Courier, DeliveryTask, 
  InventoryItem, Employee, AttendanceRecord, PayrollSlip, 
  CashAccount, ExpenseEntry, Voucher, WhatsAppMessage, PlanType 
} from '../types';
import { DatabaseEngine, DB_VERSION } from '../services/dbService';
import { SupabaseService } from '../services/supabaseService';

// Default mock services
const DEFAULT_SERVICES: ServiceItem[] = [
  { id: 'srv-1', name: 'Cuci Setrika Reguler (2 Hari)', category: 'kiloan', unit: 'kg', price: 10000, durationHours: 48, minQty: 3, description: 'Cuci bersih, wangi, setrika rapi, packing plastik seal' },
  { id: 'srv-2', name: 'Cuci Setrika Express (6 Jam)', category: 'kiloan', unit: 'kg', price: 18000, durationHours: 6, minQty: 2, description: 'Layanan kilat selesai dalam 6 jam dengan prioritas mesin' },
  { id: 'srv-3', name: 'Cuci Kering Lipat (1 Hari)', category: 'kiloan', unit: 'kg', price: 7000, durationHours: 24, minQty: 3, description: 'Hanya dicuci dan dikeringkan lalu dilipat rapi' },
  { id: 'srv-4', name: 'Bed Cover King / Jumbo', category: 'satuan', unit: 'pcs', price: 35000, durationHours: 48, description: 'Pencucian khusus bed cover tebal anti kusut & wangi tahan lama' },
  { id: 'srv-5', name: 'Kemeja Formal / Blouse Satuan', category: 'satuan', unit: 'pcs', price: 15000, durationHours: 24, description: 'Perawatan satuan dengan gantungan dan pelindung plastik' },
  { id: 'srv-6', name: 'Jas / Blazer Premium Care', category: 'satuan', unit: 'pcs', price: 45000, durationHours: 48, description: 'Dry cleaning & steam press profesional' },
  { id: 'srv-7', name: 'Sepatu Sneakers Deep Clean', category: 'sepatu_tas', unit: 'pasang', price: 40000, durationHours: 72, description: 'Pembersihan mendalam upper, midsole, dan insole deodorizing' },
  { id: 'srv-8', name: 'Karpet Bulu / Permadani (m²)', category: 'karpet_linen', unit: 'm2', price: 18000, durationHours: 72, description: 'Pencucian debu mendalam + anti tungau' },
];

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-1',
    name: 'Laundry Bisnis Utama',
    code: 'LND',
    plan: 'trial',
    status: 'active',
    mrr: 0,
    outletsCount: 1,
    ownerName: 'Pemilik Laundry',
    ownerEmail: 'owner@laundrybisnis.com',
    ownerPhone: '081234567890',
    createdAt: new Date().toISOString().slice(0, 10),
  },
];

const INITIAL_OUTLETS: Outlet[] = [
  {
    id: 'out-1',
    tenantId: 't-1',
    name: 'Outlet Pusat',
    code: 'LND-01',
    address: 'Jl. Raya Utama No. 1',
    city: 'Jakarta',
    phone: '081234567890',
    isMain: true,
    operationalHours: '07:00 - 21:00 WIB',
    services: DEFAULT_SERVICES,
  },
];

const INITIAL_CUSTOMERS: Customer[] = [];
const INITIAL_ORDERS: Order[] = [];
const INITIAL_COURIERS: Courier[] = [];
const INITIAL_DELIVERY_TASKS: DeliveryTask[] = [];
const INITIAL_INVENTORY: InventoryItem[] = [];
const INITIAL_EMPLOYEES: Employee[] = [];
const INITIAL_ACCOUNTS: CashAccount[] = [
  { id: 'acc-1', name: 'Kas Kasir Tunai (Laci)', type: 'cash', balance: 0 },
  { id: 'acc-2', name: 'Rekening Bank / QRIS', type: 'bank', balance: 0 },
];
const INITIAL_EXPENSES: ExpenseEntry[] = [];
const INITIAL_VOUCHERS: Voucher[] = [];

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  login: (role: UserRole, tenantId?: string, outletId?: string) => void;
  logout: () => void;

  // Roles & Multi-tenant state
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  tenants: Tenant[];
  currentTenant: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  outlets: Outlet[];
  currentOutlet: Outlet;
  setCurrentOutlet: (outlet: Outlet) => void;

  // Domain states
  customers: Customer[];
  orders: Order[];
  services: ServiceItem[];
  perfumes: string[];
  couriers: Courier[];
  deliveryTasks: DeliveryTask[];
  inventory: InventoryItem[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  payrollSlips: PayrollSlip[];
  cashAccounts: CashAccount[];
  expenses: ExpenseEntry[];
  vouchers: Voucher[];
  whatsappMessages: WhatsAppMessage[];
  cashierShifts: Array<{ id: string; cashierName: string; openTime: string; closeTime?: string; initialCash: number; totalCashCollected: number; status: 'open' | 'closed' }>;
  currentShift: { id: string; cashierName: string; openTime: string; closeTime?: string; initialCash: number; totalCashCollected: number; status: 'open' | 'closed' } | null;
  impersonatedTenant: Tenant | null;
  impersonateTenant: (tenantId: string) => void;
  exitImpersonation: () => void;

  // Action methods
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addPerfume: (name: string) => void;
  deletePerfume: (name: string) => void;
  openShift: (initialCash: number, cashierName: string) => void;
  closeShift: (shiftId: string, cashCollected: number) => void;
  addOrder: (order: Omit<Order, 'id' | 'invoiceNumber' | 'trackingCode' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, qcNotes?: string) => void;
  recordPayment: (orderId: string, method: PaymentMethod, amount: number) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'depositBalance' | 'totalOrders' | 'totalSpent' | 'joinedDate' | 'referralCode'>) => Customer;
  topupDeposit: (customerId: string, amount: number, accountId: string) => void;
  redeemPoints: (customerId: string, points: number) => void;
  addDeliveryTask: (task: Omit<DeliveryTask, 'id'>) => void;
  assignCourier: (taskId: string, courierId: string) => void;
  completeDeliveryTask: (taskId: string, proofPhoto?: string, signatureName?: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
  updateInventoryStock: (itemId: string, qtyDelta: number) => void;
  recordAttendance: (employeeId: string, status: 'present' | 'late' | 'permit' | 'absent') => void;
  addExpense: (expense: Omit<ExpenseEntry, 'id'>) => void;
  sendWhatsAppNotification: (phone: string, recipientName: string, templateType: WhatsAppMessage['templateType'], content: string, orderId?: string) => void;
  applyVoucherCode: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
  generateMonthlyPayroll: (period: string) => void;
  markPayrollPaid: (slipId: string) => void;
  createTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'outletsCount'>) => void;
  updateTenantPlan: (tenantId: string, plan: PlanType) => void;
  exportDatabaseBackup: () => string;
  importDatabaseBackup: (jsonStr: string) => boolean;
  resetDatabaseToDefaults: () => void;
  getStorageStats: () => { bytes: number; kb: string; itemsCount: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('ls_auth');
    return saved === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ls_role');
    return (saved as UserRole) || 'tenant_owner';
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('ls_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });
  const [currentTenant, setCurrentTenant] = useState<Tenant>(tenants[0] || INITIAL_TENANTS[0]);
  const [impersonatedTenant, setImpersonatedTenant] = useState<Tenant | null>(null);

  const [outlets, setOutlets] = useState<Outlet[]>(() => {
    const saved = localStorage.getItem('ls_outlets');
    return saved ? JSON.parse(saved) : INITIAL_OUTLETS;
  });
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(outlets[0] || INITIAL_OUTLETS[0]);

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('ls_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ls_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [couriers, setCouriers] = useState<Courier[]>(() => {
    const saved = localStorage.getItem('ls_couriers');
    return saved ? JSON.parse(saved) : INITIAL_COURIERS;
  });

  const [deliveryTasks, setDeliveryTasks] = useState<DeliveryTask[]>(() => {
    const saved = localStorage.getItem('ls_delivery');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_TASKS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('ls_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('ls_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('ls_services');
    return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
  });

  const [perfumes, setPerfumes] = useState<string[]>(() => {
    const saved = localStorage.getItem('ls_perfumes');
    return saved ? JSON.parse(saved) : [
      'Sakura Blossom (Favorit)',
      'Lavender Dream',
      'Ocean Soft',
      'Snappy Fresh',
      'Vanilla Sweet',
      'Baby Soft Downy',
      'Non-Parfum (Alergi)'
    ];
  });

  const [cashierShifts, setCashierShifts] = useState<Array<{ id: string; cashierName: string; openTime: string; closeTime?: string; initialCash: number; totalCashCollected: number; status: 'open' | 'closed' }>>(() => {
    return [
      { id: 'sh-1', cashierName: 'Nurul Hidayah', openTime: '2026-08-23 07:00', initialCash: 300000, totalCashCollected: 1450000, status: 'open' }
    ];
  });

  const currentShift = cashierShifts.find(s => s.status === 'open') || null;

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [payrollSlips, setPayrollSlips] = useState<PayrollSlip[]>([]);
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>(INITIAL_ACCOUNTS);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(INITIAL_EXPENSES);
  const [vouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);

  // Service CRUD Actions
  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updatedData: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Perfume CRUD Actions
  const addPerfume = (name: string) => {
    if (!perfumes.includes(name.trim())) {
      setPerfumes(prev => [...prev, name.trim()]);
    }
  };

  const deletePerfume = (name: string) => {
    setPerfumes(prev => prev.filter(p => p !== name));
  };

  // Cashier Shift Actions
  const openShift = (initialCash: number, cashierName: string) => {
    const newShift = {
      id: `sh-${Date.now()}`,
      cashierName,
      openTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      initialCash,
      totalCashCollected: 0,
      status: 'open' as const
    };
    setCashierShifts(prev => [newShift, ...prev]);
  };

  const closeShift = (shiftId: string, cashCollected: number) => {
    setCashierShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        return {
          ...s,
          closeTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
          totalCashCollected: cashCollected,
          status: 'closed' as const
        };
      }
      return s;
    }));
  };

  // Auth Methods
  const login = (role: UserRole, tenantId?: string, outletId?: string) => {
    setCurrentRole(role);
    if (tenantId) {
      const matchT = tenants.find(t => t.id === tenantId);
      if (matchT) setCurrentTenant(matchT);
    }
    if (outletId) {
      const matchO = outlets.find(o => o.id === outletId);
      if (matchO) setCurrentOutlet(matchO);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Actions
  const addOrder = (orderData: Omit<Order, 'id' | 'invoiceNumber' | 'trackingCode' | 'createdAt'>) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${dateStr}-${orders.length + 1}`.padStart(16, '0');
    const trackingCode = `${currentTenant.code || 'LS'}-${randNum}`;
    const newId = `ord-${Date.now()}`;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      invoiceNumber,
      trackingCode,
      createdAt: now.toISOString().slice(0, 16).replace('T', ' '),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Asynchronously sync new order to Supabase Cloud
    SupabaseService.syncOrder(newOrder).catch(() => {});

    setCustomers(prev => prev.map(c => {
      if (c.id === orderData.customerId) {
        const earnedPoints = Math.floor(orderData.totalAmount / 5000);
        const updatedCustomer = {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + orderData.totalAmount,
          loyaltyPoints: c.loyaltyPoints + earnedPoints,
          lastOrderDate: now.toISOString().slice(0, 10),
          depositBalance: orderData.paymentMethod === 'deposit' ? Math.max(0, c.depositBalance - orderData.totalAmount) : c.depositBalance
        };
        SupabaseService.syncCustomer(updatedCustomer).catch(() => {});
        return updatedCustomer;
      }
      return c;
    }));

    if (orderData.paymentStatus === 'paid' && orderData.paymentMethod !== 'deposit') {
      setCashAccounts(prev => prev.map(acc => {
        if (orderData.paymentMethod === 'cash' && acc.type === 'cash') {
          return { ...acc, balance: acc.balance + orderData.totalAmount };
        }
        return acc;
      }));
    }

    sendWhatsAppNotification(
      newOrder.customerPhone,
      newOrder.customerName,
      'order_received',
      `Halo Kak ${newOrder.customerName}! Order #${newOrder.trackingCode} telah diterima di ${currentOutlet.name}. Total: Rp ${newOrder.totalAmount.toLocaleString('id-ID')}. Estimasi selesai: ${newOrder.estimatedReady}. Cek progres: https://laundrysuite.id/track/${newOrder.trackingCode}`,
      newOrder.id
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, qcNotes?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updated: Order = { 
          ...ord, 
          status, 
          qcNotes: qcNotes || ord.qcNotes,
          qcStatus: status === 'qc_pending' ? 'passed' : ord.qcStatus,
          completedAt: status === 'completed' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : ord.completedAt
        };

        SupabaseService.syncOrder(updated).catch(() => {});

        if (status === 'ready') {
          sendWhatsAppNotification(
            ord.customerPhone,
            ord.customerName,
            'order_ready',
            `Hore! Cucian Kak ${ord.customerName} (#${ord.trackingCode}) di ${currentOutlet.name} sudah selesai dan siap diambil/diantar! Silakan tunjukkan nota saat pengambilan.`,
            ord.id
          );
        }

        return updated;
      }
      return ord;
    }));
  };

  const recordPayment = (orderId: string, method: PaymentMethod, amount: number) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const newPaid = ord.paidAmount + amount;
        return {
          ...ord,
          paymentMethod: method,
          paidAmount: newPaid,
          paymentStatus: newPaid >= ord.totalAmount ? 'paid' : 'partial'
        };
      }
      return ord;
    }));
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'loyaltyPoints' | 'depositBalance' | 'totalOrders' | 'totalSpent' | 'joinedDate' | 'referralCode'>) => {
    const randCode = customerData.name.split(' ')[0].toUpperCase() + Math.floor(10 + Math.random() * 90);
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      loyaltyPoints: 50,
      depositBalance: 0,
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
      referralCode: randCode,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const topupDeposit = (customerId: string, amount: number, accountId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, depositBalance: c.depositBalance + amount };
      }
      return c;
    }));

    setCashAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    }));
  };

  const redeemPoints = (customerId: string, points: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId && c.loyaltyPoints >= points) {
        const bonusDeposit = points * 100;
        return { 
          ...c, 
          loyaltyPoints: c.loyaltyPoints - points, 
          depositBalance: c.depositBalance + bonusDeposit 
        };
      }
      return c;
    }));
  };

  const addDeliveryTask = (taskData: Omit<DeliveryTask, 'id'>) => {
    const newTask: DeliveryTask = {
      ...taskData,
      id: `del-${Date.now()}`,
    };
    setDeliveryTasks(prev => [newTask, ...prev]);
  };

  const assignCourier = (taskId: string, courierId: string) => {
    const courier = couriers.find(c => c.id === courierId);
    setDeliveryTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, courierId, courierName: courier?.name, status: 'assigned' };
      }
      return t;
    }));

    setCouriers(prev => prev.map(c => {
      if (c.id === courierId) {
        return { ...c, activeTasksCount: c.activeTasksCount + 1, status: 'on_delivery' };
      }
      return c;
    }));
  };

  const completeDeliveryTask = (taskId: string, proofPhoto?: string, signatureName?: string) => {
    setDeliveryTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'completed',
          proofPhoto: proofPhoto || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=60',
          signatureName: signatureName || t.customerName
        };
      }
      return t;
    }));
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      lastRestocked: new Date().toISOString().slice(0, 10),
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryStock = (itemId: string, qtyDelta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return { 
          ...item, 
          currentStock: Math.max(0, item.currentStock + qtyDelta),
          lastRestocked: qtyDelta > 0 ? new Date().toISOString().slice(0, 10) : item.lastRestocked
        };
      }
      return item;
    }));
  };

  const recordAttendance = (employeeId: string, status: 'present' | 'late' | 'permit' | 'absent') => {
    const emp = employees.find(e => e.id === employeeId);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = now.toISOString().slice(0, 10);

    setAttendance(prev => [
      {
        id: `att-${Date.now()}`,
        employeeId,
        employeeName: emp?.name || 'Staff',
        date: dateStr,
        clockIn: timeStr,
        status
      },
      ...prev
    ]);
  };

  const addExpense = (expenseData: Omit<ExpenseEntry, 'id'>) => {
    const newExpense: ExpenseEntry = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [newExpense, ...prev]);

    setCashAccounts(prev => prev.map(acc => {
      if (acc.id === expenseData.accountId) {
        return { ...acc, balance: Math.max(0, acc.balance - expenseData.amount) };
      }
      return acc;
    }));
  };

  const sendWhatsAppNotification = (
    phone: string, 
    recipientName: string, 
    templateType: WhatsAppMessage['templateType'], 
    content: string, 
    orderId?: string
  ) => {
    const newMsg: WhatsAppMessage = {
      id: `wa-${Date.now()}`,
      orderId,
      phone,
      recipientName,
      templateType,
      content,
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'sent',
    };
    setWhatsappMessages(prev => [newMsg, ...prev]);
  };

  const applyVoucherCode = (code: string, subtotal: number) => {
    const vch = vouchers.find(v => v.code.toUpperCase() === code.trim().toUpperCase() && v.isActive);
    if (!vch) {
      return { valid: false, discount: 0, message: 'Kode voucher tidak ditemukan atau sudah kadaluarsa.' };
    }
    if (subtotal < vch.minOrder) {
      return { valid: false, discount: 0, message: `Minimal belanja untuk voucher ini adalah Rp ${vch.minOrder.toLocaleString('id-ID')}` };
    }
    const discount = vch.discountType === 'percentage' 
      ? Math.round((subtotal * vch.discountValue) / 100)
      : vch.discountValue;

    return { valid: true, discount, message: `Voucher ${vch.title} berhasil digunakan!` };
  };

  const generateMonthlyPayroll = (period: string) => {
    const newSlips: PayrollSlip[] = employees.map(emp => {
      let commission = 0;
      if (emp.division === 'Kasir') {
        commission = (emp.commissionPerKg || 100) * 1450;
      } else if (emp.division === 'Produksi') {
        commission = (emp.commissionPerKg || 200) * 1200 + (emp.commissionPerItem || 500) * 120;
      } else if (emp.division === 'Kurir') {
        commission = (emp.commissionPerItem || 3000) * 85;
      }
      const bonus = 150000;
      const deductions = 50000;
      const net = emp.baseSalary + commission + bonus - deductions;

      return {
        id: `pay-${emp.id}-${period}`,
        period,
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        division: emp.division,
        baseSalary: emp.baseSalary,
        totalCommission: commission,
        bonus,
        deductions,
        netSalary: net,
        paymentStatus: 'pending',
        generatedAt: new Date().toISOString().slice(0, 10),
      };
    });

    setPayrollSlips(newSlips);
  };

  const markPayrollPaid = (slipId: string) => {
    setPayrollSlips(prev => prev.map(s => {
      if (s.id === slipId) {
        addExpense({
          tenantId: currentTenant.id,
          outletId: currentOutlet.id,
          date: new Date().toISOString().slice(0, 10),
          category: 'Gaji & Komisi',
          description: `Gaji ${s.employeeName} (${s.period})`,
          amount: s.netSalary,
          accountId: cashAccounts[0]?.id || 'acc-1',
          accountName: cashAccounts[0]?.name || 'Kas',
        });
        return { ...s, paymentStatus: 'paid' };
      }
      return s;
    }));
  };

  const createTenant = (tenantData: Omit<Tenant, 'id' | 'createdAt' | 'outletsCount'>) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: `t-${Date.now()}`,
      outletsCount: 1,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTenants(prev => [...prev, newTenant]);
  };

  const updateTenantPlan = (tenantId: string, plan: PlanType) => {
    const prices: Record<PlanType, number> = { trial: 0, starter: 199000, growth: 499000, business: 1299000 };
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        return { ...t, plan, mrr: prices[plan] };
      }
      return t;
    }));
  };

  const impersonateTenant = (tenantId: string) => {
    const target = tenants.find(t => t.id === tenantId);
    if (target) {
      setImpersonatedTenant(target);
      setCurrentTenant(target);
      setCurrentRole('tenant_owner');
      const targetOutlet = outlets.find(o => o.tenantId === target.id) || outlets[0];
      if (targetOutlet) setCurrentOutlet(targetOutlet);
    }
  };

  const exitImpersonation = () => {
    setImpersonatedTenant(null);
    setCurrentRole('super_admin');
  };

  const tenantScopedCustomers = useMemo(() => {
    if (currentRole === 'super_admin') return customers;
    return customers.filter(c => c.tenantId === currentTenant.id);
  }, [customers, currentTenant.id, currentRole]);

  const tenantScopedOrders = useMemo(() => {
    if (currentRole === 'super_admin') return orders;
    return orders.filter(o => o.tenantId === currentTenant.id);
  }, [orders, currentTenant.id, currentRole]);

  const tenantScopedInventory = useMemo(() => {
    if (currentRole === 'super_admin') return inventory;
    return inventory.filter(i => i.tenantId === currentTenant.id);
  }, [inventory, currentTenant.id, currentRole]);

  const tenantScopedEmployees = useMemo(() => {
    if (currentRole === 'super_admin') return employees;
    return employees.filter(e => e.tenantId === currentTenant.id);
  }, [employees, currentTenant.id, currentRole]);

  const tenantScopedExpenses = useMemo(() => {
    if (currentRole === 'super_admin') return expenses;
    return expenses.filter(e => e.tenantId === currentTenant.id);
  }, [expenses, currentTenant.id, currentRole]);

  const tenantScopedOutlets = useMemo(() => {
    if (currentRole === 'super_admin') return outlets;
    return outlets.filter(o => o.tenantId === currentTenant.id);
  }, [outlets, currentTenant.id, currentRole]);

  const exportDatabaseBackup = (): string => {
    return DatabaseEngine.exportBackup({
      version: DB_VERSION,
      lastUpdated: new Date().toISOString(),
      tenants,
      outlets,
      services,
      customers,
      orders,
      couriers,
      deliveryTasks,
      inventory,
      employees,
      attendance,
      payrollSlips,
      cashAccounts,
      expenses,
      vouchers,
      whatsappMessages
    });
  };

  const importDatabaseBackup = (jsonStr: string): boolean => {
    const data = DatabaseEngine.parseBackup(jsonStr);
    if (!data) return false;
    if (data.tenants) setTenants(data.tenants);
    if (data.outlets) setOutlets(data.outlets);
    if (data.customers) setCustomers(data.customers);
    if (data.orders) setOrders(data.orders);
    if (data.inventory) setInventory(data.inventory);
    if (data.employees) setEmployees(data.employees);
    if (data.expenses) setExpenses(data.expenses);
    if (data.services) setServices(data.services);
    return true;
  };

  const resetDatabaseToDefaults = () => {
    DatabaseEngine.clearStorage();
    window.location.reload();
  };

  const getStorageStats = () => {
    return DatabaseEngine.getStorageUsage();
  };

  // Initial Supabase cloud seeding if tables are freshly created
  useEffect(() => {
    SupabaseService.seedInitialData(tenants, outlets, services, customers, orders).catch(() => {});
  }, []);

  useEffect(() => {
    DatabaseEngine.saveSnapshot({
      tenants, outlets, services, customers, orders,
      couriers, deliveryTasks, inventory, employees,
      attendance, payrollSlips, cashAccounts, expenses,
      vouchers, whatsappMessages
    });
  }, [
    tenants, outlets, services, customers, orders,
    couriers, deliveryTasks, inventory, employees,
    attendance, payrollSlips, cashAccounts, expenses,
    vouchers, whatsappMessages
  ]);

  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    currentRole,
    setCurrentRole,
    impersonatedTenant,
    impersonateTenant,
    exitImpersonation,
    tenants,
    currentTenant,
    setCurrentTenant,
    outlets: tenantScopedOutlets,
    currentOutlet,
    setCurrentOutlet,
    customers: tenantScopedCustomers,
    orders: tenantScopedOrders,
    couriers,
    deliveryTasks,
    inventory: tenantScopedInventory,
    employees: tenantScopedEmployees,
    attendance,
    payrollSlips,
    cashAccounts,
    expenses: tenantScopedExpenses,
    vouchers,
    whatsappMessages,
    services,
    addService,
    updateService,
    deleteService,
    perfumes,
    addPerfume,
    deletePerfume,
    cashierShifts,
    currentShift,
    openShift,
    closeShift,
    addOrder,
    updateOrderStatus,
    recordPayment,
    addCustomer,
    topupDeposit,
    redeemPoints,
    addDeliveryTask,
    assignCourier,
    completeDeliveryTask,
    addInventoryItem,
    updateInventoryStock,
    recordAttendance,
    addExpense,
    sendWhatsAppNotification,
    applyVoucherCode,
    generateMonthlyPayroll,
    markPayrollPaid,
    createTenant,
    updateTenantPlan,
    exportDatabaseBackup,
    importDatabaseBackup,
    resetDatabaseToDefaults,
    getStorageStats,
  }), [
    isAuthenticated, currentRole, tenants, currentTenant, tenantScopedOutlets, currentOutlet,
    tenantScopedCustomers, tenantScopedOrders, services, perfumes, couriers, deliveryTasks, tenantScopedInventory,
    tenantScopedEmployees, attendance, payrollSlips, cashAccounts, tenantScopedExpenses,
    vouchers, whatsappMessages, cashierShifts, currentShift
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
