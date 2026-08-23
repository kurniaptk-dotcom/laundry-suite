import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, MessageSquare, Send, CheckCheck, Phone, 
  Sparkles, Clock, ShieldCheck, User
} from 'lucide-react';

interface WhatsAppSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSimulatorDrawer: React.FC<WhatsAppSimulatorDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { whatsappMessages, sendWhatsAppNotification, customers } = useApp();
  const [selectedRecipient, setSelectedRecipient] = useState(customers[0]?.id || '');
  const [templateType, setTemplateType] = useState<'order_received' | 'order_ready' | 'order_delivering' | 'promo_blast' | 'invoice'>('promo_blast');
  const [customMsg, setCustomMsg] = useState('');

  if (!isOpen) return null;

  const currentCust = customers.find(c => c.id === selectedRecipient) || customers[0];

  const handleSend = () => {
    if (!currentCust) return;
    const content = customMsg.trim() || `Halo Kak ${currentCust.name}! Ada penawaran spesial untuk Anda di Laundry Suite: Dapatkan diskon 20% dengan kode promo BERSIHHEMAT untuk cucian berikutnya!`;
    sendWhatsAppNotification(currentCust.phone, currentCust.name, templateType, content);
    setCustomMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* WA Header */}
        <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="font-bold text-sm">WhatsApp Automation Center</div>
              <div className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Official Gateway Connected
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Send Tool */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Kirim Pesan Simulasi
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Target Pelanggan</label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Jenis Notifikasi</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as any)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="promo_blast">Promo & Diskon</option>
                <option value="order_received">Order Masuk</option>
                <option value="order_ready">Cucian Selesai</option>
                <option value="order_delivering">Kurir Berangkat</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tulis pesan custom (atau gunakan template default)..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              onClick={handleSend}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim
            </button>
          </div>
        </div>

        {/* Message Feed (Chat preview style) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#ECE5DD]/40">
          <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider my-2">
            Riwayat Notifikasi Terkirim ({whatsappMessages.length})
          </div>

          {whatsappMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada pesan WhatsApp yang dikirim.
            </div>
          ) : (
            whatsappMessages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-200/80 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {msg.recipientName} ({msg.phone})
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium capitalize">
                    {msg.templateType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{msg.sentAt}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCheck className="w-3.5 h-3.5" /> Terkirim
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
