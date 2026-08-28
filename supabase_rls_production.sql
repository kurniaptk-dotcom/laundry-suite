-- ============================================================================
-- LAUNDRY SUITE — ENTERPRISE HARDENED ROW-LEVEL SECURITY (RLS) POLICIES
-- Strict Multi-Tenant Data Isolation & Protection
-- ============================================================================

-- 1. Helper Function: Get current authenticated tenant ID from JWT Claims
CREATE OR REPLACE FUNCTION current_tenant_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN NULLIF(current_setting('request.jwt.claim.tenant_id', true), '')::TEXT;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. Drop Insecure Public Policies
DROP POLICY IF EXISTS "Allow public access for anon client" ON tenants;
DROP POLICY IF EXISTS "Allow public access for anon client" ON outlets;
DROP POLICY IF EXISTS "Allow public access for anon client" ON services;
DROP POLICY IF EXISTS "Allow public access for anon client" ON customers;
DROP POLICY IF EXISTS "Allow public access for anon client" ON orders;
DROP POLICY IF EXISTS "Allow public access for anon client" ON couriers;
DROP POLICY IF EXISTS "Allow public access for anon client" ON delivery_tasks;
DROP POLICY IF EXISTS "Allow public access for anon client" ON inventory;
DROP POLICY IF EXISTS "Allow public access for anon client" ON employees;
DROP POLICY IF EXISTS "Allow public access for anon client" ON attendance;
DROP POLICY IF EXISTS "Allow public access for anon client" ON payroll_slips;
DROP POLICY IF EXISTS "Allow public access for anon client" ON expenses;
DROP POLICY IF EXISTS "Allow public access for anon client" ON whatsapp_messages;

-- 3. Strict Tenant Isolation Policies

-- Tenants Table
CREATE POLICY "Tenants: Owner can read own tenant"
    ON tenants FOR SELECT
    USING (id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

CREATE POLICY "Tenants: Super Admin can update any tenant"
    ON tenants FOR UPDATE
    USING (id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Outlets Table
CREATE POLICY "Outlets: Strict tenant isolation"
    ON outlets FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Services Table
CREATE POLICY "Services: Strict tenant isolation"
    ON services FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Customers CRM Table
CREATE POLICY "Customers: Strict tenant isolation"
    ON customers FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Orders Table (POS, Kanban, Finance)
CREATE POLICY "Orders: Strict tenant isolation"
    ON orders FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Couriers & Delivery Tasks
CREATE POLICY "Couriers: Strict tenant isolation"
    ON couriers FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

CREATE POLICY "Delivery Tasks: Strict tenant isolation"
    ON delivery_tasks FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Inventory & Stock
CREATE POLICY "Inventory: Strict tenant isolation"
    ON inventory FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Employees, Attendance, & Payroll
CREATE POLICY "Employees: Strict tenant isolation"
    ON employees FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

CREATE POLICY "Attendance: Strict tenant isolation"
    ON attendance FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

CREATE POLICY "Payroll: Strict tenant isolation"
    ON payroll_slips FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- Financial Expenses
CREATE POLICY "Expenses: Strict tenant isolation"
    ON expenses FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');

-- WhatsApp Audit Logs
CREATE POLICY "WhatsApp Logs: Strict tenant isolation"
    ON whatsapp_messages FOR ALL
    USING (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin')
    WITH CHECK (tenant_id = current_tenant_id() OR current_setting('request.jwt.claim.role', true) = 'super_admin');
