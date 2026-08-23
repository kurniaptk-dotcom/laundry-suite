import React, { useRef } from 'react';
import { Order, Outlet, Tenant } from '../../types';
import { Printer, X, Check, QrCode, Sparkles } from 'lucide-react';

interface ThermalReceiptModalProps {
  order: Order;
  outlet: Outlet;
  tenant: Tenant;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  order,
  outlet,
  tenant,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Printer className="w-4 h-4 text-brand-600" />
            <span>Cetak Struk Thermal & Tag Label</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area preview */}
        <div className="p-6 bg-slate-100 flex justify-center max-h-[70vh] overflow-y-auto">
          <div
            id="thermal-receipt"
            ref={receiptRef}
            className="bg-white text-slate-900 font-mono text-[13px] leading-relaxed p-6 w-[80mm] shadow-lg rounded border border-dashed border-slate-300"
          >
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h2 className="text-base font-bold tracking-wider uppercase text-slate-900">{tenant.name}</h2>
              <p className="text-[12px] text-slate-600">{outlet.name}</p>
              <p className="text-[11px] text-slate-500">{outlet.address}</p>
              <p className="text-[11px] text-slate-500">Telp: {outlet.phone}</p>
            </div>

            {/* Order Info */}
            <div className="py-2.5 border-b border-dashed border-slate-400 text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Nota:</span>
                <span className="font-bold">{order.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal:</span>
                <span>{order.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. HP:</span>
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Layanan:</span>
                <span className="font-bold uppercase text-brand-700">{order.isExpress ? '⚡ EXPRESS (6 Jam)' : 'REGULER'}</span>
              </div>
              {order.perfumeChoice && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Parfum:</span>
                  <span className="italic">{order.perfumeChoice}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded">
                <span>Est. Selesai:</span>
                <span>{order.estimatedReady}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="py-3 border-b border-dashed border-slate-400 space-y-2">
              <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider pb-1">Rincian Item</div>
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-medium">
                    <span>{item.serviceName}</span>
                    <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{item.qty} {item.unit} x Rp {item.unitPrice.toLocaleString('id-ID')}</span>
                    {item.notes && <span className="text-amber-700 font-sans text-[10px]">({item.notes})</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Calculation */}
            <div className="py-2.5 border-b border-dashed border-slate-400 text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon:</span>
                  <span>-Rp {order.discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Ongkos Kirim:</span>
                  <span>Rp {order.deliveryFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="uppercase font-semibold">{order.paymentMethod || 'Belum Lunas'}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-500">Status Pembayaran:</span>
                <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
                </span>
              </div>
            </div>

            {/* QR Code & Tracking footer */}
            <div className="pt-4 text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-2 border border-slate-300 rounded bg-white inline-block">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
              </div>
              <div className="text-[12px] font-bold tracking-widest text-slate-900">
                KODE RESI: #{order.trackingCode}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Scan QR di atas atau kunjungi portal untuk mengecek status cucian secara real-time.
              </p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-300">
                Terima kasih atas kepercayaan Anda!<br />
                Pakaian yang tidak diambil lebih dari 30 hari di luar tanggung jawab kami.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Format: Standard Thermal Paper (80mm / 58mm)
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
