import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  Kanban, QrCode, Sparkles, ArrowRight, 
  RotateCcw, CheckCircle2, AlertTriangle, UserCheck,
  Clock, Shirt, Flame, PackageCheck, Zap, GripVertical,
  Eye, X, Phone, Tag, Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

const COLUMNS: Array<{ key: OrderStatus; title: string; icon: any; headerColor: string; accentColor: string }> = [
  { key: 'received', title: '1. Antrean Masuk', icon: Clock, headerColor: 'bg-blue-500 text-white', accentColor: 'border-t-blue-500' },
  { key: 'washing', title: '2. Mesin Cuci', icon: Shirt, headerColor: 'bg-sky-500 text-white', accentColor: 'border-t-sky-500' },
  { key: 'drying', title: '3. Pengeringan', icon: Flame, headerColor: 'bg-amber-500 text-white', accentColor: 'border-t-amber-500' },
  { key: 'ironing', title: '4. Setrika Uap', icon: Zap, headerColor: 'bg-purple-500 text-white', accentColor: 'border-t-purple-500' },
  { key: 'packing', title: '5. QC & Packing', icon: PackageCheck, headerColor: 'bg-teal-500 text-white', accentColor: 'border-t-teal-500' },
  { key: 'ready', title: '6. Siap Diambil', icon: CheckCircle2, headerColor: 'bg-emerald-500 text-white', accentColor: 'border-t-emerald-500' },
];

export const ProductionKanban: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanToast, setScanToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Drag and drop state
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);

  // Card detail modal
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Barcode scanner simulator
  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = orders.find(o => 
      o.trackingCode.toLowerCase() === barcodeInput.trim().toLowerCase() ||
      o.invoiceNumber.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (matched) {
      const stageFlow: OrderStatus[] = ['received', 'washing', 'drying', 'ironing', 'packing', 'ready'];
      const currentIndex = stageFlow.indexOf(matched.status);
      if (currentIndex >= 0 && currentIndex < stageFlow.length - 1) {
        const nextStage = stageFlow[currentIndex + 1];
        updateOrderStatus(matched.id, nextStage);
        
        if (nextStage === 'ready') {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }

        setScanToast({
          text: `Scan #${matched.trackingCode} sukses! Berpindah ke tahap: ${nextStage.toUpperCase()}`,
          type: 'success'
        });
      } else {
        setScanToast({
          text: `Order #${matched.trackingCode} sudah mencapai tahap akhir (${matched.status.toUpperCase()})`,
          type: 'info'
        });
      }
    } else {
      setScanToast({
        text: `Resi "${barcodeInput}" tidak ditemukan dalam sistem.`,
        type: 'error'
      });
    }
    setBarcodeInput('');
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData('text/plain', orderId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedOrderId(orderId);
  };

  const handleDragOver = (e: React.DragEvent, colKey: OrderStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colKey) {
      setDragOverColumn(colKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colKey: OrderStatus) => {
    e.preventDefault();
    if (dragOverColumn === colKey) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    
    if (orderId) {
      const ord = orders.find(o => o.id === orderId);
      if (ord && ord.status !== targetStatus) {
        updateOrderStatus(orderId, targetStatus);

        if (targetStatus === 'ready') {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
        }

        setScanToast({
          text: `Order #${ord.trackingCode} dipindahkan ke ${targetStatus.toUpperCase()}`,
          type: 'success'
        });
      }
    }

    setDraggedOrderId(null);
    setDragOverColumn(null);
  };

  const advanceOrder = (orderId: string, currentStatus: OrderStatus) => {
    const stageFlow: OrderStatus[] = ['received', 'washing', 'drying', 'ironing', 'packing', 'ready'];
    const idx = stageFlow.indexOf(currentStatus);
    if (idx >= 0 && idx < stageFlow.length - 1) {
      const next = stageFlow[idx + 1];
      updateOrderStatus(orderId, next);
      if (next === 'ready') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  const reportRewash = (orderId: string) => {
    const notes = prompt('Alasan cuci ulang / QC reject (misal: noda minyak belum hilang sempurna):');
    if (notes) {
      updateOrderStatus(orderId, 'washing', `[QC REWASH]: ${notes}`);
      setScanToast({ text: 'Status diubah ke Cuci Ulang (Rewash)', type: 'info' });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-in fade-in">
      {/* Title & Barcode Scanner Tool */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Kanban className="w-5 h-5 text-brand-600" />
            Papan Kanban Produksi & Quality Control (QC)
          </h1>
          <p className="text-xs text-slate-500">
            Geser kartu (Drag & Drop) untuk memperbarui stasiun pengerjaan cucian secara instan.
          </p>
        </div>

        {/* Quick Barcode Scanner Form */}
        <form onSubmit={handleScanBarcode} className="flex items-center gap-2">
          <div className="relative">
            <QrCode className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Scan Barcode / Resi (misal: LBJ-8842)..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono font-bold"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            Scan & Next
          </button>
        </form>
      </div>

      {/* Toast Alert */}
      {scanToast && (
        <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xs transition animate-in fade-in ${
          scanToast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          scanToast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{scanToast.text}</span>
          </div>
          <button onClick={() => setScanToast(null)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
        </div>
      )}

      {/* Kanban Board Grid with Drag & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 items-start">
        {COLUMNS.map(col => {
          const Icon = col.icon;
          const colOrders = orders.filter(o => o.status === col.key);
          const isDragOver = dragOverColumn === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={(e) => handleDragLeave(e, col.key)}
              onDrop={(e) => handleDrop(e, col.key)}
              className={`rounded-2xl border bg-white p-3 space-y-3 min-h-[560px] flex flex-col border-t-4 transition-all duration-150 ${col.accentColor} ${
                isDragOver 
                  ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/30 scale-[1.01]' 
                  : 'border-slate-200/90 shadow-card'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{col.title}</span>
                </div>
                <span className="text-[11px] font-extrabold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700">
                  {colOrders.length}
                </span>
              </div>

              {/* Drag Drop Area */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {colOrders.length === 0 ? (
                  <div className={`h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-[11px] font-medium transition ${
                    isDragOver ? 'border-brand-400 bg-brand-50/60 text-brand-700' : 'border-slate-200 text-slate-400 italic'
                  }`}>
                    {isDragOver ? 'Lepaskan Kartu di Sini' : 'Kosong'}
                  </div>
                ) : (
                  colOrders.map(order => {
                    const isBeingDragged = draggedOrderId === order.id;

                    return (
                      <div
                        key={order.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, order.id)}
                        onDragEnd={() => { setDraggedOrderId(null); setDragOverColumn(null); }}
                        className={`p-3 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all space-y-2.5 cursor-grab active:cursor-grabbing group relative ${
                          isBeingDragged ? 'opacity-40 scale-95 border-brand-400' : 'border-slate-200/90 hover:border-brand-400'
                        }`}
                      >
                        {/* Drag Handle & Tracking Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 transition" />
                            <span>#{order.trackingCode}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {order.isExpress && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                                ⚡ Express
                              </span>
                            )}
                            <button
                              onClick={() => setSelectedOrderForDetail(order)}
                              className="p-1 text-slate-300 hover:text-slate-600 rounded"
                              title="Lihat Detail Pesanan"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Customer & Service Info */}
                        <div className="text-[11px] text-slate-700">
                          <div className="font-bold text-slate-800 flex items-center justify-between">
                            <span>{order.customerName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {order.totalWeightKg ? `${order.totalWeightKg} kg` : `${order.totalPcs || 1} pcs`}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                            {order.items[0]?.serviceName}
                          </div>
                        </div>

                        {/* Perfume choice pill */}
                        {order.perfumeChoice && (
                          <div className="text-[9px] font-semibold text-brand-700 bg-brand-50/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span>🌸 {order.perfumeChoice}</span>
                          </div>
                        )}

                        {/* QC Notes / Warning if rewash */}
                        {order.qcNotes && (
                          <div className="text-[10px] text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-100 font-medium">
                            {order.qcNotes}
                          </div>
                        )}

                        {/* Card Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          {col.key === 'packing' && (
                            <button
                              onClick={() => reportRewash(order.id)}
                              className="px-2 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition"
                              title="Laporkan QC gagal / cuci ulang"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Rewash
                            </button>
                          )}

                          {col.key !== 'ready' && (
                            <button
                              onClick={() => advanceOrder(order.id, order.status)}
                              className="w-full py-1.5 text-[11px] font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
                            >
                              <span>Lanjut</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {col.key === 'ready' && (
                            <div className="w-full py-1 text-center text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-lg">
                              Siap Diambil ✓
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Detail Modal */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Detail Cucian</span>
                <div className="font-extrabold text-base text-slate-900">#{selectedOrderForDetail.trackingCode}</div>
              </div>
              <button 
                onClick={() => setSelectedOrderForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-bold text-slate-800">{selectedOrderForDetail.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. WhatsApp:</span>
                <span>{selectedOrderForDetail.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Aroma Parfum:</span>
                <span className="font-bold text-brand-700">🌸 {selectedOrderForDetail.perfumeChoice || 'Default'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimasi Selesai:</span>
                <span className="font-semibold text-blue-900">{selectedOrderForDetail.estimatedReady}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Daftar Item:</span>
              {selectedOrderForDetail.items.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">{item.serviceName}</div>
                    <div className="text-[11px] text-slate-500">{item.qty} {item.unit}</div>
                  </div>
                  <div className="font-extrabold text-slate-900">Rp {item.subtotal.toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>

            {/* Quick Move Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Ubah Tahapan Pengerjaan Manual:</label>
              <select
                value={selectedOrderForDetail.status}
                onChange={(e) => {
                  updateOrderStatus(selectedOrderForDetail.id, e.target.value as OrderStatus);
                  setSelectedOrderForDetail(prev => prev ? { ...prev, status: e.target.value as OrderStatus } : null);
                }}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
              >
                <option value="received">1. Antrean Masuk</option>
                <option value="washing">2. Mesin Cuci</option>
                <option value="drying">3. Pengeringan</option>
                <option value="ironing">4. Setrika Uap</option>
                <option value="packing">5. QC & Packing</option>
                <option value="ready">6. Siap Diambil</option>
              </select>
            </div>

            <button
              onClick={() => setSelectedOrderForDetail(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
