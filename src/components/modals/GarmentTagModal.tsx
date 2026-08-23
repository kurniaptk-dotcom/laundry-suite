import React, { useRef } from 'react';
import { Order, Outlet, Tenant } from '../../types';
import { Tag, Printer, X, QrCode, Sparkles, Check } from 'lucide-react';

interface GarmentTagModalProps {
  order: Order;
  outlet: Outlet;
  tenant: Tenant;
  onClose: () => void;
}

export const GarmentTagModal: React.FC<GarmentTagModalProps> = ({
  order,
  outlet,
  tenant,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Generate individual garment tags for bags or items
  const totalBags = Math.max(1, Math.ceil((order.totalWeightKg || 0) / 4) || (order.totalPcs || 1));
  const tagList = Array.from({ length: totalBags }, (_, i) => ({
    bagIndex: i + 1,
    totalBags: totalBags,
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Tag className="w-4 h-4 text-brand-600" />
            <span>Cetak Tag Label Pakaian & Stiker Kantong (50x30mm)</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Preview Area */}
        <div className="p-6 bg-slate-100 max-h-[65vh] overflow-y-auto space-y-4 flex flex-col items-center">
          <div className="text-xs text-slate-500 text-center font-medium">
            Format Standar: Thermal Garment Label Sticker (50 x 30 mm) per kantong / gantungan
          </div>

          <div id="garment-tag-sheet" ref={printAreaRef} className="space-y-3 w-full max-w-xs">
            {tagList.map(tag => (
              <div
                key={tag.bagIndex}
                className="bg-white text-slate-900 font-mono p-3 rounded-lg border-2 border-dashed border-slate-400 shadow-md flex items-center justify-between gap-2"
                style={{ minHeight: '110px' }}
              >
                <div className="space-y-0.5 text-[11px] leading-tight flex-1">
                  <div className="font-extrabold text-[12px] uppercase text-brand-900 tracking-wider">
                    {tenant.name}
                  </div>
                  <div className="font-black text-sm text-slate-900">
                    #{order.trackingCode}
                  </div>
                  <div className="font-bold text-slate-800 truncate max-w-[140px]">
                    {order.customerName}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {order.isExpress ? '⚡ EXPRESS (6 Jam)' : 'REGULER'} • {order.totalWeightKg ? `${order.totalWeightKg}kg` : `${order.totalPcs}pcs`}
                  </div>
                  {order.perfumeChoice && (
                    <div className="text-[9px] text-brand-700 font-bold">
                      🌸 {order.perfumeChoice.split(' ')[0]}
                    </div>
                  )}
                  <div className="text-[9px] font-bold text-slate-500 pt-0.5">
                    Kantong: <b>{tag.bagIndex} / {tag.totalBags}</b>
                  </div>
                </div>

                <div className="text-center shrink-0">
                  <div className="p-1 border border-slate-300 rounded bg-white inline-block">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div className="text-[8px] font-mono text-slate-500 mt-0.5">{order.trackingCode}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total {tagList.length} Stiker Tag Label
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak {tagList.length} Stiker Tag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
