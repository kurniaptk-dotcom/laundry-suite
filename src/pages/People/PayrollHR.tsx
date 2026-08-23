import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, PayrollSlip } from '../../types';
import { 
  UserCheck, DollarSign, Calendar, Clock, 
  Award, FileText, CheckCircle2, AlertCircle, 
  Plus, Printer, Download, Sparkles
} from 'lucide-react';

export const PayrollHR: React.FC = () => {
  const { 
    employees, attendance, recordAttendance, 
    payrollSlips, generateMonthlyPayroll, markPayrollPaid,
    currentTenant
  } = useApp();

  const tenantEmployees = employees.filter(e => e.tenantId === currentTenant.id);

  const [activeTab, setActiveTab] = useState<'attendance' | 'payroll' | 'employees'>('payroll');
  const [selectedPeriod, setSelectedPeriod] = useState('Agustus 2026');
  const [selectedSlipForModal, setSelectedSlipForModal] = useState<PayrollSlip | null>(null);

  const handleGeneratePayroll = () => {
    generateMonthlyPayroll(selectedPeriod);
    alert(`Slip penggajian dan komisi periode ${selectedPeriod} berhasil dihitung secara otomatis untuk karyawan ${currentTenant.name}!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-600" />
            SDM, Presensi & Penggajian Otomatis (Payroll)
          </h1>
          <p className="text-xs text-slate-500">
            Perhitungan otomatis gaji pokok, insentif komisi per kg/pcs, absensi harian, dan cetak slip gaji.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { key: 'payroll', label: '💰 Penggajian & Komisi' },
            { key: 'attendance', label: '⏰ Presensi & Absensi' },
            { key: 'employees', label: '👥 Data Karyawan' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === t.key ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Generator Header */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="text-xs text-blue-200 font-bold uppercase tracking-wider">
                Kalkulator Payroll Berbasis Kinerja & Komisi
              </div>
              <h2 className="text-xl font-bold mt-1">Periode: {selectedPeriod}</h2>
              <p className="text-xs text-blue-100 mt-1 max-w-lg">
                Komisi dihitung langsung dari volume pengerjaan cucian (kg) kasir & operator cuci/setrika serta jumlah pengantaran kurir.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 text-white border border-white/20 text-xs font-semibold p-2.5 rounded-xl"
              >
                <option value="Agustus 2026" className="text-slate-800">Agustus 2026</option>
                <option value="Juli 2026" className="text-slate-800">Juli 2026</option>
              </select>

              <button
                onClick={handleGeneratePayroll}
                className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition"
              >
                Hitung Otomatis
              </button>
            </div>
          </div>

          {/* Payroll Slips Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Daftar Slip Penggajian Karyawan ({payrollSlips.length > 0 ? payrollSlips.length : tenantEmployees.length} Orang)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Karyawan</th>
                    <th className="py-3 px-4">Divisi & Peran</th>
                    <th className="py-3 px-4">Gaji Pokok</th>
                    <th className="py-3 px-4">Komisi Kinerja</th>
                    <th className="py-3 px-4">Bonus & Potongan</th>
                    <th className="py-3 px-4 text-right">Gaji Bersih (THP)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Slip Gaji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payrollSlips.length === 0 ? (
                    tenantEmployees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800">{emp.name}</td>
                        <td className="py-3 px-4">{emp.division} • {emp.role}</td>
                        <td className="py-3 px-4 font-semibold">Rp {emp.baseSalary.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold">+Rp 245.000 (Est)</td>
                        <td className="py-3 px-4 text-slate-500">+Rp 150rb / -Rp 50rb</td>
                        <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                          Rp {(emp.baseSalary + 345000).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            Belum Dihitung
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-400">-</td>
                      </tr>
                    ))
                  ) : (
                    payrollSlips.map(slip => (
                      <tr key={slip.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{slip.employeeName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{slip.division} • {slip.role}</td>
                        <td className="py-3.5 px-4 font-medium">Rp {slip.baseSalary.toLocaleString('id-ID')}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">
                          +Rp {slip.totalCommission.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          +{slip.bonus.toLocaleString('id-ID')} / -{slip.deductions.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-brand-700 text-sm">
                          Rp {slip.netSalary.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            slip.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {slip.paymentStatus === 'paid' ? 'Sudah Ditransfer' : 'Menunggu Bayar'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedSlipForModal(slip)}
                              className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded-lg text-xs flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Lihat Slip</span>
                            </button>
                            {slip.paymentStatus === 'pending' && (
                              <button
                                onClick={() => markPayrollPaid(slip.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                              >
                                Bayar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees.map(emp => {
              const todayAtt = attendance.find(a => a.employeeId === emp.id && a.date === '2026-08-22');

              return (
                <div key={emp.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{emp.name}</div>
                      <div className="text-[11px] text-slate-500">{emp.division}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      todayAtt ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {todayAtt ? `Hadir (${todayAtt.clockIn})` : 'Belum Absen'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        recordAttendance(emp.id, 'present');
                        alert(`Absensi Masuk untuk ${emp.name} berhasil dicatat!`);
                      }}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      Clock In
                    </button>
                    <button
                      onClick={() => {
                        recordAttendance(emp.id, 'present');
                        alert(`Absensi Pulang untuk ${emp.name} berhasil dicatat!`);
                      }}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                    >
                      Clock Out
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attendance History Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
              Catatan Log Presensi Harian
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Nama Karyawan</th>
                  <th className="py-3 px-4">Jam Masuk</th>
                  <th className="py-3 px-4">Jam Keluar</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono">{att.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{att.employeeName}</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">{att.clockIn}</td>
                    <td className="py-3 px-4 text-slate-500">{att.clockOut || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800 uppercase tracking-wider">
            Struktur Tim & Skema Komisi Karyawan
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Karyawan</th>
                <th className="py-3 px-4">Divisi & Jabatan</th>
                <th className="py-3 px-4">Gaji Pokok</th>
                <th className="py-3 px-4">Skema Komisi</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{emp.name}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{emp.division} • {emp.role}</td>
                  <td className="py-3.5 px-4 font-semibold">Rp {emp.baseSalary.toLocaleString('id-ID')}</td>
                  <td className="py-3.5 px-4 text-brand-700 font-medium">
                    {emp.commissionPerKg ? `Rp ${emp.commissionPerKg}/kg` : ''}
                    {emp.commissionPerItem ? ` • Rp ${emp.commissionPerItem}/item` : ''}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{emp.phone}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slip Gaji Modal */}
      {selectedSlipForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Slip Gaji & Komisi Karyawan</h3>
                <div className="text-[11px] text-slate-500">Laundry Bersih Jaya • Periode {selectedSlipForModal.period}</div>
              </div>
              <button onClick={() => setSelectedSlipForModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Karyawan:</span>
                <span className="font-bold text-slate-800">{selectedSlipForModal.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Divisi / Posisi:</span>
                <span>{selectedSlipForModal.division} - {selectedSlipForModal.role}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-100 py-3">
              <div className="flex justify-between">
                <span>Gaji Pokok:</span>
                <span>Rp {selectedSlipForModal.baseSalary.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Total Insentif Komisi Pengerjaan:</span>
                <span>+Rp {selectedSlipForModal.totalCommission.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Bonus Kehadiran / Lembur:</span>
                <span>+Rp {selectedSlipForModal.bonus.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Potongan / Keterlambatan:</span>
                <span>-Rp {selectedSlipForModal.deductions.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Take Home Pay:</span>
                <span className="text-brand-700">Rp {selectedSlipForModal.netSalary.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Slip PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
