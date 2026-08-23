import React, { useState } from 'react';
import { Order, BagItem, ComplaintTicket, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, QrCode, Printer, RotateCcw, AlertTriangle, 
  CheckCircle2, Clock, Package, Shirt, Flame, 
  Zap, Sparkles, User, Phone, MapPin, Tag, ShieldCheck,
  ChevronRight, Plus
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onPrintReceipt: (order: Order) => void;
  onPrintGarmentTag: (order: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onPrintReceipt,
  onPrintGarmentTag,
}) => {
  const { updateOrderStatus, currentTenant, currentOutlet } = useApp();

  // Active Sub-Tab: 'bags_qr' | 'timeline' | 'items' | 'complaints'
  const [activeTab, setActiveTab] = useState<'bags_qr' | 'timeline' | 'items' | 'complaints'>('bags_qr');

  // Complaint Form State
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintType, setComplaintType] = useState<ComplaintTicket['complaintType']>('noda_belum_bersih');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintList, setComplaintList] = useState<ComplaintTicket[]>(order.complaints || [
    {
      id: 'cmp-1',
      orderId: order.id,
      trackingCode: order.trackingCode,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      complaintType: 'noda_belum_bersih',
      description: 'Noda kecap di kerah kemeja bagian belakang masih tersisa sedikit.',
      status: 'rewash_in_progress',
      createdAt: '2026-08-22 14:30'
    }
  ]);

  // Bags Data (Generate 2-3 bags if not present for demonstration)
  const [bags, setBags] = useState<BagItem[]>(order.bags || [
    {
      id: 'bg-1',
      bagCode: `${order.trackingCode}-BAG-01`,
      orderId: order.id,
      station: (order.status as any) || 'washing',
      weightKg: order.totalWeightKg ? Math.round((order.totalWeightKg * 0.6) * 10) / 10 : 3.2,
      itemTypeDescription: 'Pakaian Campur Harian & Kemeja (Warna Terang)',
      operatorName: 'Bambang Sudiro',
      sealedAt: '2026-08-22 09:30'
    },
    {
      id: 'bg-2',
      bagCode: `${order.trackingCode}-BAG-02`,
      orderId: order.id,
      station: (order.status as any) || 'washing',
      weightKg: order.totalWeightKg ? Math.round((order.totalWeightKg * 0.4) * 10) / 10 : 2.3,
      itemTypeDescription: 'Celana Jeans & Bahan Gelap / Tebal',
      operatorName: 'Bambang Sudiro',
      sealedAt: '2026-08-22 09:35'
    }
  ]);

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim()) return;

    const newTicket: ComplaintTicket = {
      id: `cmp-${Date.now()}`,
      orderId: order.id,
      trackingCode: order.trackingCode,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      complaintType,
      description: complaintDesc,
      status: 'rewash_in_progress',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setComplaintList(prev => [newTicket, ...prev]);
    updateOrderStatus(order.id, 'washing', `[KOMPLAIN/REWASH]: ${complaintDesc}`);
    setShowComplaintForm(false);
    setComplaintDesc('');
    alert('Tiket komplain & instruksi cuci ulang (Rewash) berhasil dibuat dan diteruskan ke stasiun Mesin Cuci!');
  };

  const STAGES = [
    { key: 'received', title: 'Antrean Masuk', time: order.createdAt },
    { key: 'washing', title: 'Mesin Cuci', time: '2026-08-22 10:30' },
    { key: 'drying', title: 'Pengeringan', time: '2026-08-22 12:00' },
    { key: 'ironing', title: 'Setrika Uap', time: '2026-08-22 14:00' },
    { key: 'packing', title: 'QC & Packing', time: '2026-08-22 15:30' },
    { key: 'ready', title: 'Siap Diambil / Diantar', time: order.estimatedReady },
  ];

  const currentStageIndex = STAGES.findIndex(s => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-brand-950 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center font-black text-sm text-white shadow-lg">
              QR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">#{order.trackingCode}</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wide">
                  {order.invoiceNumber}
                </span>
                {order.isExpress && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                    ⚡ Express 6 Jam
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {order.customerName} ({order.customerPhone}) • {currentOutlet.name}
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintGarmentTag(order)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
              title="Cetak Label Tag Baju (50x30mm)"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Label Tag</span>
            </button>

            <button
              onClick={() => onPrintReceipt(order)}
              className="px-3 py-1.5 bg-white text-blue-950 hover:bg-blue-50 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md"
              title="Cetak Struk Nota Thermal 80mm/58mm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Nota</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/50">
          {[
            { key: 'bags_qr', label: `🎒 Daftar Kantong & QR (${bags.length} Bag)`, icon: QrCode },
            { key: 'timeline', label: '⏱️ Live Timeline & SLA', icon: Clock },
            { key: 'items', label: `🧺 Rincian Cucian (${order.items.length} Item)`, icon: Shirt },
            { key: 'complaints', label: `⚠️ Komplain & Rewash (${complaintList.length})`, icon: RotateCcw },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-3 text-xs font-extrabold transition border-b-2 flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'border-brand-600 text-brand-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* ================= TAB 1: BAGS & QR CODES HIERARCHY ================= */}
          {activeTab === 'bags_qr' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-brand-600" />
                    Hierarki Order ➔ Laundry Bag ➔ QR Code
                  </h3>
                  <p className="text-xs text-slate-500">
                    Setiap kantong cucian memiliki QR Code mandiri untuk scan stasiun cuci, pengering, setrika uap, dan packing seal.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newBagCode = `${order.trackingCode}-BAG-0${bags.length + 1}`;
                    setBags(prev => [...prev, {
                      id: `bg-${Date.now()}`,
                      bagCode: newBagCode,
                      orderId: order.id,
                      station: (order.status as any) || 'washing',
                      weightKg: 2.0,
                      itemTypeDescription: 'Kantong Tambahan (Pakaian Satuan / Khusus)',
                      operatorName: 'Operator',
                      sealedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                    }]);
                  }}
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold border border-brand-200 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Kantong (Bag)</span>
                </button>
              </div>

              {/* Bags Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bags.map((bag, idx) => (
                  <div key={bag.id} className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3 relative overflow-hidden">
                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brand-50 rounded-bl-full pointer-events-none" />

                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900">
                            {bag.bagCode}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 uppercase">
                            Bag #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          {bag.itemTypeDescription}
                        </p>
                      </div>

                      {/* Simulated QR Code Graphic */}
                      <div className="w-16 h-16 p-1 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                        <QrCode className="w-full h-full text-slate-900" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Berat Kantong:</span>
                        <span className="font-extrabold text-slate-800">{bag.weightKg} Kg</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Stasiun Saat Ini:</span>
                        <span className="font-bold text-brand-700 uppercase text-[10px]">
                          {bag.station}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Operator: <strong>{bag.operatorName || 'Staff Produksi'}</strong></span>
                      <button 
                        onClick={() => onPrintGarmentTag(order)}
                        className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Cetak QR Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ================= TAB 2: LIVE TIMELINE & SLA COUNTDOWN ================= */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-blue-700 font-bold block">Estimasi Target Selesai (SLA):</span>
                  <span className="text-base font-black text-blue-950 font-mono">{order.estimatedReady}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold block">Status Pengerjaan:</span>
                  <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Vertical Stepper */}
              <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {STAGES.map((stg, idx) => {
                  const isDone = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div key={stg.key} className="flex items-start gap-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${
                        isCurrent ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
                        isDone ? 'bg-emerald-500 text-white' :
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>

                      <div className="flex-1 p-3.5 rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">{stg.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{stg.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {isDone ? 'Tahapan selesai diproses dan diverifikasi barcode.' : 'Menunggu giliran pengerjaan mesin.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* ================= TAB 3: RINCIAN ITEM CUCIAN ================= */}
          {activeTab === 'items' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-white flex items-center justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{item.serviceName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.qty} {item.unit} @ Rp {item.unitPrice.toLocaleString('id-ID')} {item.notes && `• Catatan: ${item.notes}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900 text-sm">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] text-brand-700 font-semibold uppercase bg-brand-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Perfume & Notes card */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-brand-50/50 rounded-2xl border border-brand-100">
                  <span className="text-slate-400 font-bold block text-[10px]">Aroma Parfum Pilihan:</span>
                  <span className="font-extrabold text-brand-800">🌸 {order.perfumeChoice || 'Sakura Blossom'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">Total Tagihan & Pembayaran:</span>
                  <span className="font-black text-slate-900">Rp {order.totalAmount.toLocaleString('id-ID')} ({order.paymentMethod?.toUpperCase()})</span>
                </div>
              </div>
            </div>
          )}


          {/* ================= TAB 4: COMPLAINT & RETURN (REWASH) ================= */}
          {activeTab === 'complaints' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    Manajemen Komplain & Return Cuci Ulang (Rewash)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Catat keluhan pelanggan dan kirim kembali cucian ke stasiun produksi tanpa biaya tambahan.
                  </p>
                </div>

                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Ajukan Komplain / Rewash</span>
                </button>
              </div>

              {/* Form Input Komplain Modal / Collapse */}
              {showComplaintForm && (
                <form onSubmit={handleCreateComplaint} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 text-xs animate-in zoom-in-95">
                  <div className="font-black text-rose-900">Formulir Tiket Komplain Pelanggan</div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-rose-800 mb-1">Jenis Kendala / Komplain *</label>
                    <select
                      value={complaintType}
                      onChange={(e) => setComplaintType(e.target.value as any)}
                      className="w-full p-2 bg-white border border-rose-300 rounded-xl font-bold"
                    >
                      <option value="noda_belum_bersih">Noda Belum Bersih Sempurna</option>
                      <option value="kurang_rapi">Setrika Kurang Rapi / Kusut</option>
                      <option value="kancing_lepas">Kancing Terlepas / Kerusakan Minor</option>
                      <option value="aroma_kurang">Aroma Parfum Kurang Wangi</option>
                      <option value="lainnya">Kendala Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-rose-800 mb-1">Keterangan Detail Komplain *</label>
                    <textarea
                      value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                      placeholder="Jelaskan bagian baju atau keluhan pelanggan..."
                      rows={2}
                      required
                      className="w-full p-2.5 bg-white border border-rose-300 rounded-xl resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowComplaintForm(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold shadow-md"
                    >
                      Proses Cuci Ulang (Rewash) Sekarang ➔
                    </button>
                  </div>
                </form>
              )}

              {/* Complaints Ticket List */}
              <div className="space-y-2.5">
                {complaintList.map(ticket => (
                  <div key={ticket.id} className="p-4 rounded-2xl border border-rose-200 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-rose-900">#{ticket.id}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                          {ticket.complaintType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {ticket.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      "{ticket.description}"
                    </p>

                    <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-100">
                      <span>Dilaporkan pada: {ticket.createdAt}</span>
                      <span className="font-semibold text-emerald-600">Garansi Cuci Ulang Gratis Aktif</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            Dikelola oleh sistem <strong>Laundry Suite Multi-Tenant</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
