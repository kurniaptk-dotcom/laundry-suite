import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, MessageSquare, Send, CheckCheck, Phone, 
  Sparkles, Clock, ShieldCheck, User, Key,
  ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Smartphone
} from 'lucide-react';
import { WhatsAppGatewayService } from '../../services/whatsappGateway';

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

  // Gateway Token State
  const [fonnteToken, setFonnteToken] = useState(WhatsAppGatewayService.getToken());
  const [isAutoSend, setIsAutoSend] = useState(WhatsAppGatewayService.isAutoSendEnabled());
  const [deviceStatus, setDeviceStatus] = useState<{
    checking: boolean;
    connected?: boolean;
    device?: string;
    quota?: string;
    message?: string;
  }>({ checking: false });
  const [activeTab, setActiveTab] = useState<'messages' | 'config'>('messages');

  useEffect(() => {
    if (isOpen && fonnteToken) {
      handleCheckDeviceStatus();
    }
  }, [isOpen]);

  const handleSaveToken = () => {
    WhatsAppGatewayService.setToken(fonnteToken);
    WhatsAppGatewayService.setAutoSendEnabled(isAutoSend);
    handleCheckDeviceStatus();
    alert('Pengaturan WhatsApp Gateway berhasil disimpan!');
  };

  const handleCheckDeviceStatus = async () => {
    setDeviceStatus({ checking: true });
    const res = await WhatsAppGatewayService.checkDeviceStatus(fonnteToken);
    setDeviceStatus({
      checking: false,
      connected: res.connected,
      device: res.device,
      quota: res.quota,
      message: res.message,
    });
  };

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

        {/* Drawer Tabs */}
        <div className="flex border-b border-emerald-800 bg-[#075E54] px-4 text-xs font-bold text-emerald-100">
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-3 border-b-2 transition ${
              activeTab === 'messages'
                ? 'border-white text-white'
                : 'border-transparent text-emerald-200/70 hover:text-white'
            }`}
          >
            💬 Riwayat & Kirim ({whatsappMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1 ${
              activeTab === 'config'
                ? 'border-white text-white'
                : 'border-transparent text-emerald-200/70 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>⚙️ Pengaturan API Fonnte</span>
            {deviceStatus.connected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>

        {/* TAB 1: MESSAGES & QUICK SENDER */}
        {activeTab === 'messages' && (
          <>
            {/* Quick Send Tool */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kirim Pesan WhatsApp
                </span>
                {fonnteToken ? (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fonnte Gateway Aktif
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    Simulator Mode
                  </span>
                )}
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
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-xs"
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => WhatsAppGatewayService.openDirectWhatsAppUrl(msg.phone, msg.content)}
                          className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                        >
                          <span>Buka WA</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCheck className="w-3.5 h-3.5" /> Terkirim
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* TAB 2: FONNTE GATEWAY CONFIGURATION */}
        {activeTab === 'config' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50">
            {/* Fonnte Tutorial Card */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Kirim WhatsApp Otomatis Tanpa Klik Manual</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Hubungkan akun <strong>Fonnte</strong> Anda untuk mengirim nota transaksi dan pemberitahuan cucian selesai secara otomatis dari nomor WhatsApp laundry Anda sendiri.
              </p>
              <a
                href="https://fonnte.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1"
              >
                <span>Daftar / Login Akun Fonnte di fonnte.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Token Input Form */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-brand-600" />
                  <span>Fonnte API Token</span>
                </label>
                <input
                  type="text"
                  value={fonnteToken}
                  onChange={(e) => setFonnteToken(e.target.value)}
                  placeholder="Masukkan API Token Fonnte (misal: a1b2c3d4e5f6...)"
                  className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="text-[10px] text-slate-400">
                  Dapatkan token ini di menu <strong>Device</strong> pada dashboard Fonnte.
                </p>
              </div>

              {/* Auto-send Toggle */}
              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Kirim Otomatis di Latar Belakang</span>
                  <span className="text-[10px] text-slate-500 block">Kirim pesan langsung saat kasir simpan order di POS</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAutoSend}
                  onChange={(e) => setIsAutoSend(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
              </label>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckDeviceStatus}
                  disabled={deviceStatus.checking}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${deviceStatus.checking ? 'animate-spin' : ''}`} />
                  <span>{deviceStatus.checking ? 'Memeriksa...' : 'Cek Status Device'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveToken}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Simpan Token
                </button>
              </div>
            </div>

            {/* Device Status Box */}
            {deviceStatus.message && (
              <div className={`p-3.5 rounded-2xl border text-xs font-medium space-y-1.5 animate-in fade-in ${
                deviceStatus.connected 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {deviceStatus.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>Status Koneksi Gateway:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {deviceStatus.message}
                </p>
                {deviceStatus.quota && (
                  <div className="text-[10px] font-bold text-emerald-700 bg-white/80 p-1.5 rounded-lg border border-emerald-200">
                    📊 Kuota: {deviceStatus.quota}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
