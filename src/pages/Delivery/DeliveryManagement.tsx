import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryTask, Courier } from '../../types';
import { 
  Truck, UserCheck, MapPin, Phone, 
  Calendar, CheckCircle2, Camera, Smartphone, 
  Navigation, Clock, Plus, ChevronRight, Check
} from 'lucide-react';

export const DeliveryManagement: React.FC = () => {
  const { 
    deliveryTasks, couriers, assignCourier, 
    completeDeliveryTask, addDeliveryTask, currentOutlet 
  } = useApp();

  const [activeView, setActiveView] = useState<'dispatch' | 'courier_app'>('dispatch');
  const [selectedCourierId, setSelectedCourierId] = useState<string>(couriers[0]?.id || '');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [taskType, setTaskType] = useState<'pickup' | 'delivery'>('pickup');
  const [scheduledTime, setScheduledTime] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  // Proof of delivery state for courier app view
  const [activeTaskIdForProof, setActiveTaskIdForProof] = useState<string | null>(null);
  const [signerName, setSignerName] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !custAddress) return;

    addDeliveryTask({
      orderId: `ord-${Date.now()}`,
      invoiceNumber: taskType === 'pickup' ? `REQ-PCK-${Date.now().toString().slice(-4)}` : `DEL-ORD-${Date.now().toString().slice(-4)}`,
      customerName: custName,
      customerPhone: custPhone,
      address: custAddress,
      type: taskType,
      status: 'pending',
      scheduledTime: scheduledTime || '2026-08-22 16:00',
      notes: taskNotes,
    });

    setShowNewTaskModal(false);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setTaskNotes('');
  };

  const handleCompleteWithProof = (taskId: string) => {
    completeDeliveryTask(taskId, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=60', signerName || 'Penerima');
    setActiveTaskIdForProof(null);
    setSignerName('');
  };

  const currentCourier = couriers.find(c => c.id === selectedCourierId) || couriers[0];
  const courierAssignedTasks = deliveryTasks.filter(t => t.courierId === currentCourier?.id);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-600" />
            Manajemen Logistik & Kurir Delivery
          </h1>
          <p className="text-xs text-slate-500">
            Penugasan armada kurir pickup & antar, navigasi rute pengantaran, dan bukti serah terima (Proof of Delivery).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('dispatch')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === 'dispatch' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pusat Dispatch Outlet
          </button>
          <button
            onClick={() => setActiveView('courier_app')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === 'courier_app' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tampilan Kurir PWA</span>
          </button>
        </div>
      </div>

      {activeView === 'dispatch' ? (
        <div className="space-y-6">
          {/* Couriers Status Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {couriers.map(cour => (
              <div key={cour.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-sm">
                    🏍️
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{cour.name}</div>
                    <div className="text-[11px] text-slate-500">{cour.phone}</div>
                    <div className="text-[10px] text-slate-400">⭐ {cour.rating} • {cour.completedDeliveries} Pengantaran</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cour.status === 'on_delivery' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {cour.status === 'on_delivery' ? 'Di Jalan' : 'Tersedia'}
                </span>
              </div>
            ))}

            {/* Quick Add Task Button */}
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/20 text-brand-700 flex flex-col items-center justify-center gap-1 text-xs font-bold transition"
            >
              <Plus className="w-5 h-5" />
              <span>+ Buat Permintaan Pickup / Antar</span>
            </button>
          </div>

          {/* Delivery & Pickup Task Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Daftar Tugas Pengantaran & Jemput Cucian
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Total: {deliveryTasks.length} Tugas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Jenis Tugas</th>
                    <th className="py-3 px-4">No. Ref</th>
                    <th className="py-3 px-4">Pelanggan & Alamat</th>
                    <th className="py-3 px-4">Jadwal</th>
                    <th className="py-3 px-4">Kurir Ditugaskan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Tugaskan Kurir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveryTasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          task.type === 'pickup' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {task.type === 'pickup' ? '📦 Jemput (Pickup)' : '🚀 Antar (Delivery)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {task.invoiceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{task.customerName}</div>
                        <div className="text-[11px] text-slate-500">{task.customerPhone}</div>
                        <div className="text-[11px] text-slate-600 max-w-xs truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{task.address}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {task.scheduledTime}
                      </td>
                      <td className="py-3 px-4">
                        {task.courierName ? (
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                            <span>{task.courierName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Belum Ditugaskan</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          task.status === 'assigned' ? 'bg-cyan-100 text-cyan-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={task.courierId || ''}
                          onChange={(e) => assignCourier(task.id, e.target.value)}
                          className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium cursor-pointer"
                        >
                          <option value="">Pilih Kurir...</option>
                          {couriers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Courier Mobile PWA View Simulator */
        <div className="max-w-md mx-auto bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-700">
          {/* Smartphone bezel */}
          <div className="bg-white rounded-[32px] overflow-hidden min-h-[620px] flex flex-col">
            {/* Mobile Header */}
            <div className="bg-brand-600 text-white p-4 pt-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">Courier PWA App</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">GPS Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-base">{currentCourier.name}</div>
                  <div className="text-xs text-brand-100">Armada Motor • {currentOutlet.name}</div>
                </div>
                <select
                  value={selectedCourierId}
                  onChange={(e) => setSelectedCourierId(e.target.value)}
                  className="text-xs bg-white text-slate-800 font-bold p-1 rounded-lg border-none"
                >
                  {couriers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tasks list in mobile */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tugas Anda Hari Ini ({courierAssignedTasks.length})
              </div>

              {courierAssignedTasks.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  Tidak ada tugas pengantaran aktif untuk kurir ini saat ini.
                </div>
              ) : (
                courierAssignedTasks.map(task => (
                  <div key={task.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        task.type === 'pickup' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {task.type === 'pickup' ? '📦 Jemput Cucian' : '🚀 Antar Cucian'}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-700">{task.invoiceNumber}</span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-slate-900">{task.customerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{task.customerPhone}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                        <span>{task.address}</span>
                      </div>
                    </div>

                    {task.notes && (
                      <div className="p-2 rounded-lg bg-amber-50 text-[10px] text-amber-800 font-medium">
                        Note: {task.notes}
                      </div>
                    )}

                    {/* Action buttons inside mobile app */}
                    {task.status !== 'completed' ? (
                      <div className="pt-2 border-t border-slate-100 flex gap-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Navigation className="w-3.5 h-3.5 text-brand-600" />
                          <span>Google Maps</span>
                        </a>

                        <button
                          onClick={() => setActiveTaskIdForProof(task.id)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Selesai & Foto</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Selesai Diterima: {task.signatureName}
                        </span>
                        <span className="text-[10px] text-emerald-600 underline">Foto Bukti ✓</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proof of Delivery Modal Simulator */}
      {activeTaskIdForProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                Bukti Serah Terima (Proof of Delivery)
              </h3>
              <button onClick={() => setActiveTaskIdForProof(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
              <Camera className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Foto Cucian / Penerima</div>
              <div className="text-[10px] text-slate-400">Simulasi upload kamera kurir otomatis</div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Penerima</label>
              <input
                type="text"
                placeholder="Contoh: Bpk Budi (Pemilik)"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              onClick={() => handleCompleteWithProof(activeTaskIdForProof)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Konfirmasi Selesai & Simpan Bukti
            </button>
          </div>
        </div>
      )}

      {/* Create New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Buat Tugas Pickup / Delivery Baru
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Jenis Layanan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaskType('pickup')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      taskType === 'pickup' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    📦 Jemput (Pickup)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskType('delivery')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      taskType === 'delivery' ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🚀 Antar (Delivery)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Pelanggan *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama pemesan"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">No. WhatsApp / HP *</label>
                <input
                  type="tel"
                  required
                  placeholder="08123456789"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Alamat Lengkap *</label>
                <textarea
                  required
                  placeholder="Jl. Tebet Barat Dalam No. 12..."
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
