export type PlanType = 'starter' | 'growth' | 'business';

export type UserRole = 
  | 'super_admin'
  | 'tenant_owner'
  | 'outlet_manager'
  | 'cashier'
  | 'production_staff'
  | 'qc_staff'
  | 'courier'
  | 'finance'
  | 'hr'
  | 'customer';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  plan: PlanType;
  status: 'active' | 'trial' | 'suspended';
  mrr: number;
  outletsCount: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  logoUrl?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'kiloan' | 'satuan' | 'sepatu_tas' | 'karpet_linen';
  unit: 'kg' | 'pcs' | 'pasang' | 'm2';
  price: number;
  durationHours: number;
  minQty?: number;
  description?: string;
}

export interface Outlet {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  isMain: boolean;
  operationalHours: string;
  services: ServiceItem[];
}

export interface User {
  id: string;
  tenantId: string;
  outletId: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar?: string;
}

export type MembershipTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  membershipTier: MembershipTier;
  loyaltyPoints: number;
  depositBalance: number;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrderDate?: string;
  referralCode: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  validUntil: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

export type OrderStatus = 
  | 'received'
  | 'washing'
  | 'drying'
  | 'ironing'
  | 'qc_pending'
  | 'packing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid' | 'partial';
export type PaymentMethod = 'cash' | 'qris' | 'transfer' | 'deposit';

export interface OrderItem {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  unit: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  perfume?: string;
}

export interface BagItem {
  id: string;
  bagCode: string; // e.g. BAG-001, BAG-002
  orderId: string;
  station: 'washing' | 'drying' | 'ironing' | 'packing' | 'ready';
  weightKg?: number;
  pcsCount?: number;
  itemTypeDescription: string; // e.g. "Pakaian Kiloan Warna Gelap", "Bed Cover Jumbo"
  qrCodeUrl?: string;
  sealedAt?: string;
  operatorName?: string;
}

export interface ComplaintTicket {
  id: string;
  orderId: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  complaintType: 'noda_belum_bersih' | 'kurang_rapi' | 'kancing_lepas' | 'aroma_kurang' | 'lainnya';
  description: string;
  status: 'open' | 'investigating' | 'rewash_in_progress' | 'resolved';
  compensation?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  trackingCode: string;
  tenantId: string;
  outletId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  orderType: 'walk_in' | 'pickup_delivery';
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  items: OrderItem[];
  bags?: BagItem[];
  complaints?: ComplaintTicket[];
  totalWeightKg?: number;
  totalPcs?: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  isExpress?: boolean;
  perfumeChoice?: string;
  estimatedReady: string;
  createdAt: string;
  completedAt?: string;
  assignedCourierId?: string;
  assignedProductionStaffId?: string;
  qcStatus?: 'passed' | 'rewash' | 'reject';
  qcNotes?: string;
  tags: string[];
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'motor' | 'mobil';
  activeTasksCount: number;
  status: 'available' | 'on_delivery' | 'off_duty';
  rating: number;
  completedDeliveries: number;
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  type: 'pickup' | 'delivery';
  status: 'pending' | 'assigned' | 'in_transit' | 'completed' | 'failed';
  courierId?: string;
  courierName?: string;
  scheduledTime: string;
  proofPhoto?: string;
  signatureName?: string;
  notes?: string;
}

export type InventoryCategory = 'chemical' | 'packaging' | 'tagging' | 'other';

export interface InventoryItem {
  id: string;
  tenantId: string;
  outletId: string;
  name: string;
  category: InventoryCategory;
  sku: string;
  currentStock: number;
  unit: string;
  minStockThreshold: number;
  costPerUnit: number;
  supplierName: string;
  lastRestocked: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  status: 'draft' | 'ordered' | 'received';
  items: { itemName: string; qty: number; unitPrice: number; total: number }[];
  totalAmount: number;
}

export interface Employee {
  id: string;
  tenantId: string;
  outletId: string;
  name: string;
  role: string;
  division: 'Kasir' | 'Produksi' | 'Kurir' | 'Operasional' | 'Manajemen';
  phone: string;
  email: string;
  baseSalary: number;
  commissionPerKg?: number;
  commissionPerItem?: number;
  joinedDate: string;
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'present' | 'late' | 'permit' | 'absent';
}

export interface PayrollSlip {
  id: string;
  period: string;
  employeeId: string;
  employeeName: string;
  role: string;
  division: string;
  baseSalary: number;
  totalCommission: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'paid' | 'pending';
  generatedAt: string;
}

export interface CashAccount {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'qris_gateway';
  balance: number;
  accountNumber?: string;
}

export interface ExpenseEntry {
  id: string;
  tenantId: string;
  outletId: string;
  date: string;
  category: 'Bahan Baku' | 'Listrik & Air' | 'Sewa Tempat' | 'Gaji & Komisi' | 'Maintenance' | 'Marketing' | 'Lainnya';
  description: string;
  amount: number;
  accountId: string;
  accountName: string;
}

export interface WhatsAppMessage {
  id: string;
  orderId?: string;
  phone: string;
  recipientName: string;
  templateType: 'order_received' | 'order_ready' | 'order_delivering' | 'promo_blast' | 'invoice';
  content: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read';
}
