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

export const DEFAULT_TENANT: Tenant = {
  id: 't-demo',
  name: 'Laundry Bersih Jaya',
  code: 'LBJ',
  plan: 'growth',
  status: 'active',
  mrr: 499000,
  outletsCount: 1,
  ownerName: 'Hendra Gunawan',
  ownerEmail: 'owner@bersihjaya.id',
  ownerPhone: '081234567890',
  createdAt: '2026-08-01',
};

export const DEFAULT_OUTLET: Outlet = {
  id: 'out-1',
  tenantId: 't-demo',
  name: 'Outlet Tebet (Pusat)',
  code: 'LBJ-TBT',
  address: 'Jl. Tebet Raya No. 45, Jakarta Selatan',
  city: 'Jakarta Selatan',
  phone: '081234567890',
  isMain: true,
  operationalHours: '07:00 - 21:00 WIB',
  services: DEFAULT_SERVICES,
};

export const INITIAL_TENANTS: Tenant[] = [
  { id: 't-1', name: 'Berkah Laundry Express', code: 'BLE', plan: 'business', status: 'active', mrr: 1299000, outletsCount: 3, ownerName: 'Hendra Gunawan', ownerEmail: 'hendra@berkahlaundry.id', ownerPhone: '081234567890', createdAt: '2025-01-10' },
  { id: 't-2', name: 'Kurnia Wash & Dry Clean', code: 'KDC', plan: 'business', status: 'active', mrr: 1299000, outletsCount: 3, ownerName: 'Kurnia Pratama', ownerEmail: 'kurnia@kurniaptk.com', ownerPhone: '081198765432', createdAt: '2024-11-05' },
  { id: 't-3', name: 'Klin Laundry Kilat', code: 'KLN', plan: 'growth', status: 'active', mrr: 499000, outletsCount: 2, ownerName: 'Ahmad Fauzi', ownerEmail: 'ahmad@klinlaundry.id', ownerPhone: '085712349988', createdAt: '2025-03-01' },
  { id: 't-4', name: 'Sakura Eco Laundry', code: 'SEL', plan: 'growth', status: 'active', mrr: 499000, outletsCount: 2, ownerName: 'David Santoso', ownerEmail: 'david@sakuralaundry.id', ownerPhone: '081399887711', createdAt: '2024-09-12' },
  { id: 't-5', name: 'Bintang Cleaners Premium', code: 'BCP', plan: 'growth', status: 'active', mrr: 499000, outletsCount: 2, ownerName: 'Jessica Suryanto', ownerEmail: 'jessica@bintangclean.com', ownerPhone: '081244556677', createdAt: '2025-05-15' },
  { id: 't-6', name: 'Fresh & Clean Laundromat', code: 'FCL', plan: 'growth', status: 'active', mrr: 499000, outletsCount: 2, ownerName: 'Budi Wicaksono', ownerEmail: 'budi@freshclean.id', ownerPhone: '085611223399', createdAt: '2025-04-18' },
  { id: 't-7', name: 'Melati Family Laundry', code: 'MFL', plan: 'starter', status: 'active', mrr: 199000, outletsCount: 1, ownerName: 'Siti Maryam', ownerEmail: 'siti@melatilaundry.com', ownerPhone: '087811990022', createdAt: '2025-02-20' },
  { id: 't-8', name: 'Pelangi Laundry Kiloan', code: 'PLK', plan: 'starter', status: 'active', mrr: 199000, outletsCount: 1, ownerName: 'Rian Hidayat', ownerEmail: 'rian@pelangilaundry.id', ownerPhone: '081255667788', createdAt: '2025-06-01' },
  { id: 't-9', name: 'Sentosa Dry Cleaning & Shoes', code: 'SDC', plan: 'growth', status: 'active', mrr: 499000, outletsCount: 2, ownerName: 'Ketut Wijaya', ownerEmail: 'ketut@sentosadry.com', ownerPhone: '081366778899', createdAt: '2025-07-10' },
  { id: 't-10', name: 'Amanah Laundry Express', code: 'ALE', plan: 'trial', status: 'trial', mrr: 0, outletsCount: 1, ownerName: 'Zulkifli Lubis', ownerEmail: 'zulkifli@amanahlaundry.id', ownerPhone: '081277889900', createdAt: '2026-08-15' },
];

export const INITIAL_OUTLETS: Outlet[] = [
  // Tenant 1 (3 Cabang - Jakarta Selatan)
  { id: 'out-1', tenantId: 't-1', name: 'Outlet Tebet (Pusat)', code: 'BLE-TBT', address: 'Jl. Tebet Raya No. 45, Jakarta Selatan', city: 'Jakarta Selatan', phone: '081234567890', isMain: true, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },
  { id: 'out-2', tenantId: 't-1', name: 'Outlet Kemang', code: 'BLE-KMG', address: 'Jl. Kemang Raya No. 12, Jakarta Selatan', city: 'Jakarta Selatan', phone: '081234567891', isMain: false, operationalHours: '08:00 - 22:00 WIB', services: DEFAULT_SERVICES },
  { id: 'out-3', tenantId: 't-1', name: 'Outlet Blok M', code: 'BLE-BLM', address: 'Jl. Melawai No. 8, Jakarta Selatan', city: 'Jakarta Selatan', phone: '081234567892', isMain: false, operationalHours: '07:30 - 21:30 WIB', services: DEFAULT_SERVICES },

  // Tenant 2 (3 Cabang - Pontianak)
  { id: 'out-4', tenantId: 't-2', name: 'Outlet Gajah Mada (Pusat)', code: 'KDC-GJM', address: 'Jl. Gajah Mada No. 88, Pontianak', city: 'Pontianak', phone: '081198765432', isMain: true, operationalHours: '07:00 - 22:00 WIB', services: DEFAULT_SERVICES },
  { id: 'out-5', tenantId: 't-2', name: 'Outlet Purnama', code: 'KDC-PNM', address: 'Jl. Purnama No. 25, Pontianak', city: 'Pontianak', phone: '081198765433', isMain: false, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },
  { id: 'out-6', tenantId: 't-2', name: 'Outlet Sungai Jawi', code: 'KDC-SJW', address: 'Jl. H. Rais A. Rahman No. 50, Pontianak', city: 'Pontianak', phone: '081198765434', isMain: false, operationalHours: '07:30 - 21:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 3 (2 Cabang - Bandung)
  { id: 'out-7', tenantId: 't-3', name: 'Outlet Dago (Pusat)', code: 'KLN-DGO', address: 'Jl. Ir. H. Juanda No. 110, Bandung', city: 'Bandung', phone: '085712349988', isMain: true, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },
  { id: 'out-8', tenantId: 't-3', name: 'Outlet Buah Batu', code: 'KLN-BBT', address: 'Jl. Buah Batu No. 76, Bandung', city: 'Bandung', phone: '085712349989', isMain: false, operationalHours: '07:30 - 21:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 4 (2 Cabang - Surabaya)
  { id: 'out-9', tenantId: 't-4', name: 'Outlet Rungkut (Pusat)', code: 'SEL-RKT', address: 'Jl. Rungkut Madya No. 42, Surabaya', city: 'Surabaya', phone: '081399887711', isMain: true, operationalHours: '07:00 - 21:30 WIB', services: DEFAULT_SERVICES },
  { id: 'out-10', tenantId: 't-4', name: 'Outlet Gubeng', code: 'SEL-GBG', address: 'Jl. Gubeng Kertajaya No. 18, Surabaya', city: 'Surabaya', phone: '081399887712', isMain: false, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 5 (2 Cabang - Semarang)
  { id: 'out-11', tenantId: 't-5', name: 'Outlet Simpang Lima (Pusat)', code: 'BCP-SPL', address: 'Jl. Pandanaran No. 30, Semarang', city: 'Semarang', phone: '081244556677', isMain: true, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },
  { id: 'out-12', tenantId: 't-5', name: 'Outlet Tembalang', code: 'BCP-TMG', address: 'Jl. Prof. Soedarto No. 55, Semarang', city: 'Semarang', phone: '081244556678', isMain: false, operationalHours: '07:00 - 22:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 6 (2 Cabang - Yogyakarta)
  { id: 'out-13', tenantId: 't-6', name: 'Outlet Gejayan (Pusat)', code: 'FCL-GJY', address: 'Jl. Affandi (Gejayan) No. 22, Yogyakarta', city: 'Yogyakarta', phone: '085611223399', isMain: true, operationalHours: '07:00 - 22:00 WIB', services: DEFAULT_SERVICES },
  { id: 'out-14', tenantId: 't-6', name: 'Outlet Seturan', code: 'FCL-STR', address: 'Jl. Seturan Raya No. 9, Yogyakarta', city: 'Yogyakarta', phone: '085611223390', isMain: false, operationalHours: '07:00 - 23:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 7 (1 Cabang - Tangerang Selatan)
  { id: 'out-15', tenantId: 't-7', name: 'Outlet BSD City', code: 'MFL-BSD', address: 'Ruko Golden Boulevard Blok W2/15, BSD City', city: 'Tangerang Selatan', phone: '087811990022', isMain: true, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 8 (1 Cabang - Bekasi)
  { id: 'out-16', tenantId: 't-8', name: 'Outlet Harapan Indah', code: 'PLK-HPI', address: 'Ruko Harapan Indah Blok FB No. 12, Bekasi', city: 'Bekasi', phone: '081255667788', isMain: true, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 9 (2 Cabang - Denpasar Bali)
  { id: 'out-17', tenantId: 't-9', name: 'Outlet Sanur (Pusat)', code: 'SDC-SNR', address: 'Jl. Danau Tamblingan No. 64, Sanur', city: 'Denpasar', phone: '081366778899', isMain: true, operationalHours: '07:30 - 21:30 WIB', services: DEFAULT_SERVICES },
  { id: 'out-18', tenantId: 't-9', name: 'Outlet Seminyak', code: 'SDC-SMY', address: 'Jl. Kayu Aya No. 38, Seminyak', city: 'Badung', phone: '081366778890', isMain: false, operationalHours: '08:00 - 22:00 WIB', services: DEFAULT_SERVICES },

  // Tenant 10 (1 Cabang - Medan)
  { id: 'out-19', tenantId: 't-10', name: 'Outlet Ringroad', code: 'ALE-RRD', address: 'Jl. Ring Road No. 88A, Medan', city: 'Medan', phone: '081277889900', isMain: true, operationalHours: '07:00 - 21:00 WIB', services: DEFAULT_SERVICES },
];

const INITIAL_CUSTOMERS: Customer[] = [];
const INITIAL_ORDERS: Order[] = [];
const INITIAL_COURIERS: Courier[] = [
  { id: 'cur-1', name: 'Rian Pratama', phone: '081299881122', vehicleType: 'motor', activeTasksCount: 0, status: 'available', rating: 4.9, completedDeliveries: 124 },
  { id: 'cur-2', name: 'Dimas Setiawan', phone: '081388776655', vehicleType: 'motor', activeTasksCount: 0, status: 'available', rating: 4.8, completedDeliveries: 98 },
];
const INITIAL_DELIVERY_TASKS: DeliveryTask[] = [];
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', tenantId: 't-demo', outletId: 'out-1', name: 'Deterjen Liquid Konsentrat EcoClean (20L)', category: 'chemical', sku: 'DET-ECO-20L', currentStock: 8, unit: 'Jerigen (20L)', minStockThreshold: 3, costPerUnit: 140000, supplierName: 'PT Sukses Kimia Pratama', lastRestocked: '2026-08-20' },
  { id: 'inv-2', tenantId: 't-demo', outletId: 'out-1', name: 'Parfum Sakura Blossom Premium (5L)', category: 'chemical', sku: 'PRF-SKR-5L', currentStock: 4, unit: 'Jerigen (5L)', minStockThreshold: 2, costPerUnit: 185000, supplierName: 'PT Aroma Wangi Indonesia', lastRestocked: '2026-08-18' },
  { id: 'inv-3', tenantId: 't-demo', outletId: 'out-1', name: 'Plastik Packing Jinjing Tebal 35x50', category: 'packaging', sku: 'PLS-3550-100', currentStock: 15, unit: 'Pack (100 pcs)', minStockThreshold: 5, costPerUnit: 35000, supplierName: 'CV Plastik Mandiri', lastRestocked: '2026-08-22' },
];
const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', tenantId: 't-demo', outletId: 'out-1', name: 'Siti Rahayu', role: 'Kasir Front Office', division: 'Kasir', baseSalary: 2800000, commissionPerKg: 100, phone: '081288990011', email: 'siti@bersihjaya.id', status: 'active', joinedDate: '2025-02-01' },
  { id: 'emp-2', tenantId: 't-demo', outletId: 'out-1', name: 'Bambang Sudirgo', role: 'Operator Cuci & Dry', division: 'Produksi', baseSalary: 2900000, commissionPerKg: 200, phone: '081377889900', email: 'bambang@bersihjaya.id', status: 'active', joinedDate: '2025-01-15' },
];
const INITIAL_ACCOUNTS: CashAccount[] = [
  { id: 'acc-1', name: 'Kas Kasir Tunai (Laci)', type: 'cash', balance: 1500000 },
  { id: 'acc-2', name: 'Rekening Bank / QRIS', type: 'bank', balance: 8500000 },
];
const INITIAL_EXPENSES: ExpenseEntry[] = [];
const INITIAL_VOUCHERS: Voucher[] = [
  { id: 'vch-1', code: 'BERSIHHEMAT', title: 'Diskon Spesial Rp 5.000', discountType: 'fixed', discountValue: 5000, minOrder: 30000, validUntil: '2026-12-31', usageCount: 14, maxUsage: 100, isActive: true },
  { id: 'vch-2', code: 'DISKON10', title: 'Diskon 10% Semua Layanan', discountType: 'percentage', discountValue: 10, minOrder: 40000, validUntil: '2026-12-31', usageCount: 28, maxUsage: 500, isActive: true },
];

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
  createTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'outletsCount'>) => Tenant;
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
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.length > 0 ? parsed : INITIAL_TENANTS;
  });
  const [currentTenant, setCurrentTenant] = useState<Tenant>(() => tenants[0] || DEFAULT_TENANT);
  const [impersonatedTenant, setImpersonatedTenant] = useState<Tenant | null>(null);

  const [outlets, setOutlets] = useState<Outlet[]>(() => {
    const saved = localStorage.getItem('ls_outlets');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.length > 0 ? parsed : INITIAL_OUTLETS;
  });
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(() => outlets[0] || DEFAULT_OUTLET);

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
    return [];
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
    localStorage.setItem('ls_role', role);
    localStorage.setItem('ls_auth', 'true');

    if (tenantId) {
      const matchT = tenants.find(t => t.id === tenantId) || (currentTenant?.id === tenantId ? currentTenant : undefined);
      if (matchT) {
        setCurrentTenant(matchT);
        // Automatically sync the active outlet to match this tenant
        const matchingOutlets = outlets.filter(o => o.tenantId === matchT.id);
        if (matchingOutlets.length > 0) {
          setCurrentOutlet(matchingOutlets[0]);
        }
      }
    }
    if (outletId) {
      const matchO = outlets.find(o => o.id === outletId) || (currentOutlet?.id === outletId ? currentOutlet : undefined);
      if (matchO) setCurrentOutlet(matchO);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('ls_auth', 'false');
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

  const createTenant = (tenantData: Omit<Tenant, 'id' | 'createdAt' | 'outletsCount'>): Tenant => {
    const newTenantId = `t-${Date.now()}`;
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const newTenant: Tenant = {
      ...tenantData,
      id: newTenantId,
      outletsCount: 1,
      trialEndsAt: tenantData.trialEndsAt || (tenantData.plan === 'trial' || tenantData.status === 'trial' ? trialEnd.toISOString() : undefined),
      createdAt: now.toISOString().slice(0, 10),
    };

    const newOutlet: Outlet = {
      id: `out-${Date.now()}`,
      tenantId: newTenantId,
      name: 'Outlet Pusat',
      code: `${newTenant.code || 'LND'}-01`,
      address: 'Jl. Utama Bisnis No. 1',
      city: 'Jakarta',
      phone: newTenant.ownerPhone,
      isMain: true,
      operationalHours: '07:00 - 21:00 WIB',
      services: DEFAULT_SERVICES,
    };

    setTenants(prev => [...prev, newTenant]);
    setOutlets(prev => [...prev, newOutlet]);
    setCurrentTenant(newTenant);
    setCurrentOutlet(newOutlet);

    // Sync to Supabase Cloud
    SupabaseService.syncTenant(newTenant).catch(() => {});

    return newTenant;
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

  // Initial Supabase cloud seeding & Realtime WebSockets live sync
  useEffect(() => {
    SupabaseService.seedInitialData(tenants, outlets, services, customers, orders).catch(() => {});

    // Fetch cloud orders on mount
    SupabaseService.fetchCloudOrders(currentTenant?.id).then(cloudOrders => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(prev => {
          const merged = [...prev];
          cloudOrders.forEach(co => {
            if (!merged.some(m => m.id === co.id)) {
              merged.unshift(co);
            }
          });
          return merged;
        });
      }
    }).catch(() => {});

    // Realtime channel listener across multiple cashier tablets/phones
    const channel = SupabaseService.subscribeToOrders((payload) => {
      if (payload?.new && payload.new.id) {
        SupabaseService.fetchCloudOrders(currentTenant?.id).then(fresh => {
          if (fresh && fresh.length > 0) {
            setOrders(fresh);
          }
        }).catch(() => {});
      }
    });

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [currentTenant?.id]);

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
