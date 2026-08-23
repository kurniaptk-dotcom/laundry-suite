/**
 * Supabase Service Adapter
 * Provides high-level async methods to sync multi-tenant laundry operations
 * to cloud Supabase tables with local-first fallbacks.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Tenant, Order, Customer } from '../types';

export class SupabaseService {
  /**
   * Check live cloud connectivity
   */
  static async checkConnection(): Promise<{ connected: boolean; latencyMs: number; message: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        connected: false,
        latencyMs: 0,
        message: 'Supabase URL & Anon Key belum dikonfigurasi. Menggunakan database lokal.',
      };
    }

    const start = Date.now();
    try {
      const { error } = await supabase.from('tenants').select('id', { count: 'exact', head: true });
      const latency = Date.now() - start;
      if (error) {
        return { connected: false, latencyMs: latency, message: `Error: ${error.message}` };
      }
      return { connected: true, latencyMs: latency, message: `Terhubung ke Supabase PostgreSQL (${latency}ms)` };
    } catch (err: any) {
      return { connected: false, latencyMs: Date.now() - start, message: err.message || 'Koneksi gagal' };
    }
  }

  /**
   * Sync a new or updated tenant to Supabase
   */
  static async syncTenant(tenant: Tenant): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('tenants').upsert({
        id: tenant.id,
        name: tenant.name,
        code: tenant.code,
        plan: tenant.plan,
        status: tenant.status,
        mrr: tenant.mrr,
        outlets_count: tenant.outletsCount,
        owner_name: tenant.ownerName,
        owner_email: tenant.ownerEmail,
        owner_phone: tenant.ownerPhone,
        logo_url: tenant.logoUrl,
        created_at: tenant.createdAt,
      });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Sync a new or updated order to Supabase
   */
  static async syncOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('orders').upsert({
        id: order.id,
        tenant_id: order.tenantId,
        outlet_id: order.outletId,
        tracking_code: order.trackingCode,
        customer_id: order.customerId,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        order_type: order.orderType,
        order_status: order.status,
        payment_status: order.paymentStatus,
        payment_method: order.paymentMethod,
        perfume_choice: order.perfumeChoice,
        is_express: order.isExpress,
        items: order.items,
        bags: order.bags || [],
        complaints: order.complaints || [],
        subtotal: order.subtotal,
        discount_amount: order.discount,
        delivery_fee: order.deliveryFee,
        total_amount: order.totalAmount,
        amount_paid: order.paidAmount,
        change_amount: order.paidAmount > order.totalAmount ? order.paidAmount - order.totalAmount : 0,
        notes: order.notes,
        pickup_address: order.customerAddress,
        delivery_address: order.customerAddress,
        estimated_completion: order.estimatedReady,
        created_at: order.createdAt,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Sync a customer record to Supabase
   */
  static async syncCustomer(customer: Customer): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('customers').upsert({
        id: customer.id,
        tenant_id: customer.tenantId,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        total_orders: customer.totalOrders,
        total_spend: customer.totalSpent,
        loyalty_points: customer.loyaltyPoints,
        deposit_balance: customer.depositBalance,
        membership_tier: customer.membershipTier,
        created_at: customer.joinedDate,
      });
      return !error;
    } catch {
      return false;
    }
  }
}
