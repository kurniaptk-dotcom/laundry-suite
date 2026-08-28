/**
 * Excel & CSV Export Engine for Laundry Suite
 * Supports Indonesian Rupiah Formatting, UTF-8 BOM for Microsoft Excel Compatibility
 */

import { Order, ExpenseEntry, PayrollSlip, InventoryItem, Customer } from '../types';

export function downloadCsv(filename: string, csvContent: string) {
  // Add UTF-8 BOM so Excel opens special characters and Indonesian letters correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportOrdersCsv(orders: Order[], tenantName: string = 'Laundry') {
  const headers = [
    'No. Resi',
    'No. Invoice',
    'Tanggal Transaksi',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Layanan',
    'Berat / Jumlah',
    'Status Cucian',
    'Status Bayar',
    'Metode Bayar',
    'Subtotal (Rp)',
    'Diskon (Rp)',
    'Total Bayar (Rp)',
    'Catatan Khusus'
  ];

  const rows = orders.map(o => [
    `#${o.trackingCode}`,
    o.invoiceNumber,
    new Date(o.createdAt).toLocaleString('id-ID'),
    `"${(o.customerName || '').replace(/"/g, '""')}"`,
    `'${o.customerPhone || ''}`,
    `"${(o.items.map(i => i.serviceName).join(' + ') || '').replace(/"/g, '""')}"`,
    o.totalWeightKg ? `${o.totalWeightKg} kg` : `${o.totalPcs || 0} pcs`,
    o.status.toUpperCase(),
    o.paymentStatus.toUpperCase(),
    (o.paymentMethod || 'cash').toUpperCase(),
    o.subtotal,
    o.discount || 0,
    o.totalAmount,
    `"${(o.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCsv(`Laporan_Transaksi_POS_${tenantName.replace(/\s+/g, '_')}_${dateStr}.csv`, csvString);
}

export function exportExpensesCsv(expenses: ExpenseEntry[], tenantName: string = 'Laundry') {
  const headers = [
    'ID Biaya',
    'Tanggal',
    'Kategori',
    'Keterangan Pengeluaran',
    'Nominal (Rp)',
    'Akun Pembayaran'
  ];

  const rows = expenses.map(e => [
    e.id,
    e.date,
    e.category.toUpperCase(),
    `"${(e.description || '').replace(/"/g, '""')}"`,
    e.amount,
    `"${(e.accountName || 'Kas').replace(/"/g, '""')}"`
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCsv(`Laporan_Pengeluaran_Biaya_${tenantName.replace(/\s+/g, '_')}_${dateStr}.csv`, csvString);
}

export function exportPayrollCsv(slips: PayrollSlip[], tenantName: string = 'Laundry') {
  const headers = [
    'No. Slip',
    'Periode Gaji',
    'Nama Karyawan',
    'Gaji Pokok (Rp)',
    'Komisi Cuci (Rp)',
    'Bonus (Rp)',
    'Potongan (Rp)',
    'Total Gaji Bersih (Rp)',
    'Status Pembayaran'
  ];

  const rows = slips.map(s => [
    s.id,
    s.period,
    `"${(s.employeeName || '').replace(/"/g, '""')}"`,
    s.baseSalary,
    s.totalCommission || 0,
    s.bonus || 0,
    s.deductions || 0,
    s.netSalary,
    s.paymentStatus === 'paid' ? 'LUNAS' : 'PENDING'
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCsv(`Rekap_Penggajian_Payroll_${tenantName.replace(/\s+/g, '_')}_${dateStr}.csv`, csvString);
}

export function exportInventoryCsv(items: InventoryItem[], tenantName: string = 'Laundry') {
  const headers = [
    'SKU',
    'Nama Bahan / Barang',
    'Kategori',
    'Stok Saat Ini',
    'Satuan',
    'Batas Minimum',
    'Harga Beli per Unit (Rp)',
    'Total Nilai Stok (Rp)',
    'Supplier',
    'Terakhir Restock'
  ];

  const rows = items.map(i => [
    i.sku,
    `"${(i.name || '').replace(/"/g, '""')}"`,
    i.category.toUpperCase(),
    i.currentStock,
    i.unit,
    i.minStockThreshold,
    i.costPerUnit,
    i.currentStock * i.costPerUnit,
    `"${(i.supplierName || '-').replace(/"/g, '""')}"`,
    i.lastRestocked || '-'
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCsv(`Laporan_Stok_Inventory_${tenantName.replace(/\s+/g, '_')}_${dateStr}.csv`, csvString);
}

export function exportCustomersCsv(customers: Customer[], tenantName: string = 'Laundry') {
  const headers = [
    'ID Pelanggan',
    'Nama Pelanggan',
    'No. WhatsApp',
    'Email',
    'Tier Membership',
    'Poin Loyalty',
    'Saldo Deposit (Rp)',
    'Total Pesanan',
    'Total Belanja (Rp)',
    'Tanggal Bergabung',
    'Alamat'
  ];

  const rows = customers.map(c => [
    c.id,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `'${c.phone || ''}`,
    c.email || '-',
    c.membershipTier,
    c.loyaltyPoints || 0,
    c.depositBalance || 0,
    c.totalOrders || 0,
    c.totalSpent || 0,
    c.joinedDate || '-',
    `"${(c.address || '-').replace(/"/g, '""')}"`
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCsv(`Data_Pelanggan_CRM_${tenantName.replace(/\s+/g, '_')}_${dateStr}.csv`, csvString);
}
