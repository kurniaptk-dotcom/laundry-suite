-- ============================================================================
-- LAUNDRY SUITE — SUPABASE POSTGRESQL PRODUCTION SCHEMA MIGRATION
-- Multi-Tenant Architecture with Row-Level Security (RLS) & Indexes
-- Version: 2.4.0
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TENANTS TABLE (Platform Level)
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('trial', 'starter', 'growth', 'business')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'trial', 'suspended')),
    mrr NUMERIC DEFAULT 0,
    outlets_count INT DEFAULT 1,
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    owner_phone VARCHAR(50) NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OUTLETS TABLE
CREATE TABLE IF NOT EXISTS outlets (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_outlets_tenant ON outlets(tenant_id);

-- 4. SERVICES CATALOG TABLE
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('kiloan', 'satuan', 'sepatu_tas', 'karpet_linen')),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'pcs', 'pasang', 'm2')),
    price NUMERIC NOT NULL,
    duration_hours INT NOT NULL DEFAULT 48,
    min_qty NUMERIC DEFAULT 1,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_services_tenant ON services(tenant_id);

-- 5. CUSTOMERS TABLE (CRM)
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    total_orders INT DEFAULT 0,
    total_spend NUMERIC DEFAULT 0,
    loyalty_points INT DEFAULT 0,
    deposit_balance NUMERIC DEFAULT 0,
    membership_tier VARCHAR(50) DEFAULT 'reguler' CHECK (membership_tier IN ('reguler', 'silver', 'gold', 'vip')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 6. ORDERS TABLE (POS & Operations)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    outlet_id TEXT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    tracking_code VARCHAR(50) NOT NULL UNIQUE,
    customer_id TEXT NOT NULL REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    order_type VARCHAR(50) DEFAULT 'dropoff' CHECK (order_type IN ('dropoff', 'delivery_pickup')),
    order_status VARCHAR(50) DEFAULT 'antrean' CHECK (order_status IN ('antrean', 'cuci', 'kering', 'setrika', 'qc_packing', 'siap_ambil', 'diantar', 'selesai', 'dibatalkan')),
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid_partial', 'paid_full')),
    payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'qris', 'transfer_bank', 'wallet_deposit', 'edc_card')),
    perfume_choice VARCHAR(100) DEFAULT 'Sakura Blossom',
    is_express BOOLEAN DEFAULT FALSE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    bags JSONB NOT NULL DEFAULT '[]'::jsonb,
    complaints JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0,
    delivery_fee NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    amount_paid NUMERIC DEFAULT 0,
    change_amount NUMERIC DEFAULT 0,
    qr_code_url TEXT,
    notes TEXT,
    pickup_address TEXT,
    delivery_address TEXT,
    estimated_completion TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_code);

-- 7. COURIERS & DRIVERS TABLE
CREATE TABLE IF NOT EXISTS couriers (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'on_delivery', 'off_duty')),
    active_tasks INT DEFAULT 0,
    vehicle_type VARCHAR(50) DEFAULT 'motor',
    plate_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_couriers_tenant ON couriers(tenant_id);

-- 8. DELIVERY TASKS TABLE
CREATE TABLE IF NOT EXISTS delivery_tasks (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    courier_id TEXT REFERENCES couriers(id) ON DELETE SET NULL,
    task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('pickup', 'delivery')),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'on_the_way', 'completed', 'failed')),
    scheduled_time VARCHAR(100),
    pod_photo_url TEXT,
    signature_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_delivery_tasks_tenant ON delivery_tasks(tenant_id);

-- 9. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('detergent', 'parfum', 'packaging', 'chemical_spotter', 'hanger_tag')),
    quantity NUMERIC NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    min_stock NUMERIC NOT NULL DEFAULT 5,
    cost_per_unit NUMERIC NOT NULL,
    supplier_name VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON inventory(tenant_id);

-- 10. EMPLOYEES & HR TABLE
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    outlet_id TEXT NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    base_salary NUMERIC NOT NULL,
    commission_rate NUMERIC DEFAULT 0,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_employees_tenant ON employees(tenant_id);

-- 11. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    clock_in VARCHAR(20),
    clock_out VARCHAR(20),
    status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'late', 'permit', 'absent'))
);
CREATE INDEX IF NOT EXISTS idx_attendance_tenant ON attendance(tenant_id);

-- 12. PAYROLL SLIPS TABLE
CREATE TABLE IF NOT EXISTS payroll_slips (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(255) NOT NULL,
    period VARCHAR(20) NOT NULL,
    base_salary NUMERIC NOT NULL,
    commission_amount NUMERIC DEFAULT 0,
    bonus_amount NUMERIC DEFAULT 0,
    deductions_amount NUMERIC DEFAULT 0,
    total_net_salary NUMERIC NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payroll_tenant ON payroll_slips(tenant_id);

-- 13. EXPENSES TABLE (Accounting & P&L)
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('sewa_tempat', 'listrik_air', 'gas_lpg', 'gaji_karyawan', 'deterjen_plastik', 'maintenance_mesin', 'marketing', 'lain_lain')),
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    account_id VARCHAR(50) DEFAULT 'acc-1',
    payment_method VARCHAR(50) DEFAULT 'cash',
    receipt_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_expenses_tenant ON expenses(tenant_id);

-- 14. WHATSAPP LOGS TABLE
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
    phone VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('order_received', 'washing_done', 'ready_for_pickup', 'delivery_dispatched', 'promo_broadcast')),
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
    message_content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_whatsapp_tenant ON whatsapp_messages(tenant_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ============================================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read/write with anon key for easy integration
CREATE POLICY "Allow public access for anon client" ON tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON outlets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON couriers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON delivery_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON payroll_slips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for anon client" ON whatsapp_messages FOR ALL USING (true) WITH CHECK (true);
