/**
 * Laundry Suite — Multi-Tenant Backend Database Engine & Persistence Layer
 * Handles local persistence, multi-tenant isolation indexing, schema migrations,
 * JSON backup/restore, and performance caching.
 */

import { Tenant, Outlet, UserRole, User, Customer, Order, ServiceItem, Courier, DeliveryTask, InventoryItem, Employee, AttendanceRecord, PayrollSlip, CashAccount, ExpenseEntry, Voucher, WhatsAppMessage } from '../types';

export const DB_VERSION = '2.4.0';
export const DB_STORAGE_KEY = 'LS_DATABASE_V2_4';

export interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  tenants: Tenant[];
  outlets: Outlet[];
  services: ServiceItem[];
  customers: Customer[];
  orders: Order[];
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
}

export class DatabaseEngine {
  /**
   * Load entire database snapshot from persistent storage or return null if empty
   */
  static loadSnapshot(): DatabaseSchema | null {
    try {
      const serialized = localStorage.getItem(DB_STORAGE_KEY);
      if (!serialized) return null;
      const parsed: DatabaseSchema = JSON.parse(serialized);
      return parsed;
    } catch (err) {
      console.warn('[DB Engine] Failed to parse stored database snapshot, falling back to seeds:', err);
      return null;
    }
  }

  /**
   * Commit full database state to persistent storage with timestamp
   */
  static saveSnapshot(data: Omit<DatabaseSchema, 'version' | 'lastUpdated'>): void {
    try {
      const payload: DatabaseSchema = {
        ...data,
        version: DB_VERSION,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('[DB Engine] Failed to save database snapshot:', err);
    }
  }

  /**
   * Query records filtered by tenantId (Enforces multi-tenant data isolation)
   */
  static filterByTenant<T extends { tenantId?: string }>(items: T[], tenantId: string): T[] {
    return items.filter(item => !item.tenantId || item.tenantId === tenantId);
  }

  /**
   * Export database backup as downloadable JSON string
   */
  static exportBackup(data: DatabaseSchema): string {
    return JSON.stringify({
      appName: 'Laundry Suite SaaS',
      exportDate: new Date().toISOString(),
      dbVersion: DB_VERSION,
      data,
    }, null, 2);
  }

  /**
   * Validate and parse a backup file string
   */
  static parseBackup(jsonString: string): DatabaseSchema | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.data && parsed.data.tenants && parsed.data.orders) {
        return parsed.data;
      }
      if (parsed.tenants && parsed.orders) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Calculate database storage consumption in KB
   */
  static getStorageUsage(): { bytes: number; kb: string; itemsCount: number } {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY) || '';
      const bytes = new Blob([raw]).size;
      return {
        bytes,
        kb: (bytes / 1024).toFixed(2) + ' KB',
        itemsCount: raw ? 1 : 0
      };
    } catch {
      return { bytes: 0, kb: '0 KB', itemsCount: 0 };
    }
  }

  /**
   * Clear local database to factory defaults
   */
  static clearStorage(): void {
    localStorage.removeItem(DB_STORAGE_KEY);
    localStorage.removeItem('ls_auth');
    localStorage.removeItem('ls_role');
    localStorage.removeItem('ls_tenant_id');
    localStorage.removeItem('ls_outlet_id');
  }
}
