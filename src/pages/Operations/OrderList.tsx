import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  Search, Filter, Printer, MessageSquare, 
  CheckCircle2, Clock, Truck, RefreshCw, Eye,
  ChevronDown, ArrowUpDown, Tag
} from 'lucide-react';
import { OrderDetailModal } from '../../components/modals/OrderDetailModal';

interface OrderListProps {
  onPrintReceipt: (order: Order) => void;
  onPrintTag?: (order: Order) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ onPrintReceipt, onPrintTag }) => {
  const { orders, updateOrderStatus, recordPayment, sendWhatsAppNotification, currentTenant, currentOutlet } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerPhone.includes(search);

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      received: 'bg-blue-100 text-blue-800 border-blue-200',
      washing: 'bg-sky-100 text-sky-800 border-sky-200',
      drying: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      ironing: 'bg-purple-100 text-purple-800 border-purple-200',
      qc_pending: 'bg-rose-100 text-rose-800 border-rose-200',
      packing: 'bg-teal-100 text-teal-800 border-teal-200',
      ready: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      out_for_delivery: 'bg-amber-100 text-amber-800 border-amber-200',
      delivered: 'bg-slate-100 text-slate-800 border-slate-200',
      completed: 'bg-slate-100 text-slate-700 border-slate-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Daftar Seluruh Order & Transaksi
          </h1>
          <p className="text-xs text-slate-500">
            Kelola status cucian, pembayaran, resi thermal, dan broadcast notifikasi WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, resi, nomor telp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Status Cucian</option>
            <option value="received">Antrean Masuk</option>
            <option value="washing">Sedang Dicuci</option>
            <option value="ironing">Sedang Disetrika</option>
            <option value="ready">Siap Diambil</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold">No. Nota / Resi</th>
                <th className="py-3.5 px-4 font-semibold">Pelanggan</th>
                <th className="py-3.5 px-4 font-semibold">Rincian Layanan</th>
                <th className="py-3.5 px-4 font-semibold">Status Cucian</th>
                <th className="py-3.5 px-4 font-semibold">Pembayaran</th>
                <th className="py-3.5 px-4 font-semibold text-right">Total</th>
                <th className="py-3.5 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada transaksi yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    {/* Invoice & Tracking */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>#{ord.trackingCode}</span>
                        {ord.isExpress && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold">
                            ⚡ Express
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.invoiceNumber}</div>
                      <div className="text-[10px] text-slate-400">{ord.createdAt}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                      {ord.perfumeChoice && (
                        <div className="text-[10px] text-brand-600 italic">🌸 {ord.perfumeChoice}</div>
                      )}
                    </td>

                    {/* Service items */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">
                        {ord.items.map(i => `${i.serviceName} (${i.qty} ${i.unit})`).join(', ')}
                      </div>
                      {ord.notes && (
                        <div className="text-[10px] text-amber-700">Note: {ord.notes}</div>
                      )}
                    </td>

                    {/* Status dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase cursor-pointer ${getStatusBadge(ord.status)}`}
                      >
                        <option value="received">Masuk (Antrean)</option>
                        <option value="washing">Sedang Dicuci</option>
                        <option value="drying">Sedang Dikeringkan</option>
                        <option value="ironing">Sedang Disetrika</option>
                        <option value="packing">QC & Packing</option>
                        <option value="ready">Siap Diambil / Diantar</option>
                        <option value="completed">Selesai Diambil</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>

                    {/* Payment status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {ord.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">
                        {ord.paymentMethod || 'Belum Bayar'}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-extrabold text-slate-900">
                        Rp {ord.totalAmount.toLocaleString('id-ID')}
                      </div>
                      {ord.discount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-medium">
                          Disc: -Rp {ord.discount.toLocaleString('id-ID')}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 font-bold transition flex items-center gap-1 text-[11px]"
                          title="Lihat Detail Order, Kantong QR & Komplain"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => onPrintReceipt(ord)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition"
                          title="Cetak Struk Thermal 80mm"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {onPrintTag && (
                          <button
                            onClick={() => onPrintTag(ord)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition"
                            title="Cetak Stiker Tag Label Pakaian (50x30mm)"
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            sendWhatsAppNotification(
                              ord.customerPhone,
                              ord.customerName,
                              'order_ready',
                              `Halo Kak ${ord.customerName}! Cucian Anda di ${currentTenant.name} (${currentOutlet.name}) [#${ord.trackingCode}] dengan total Rp ${ord.totalAmount.toLocaleString('id-ID')} saat ini berstatus ${ord.status.toUpperCase()}. Cek di: https://laundrysuite.id/track/${ord.trackingCode}`,
                              ord.id
                            );
                            alert(`Notifikasi WhatsApp terkirim ke ${ord.customerName} (${ord.customerPhone})!`);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                          title="Kirim Notifikasi WA"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal with Bag QR Codes and Complaints Management */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrintReceipt={onPrintReceipt}
          onPrintGarmentTag={onPrintTag || onPrintReceipt}
        />
      )}
    </div>
  );
};
