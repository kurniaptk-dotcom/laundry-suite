import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseEntry } from '../../types';
import { 
  Landmark, TrendingUp, TrendingDown, 
  Plus, Search, Calendar, FileText, ArrowUpRight, 
  ArrowDownRight, Wallet, Receipt, Banknote, BookOpen,
  Scale, Layers, PieChart, CheckCircle2, ShieldCheck
} from 'lucide-react';

export const FinanceAccounting: React.FC = () => {
  const { 
    cashAccounts, expenses, addExpense, 
    orders, currentTenant, currentOutlet 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'expenses' | 'coa' | 'journal' | 'pnl'>('overview');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Expense form state
  const [expCategory, setExpCategory] = useState<ExpenseEntry['category']>('Bahan Baku');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState<number>(150000);
  const [expAccount, setExpAccount] = useState(cashAccounts[0]?.id || '');

  // Calculate Totals
  const totalCashBank = cashAccounts.reduce((sum, a) => sum + a.balance, 0);

  const totalIncome = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalExpenseAmount = expenses
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalIncome - totalExpenseAmount;

  // Chart of Accounts (COA) Model
  const COA_ACCOUNTS = [
    { code: '1-1001', name: 'Kas Laci Kasir POS', type: 'Aset Lancar', balance: 1450000 },
    { code: '1-1002', name: 'Bank BCA Operasional', type: 'Aset Lancar', balance: 18500000 },
    { code: '1-1003', name: 'Bank Mandiri Settlement QRIS', type: 'Aset Lancar', balance: 6850000 },
    { code: '1-1004', name: 'Piutang Laundry Konsinyasi/Hotel', type: 'Aset Lancar', balance: 2400000 },
    { code: '1-1201', name: 'Persediaan Deterjen & Chemical', type: 'Persediaan', balance: 3500000 },
    { code: '1-2001', name: 'Mesin Cuci & Dryer Commercial', type: 'Aset Tetap', balance: 65000000 },
    { code: '2-1001', name: 'Hutang Dagang Supplier Chemical', type: 'Kewajiban', balance: 1200000 },
    { code: '3-1001', name: 'Modal Disetor Pemilik', type: 'Ekuitas', balance: 80000000 },
    { code: '4-1001', name: 'Pendapatan Laundry Kiloan', type: 'Pendapatan', balance: totalIncome * 0.7 },
    { code: '4-1002', name: 'Pendapatan Laundry Satuan & Dry Clean', type: 'Pendapatan', balance: totalIncome * 0.3 },
    { code: '5-1001', name: 'Beban Gaji & Komisi Staff', type: 'Beban Operasional', balance: 3200000 },
    { code: '5-1002', name: 'Beban Listrik, Air & Gas Boiler', type: 'Beban Operasional', balance: 850000 },
  ];

  // General Journal entries
  const JOURNAL_ENTRIES = [
    { id: 'JRN-101', date: '2026-08-22', ref: '#LBJ-8842', desc: 'Penerimaan Kas dari Transaksi POS Budi Santoso', debitAcc: '1-1001 Kas Laci Kasir', debit: 45000, creditAcc: '4-1001 Pendapatan Kiloan', credit: 45000 },
    { id: 'JRN-102', date: '2026-08-22', ref: '#LBJ-9102', desc: 'Penerimaan QRIS Siti Aminah', debitAcc: '1-1003 Mandiri QRIS', debit: 250000, creditAcc: '4-1002 Pendapatan Satuan', credit: 250000 },
    { id: 'JRN-103', date: '2026-08-21', ref: 'EXP-401', desc: 'Pembelian Deterjen Liquid EcoClean 20L', debitAcc: '1-1201 Persediaan Deterjen', debit: 350000, creditAcc: '1-1002 Bank BCA', credit: 350000 },
  ];

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc || expAmount <= 0) return;

    const acc = cashAccounts.find(a => a.id === expAccount) || cashAccounts[0];

    addExpense({
      tenantId: currentTenant?.id || 't-demo',
      outletId: currentOutlet?.id || 'out-1',
      date: new Date().toISOString().slice(0, 10),
      category: expCategory,
      description: expDesc,
      amount: expAmount,
      accountId: acc.id,
      accountName: acc.name,
    });

    setShowAddExpenseModal(false);
    setExpDesc('');
    alert(`Pengeluaran Rp ${expAmount.toLocaleString('id-ID')} berhasil dicatat!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Sub-Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-brand-600" />
            Keuangan, Kas & Bank, dan ERP Akuntansi
          </h1>
          <p className="text-xs text-slate-500">
            Sistem ERP terpadu: Kas & Bank, Beban Operasional, Chart of Accounts (COA), Jurnal Umum, dan Laporan Laba Rugi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[
              { key: 'overview', label: '📊 Laba Rugi (P&L)', icon: PieChart },
              { key: 'accounts', label: '🏦 Kas & Bank', icon: Landmark },
              { key: 'expenses', label: '💸 Pengeluaran Biaya', icon: Receipt },
              { key: 'coa', label: '📚 COA (Akun)', icon: Layers },
              { key: 'journal', label: '📖 Jurnal & Buku Besar', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Biaya</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Summary with Localized Indonesian Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saldo Kas & Bank Total</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            Rp {totalCashBank.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">3 Rekening Aktif Terhubung</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pendapatan (Omzet)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Dari Transaksi Lunas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pengeluaran (Beban)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            Rp {totalExpenseAmount.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-rose-700 mt-1">{expenses.length} Catatan Biaya</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Laba Bersih (Net Profit)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${netProfit >= 0 ? 'text-brand-700' : 'text-rose-600'}`}>
            Rp {netProfit.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-purple-700 mt-1">Margin: {totalIncome > 0 ? `${Math.round((netProfit / totalIncome) * 100)}%` : '0%'}</div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. TAB: OVERVIEW & LABA RUGI (P&L)                       */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in">
          {/* P&L Statement breakdown */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">Laporan Laba Rugi (Profit & Loss Statement)</h2>
              <p className="text-xs text-slate-400">Periode Berjalan: Bulan Ini (Agustus 2026)</p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Income */}
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex justify-between font-black text-emerald-950 text-sm">
                  <span>1. PENDAPATAN OPERASIONAL LAUNDRY</span>
                  <span>Rp {totalIncome.toLocaleString('id-ID')}</span>
                </div>
                <div className="pl-3 space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>• Penjualan Laundry Kiloan & Setrika</span>
                    <span>Rp {(totalIncome * 0.7).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Penjualan Laundry Satuan & Dry Clean</span>
                    <span>Rp {(totalIncome * 0.3).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2">
                <div className="flex justify-between font-black text-rose-950 text-sm">
                  <span>2. BEBAN & PENGELUARAN OPERASIONAL</span>
                  <span>Rp {totalExpenseAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="pl-3 space-y-1 text-slate-600">
                  {expenses.map((e, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {e.category} ({e.description})</span>
                      <span>Rp {e.amount.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Net Profit Summary */}
              <div className="p-4 bg-gradient-to-r from-blue-900 to-brand-950 text-white rounded-2xl flex justify-between items-center text-sm font-black shadow-md">
                <span>LABA BERSIH BERSIH (NET INCOME):</span>
                <span className="text-lg text-amber-300 font-mono">Rp {netProfit.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Cash Account Status */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Rekening Kas & Bank Aktif
            </h3>
            <div className="space-y-3">
              {cashAccounts.map(acc => (
                <div key={acc.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-slate-900">{acc.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                      {acc.type}
                    </span>
                  </div>
                  <div className="text-sm font-black text-brand-700">
                    Rp {acc.balance.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 2. TAB: KAS & BANK ACCOUNTS                             */}
      {/* ======================================================== */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
          {cashAccounts.map(acc => (
            <div key={acc.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  🏦
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {acc.type}
                </span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">{acc.name}</h3>
                <p className="text-xs text-slate-400">Rekening Resmi Operasional Outlet</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Saldo Terkini:</span>
                <span className="text-xl font-black text-brand-700">Rp {acc.balance.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* ======================================================== */}
      {/* 3. TAB: EXPENSES LIST                                    */}
      {/* ======================================================== */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Daftar Pengeluaran & Biaya Operasional</h2>
              <p className="text-xs text-slate-400">Mencatat pembelian bahan baku, listrik, sewa, dan perawatan mesin</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Kategori Biaya</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Sumber Rekening</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono text-slate-600">{exp.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{exp.description}</td>
                    <td className="py-3.5 px-4 text-slate-500">{exp.accountName}</td>
                    <td className="py-3.5 px-4 text-right font-black text-rose-600">
                      Rp {exp.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 4. TAB: CHART OF ACCOUNTS (COA)                          */}
      {/* ======================================================== */}
      {activeTab === 'coa' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              Chart of Accounts (COA Akuntansi Standar)
            </h2>
            <p className="text-xs text-slate-400">Kode akun standar akuntansi untuk pencatatan debit dan kredit transaksi bisnis</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kode Akun</th>
                  <th className="py-3 px-4">Nama Akun Akuntansi</th>
                  <th className="py-3 px-4">Klasifikasi / Tipe</th>
                  <th className="py-3 px-4 text-right">Saldo Terkini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COA_ACCOUNTS.map(coa => (
                  <tr key={coa.code} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">{coa.code}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{coa.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {coa.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                      Rp {coa.balance.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 5. TAB: GENERAL JOURNAL & GENERAL LEDGER                */}
      {/* ======================================================== */}
      {activeTab === 'journal' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              Jurnal Umum & Buku Besar Otomatis (General Ledger)
            </h2>
            <p className="text-xs text-slate-400">Pencatatan mutasi double-entry debit dan kredit secara otomatis dari POS dan transaksi kas</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Jurnal</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Keterangan Transaksi</th>
                  <th className="py-3 px-4">Akun Debit</th>
                  <th className="py-3 px-4 text-right">Debit (Rp)</th>
                  <th className="py-3 px-4">Akun Kredit</th>
                  <th className="py-3 px-4 text-right">Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {JOURNAL_ENTRIES.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{j.id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{j.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{j.desc}</td>
                    <td className="py-3.5 px-4 text-slate-700">{j.debitAcc}</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-700">Rp {j.debit.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 px-4 text-slate-700">{j.creditAcc}</td>
                    <td className="py-3.5 px-4 text-right font-black text-blue-700">Rp {j.credit.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* MODAL: TAMBAH PENGELUARAN BIAYA                         */}
      {/* ======================================================== */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Catat Pengeluaran Biaya Baru</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori Beban / Pengeluaran *</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Bahan Baku">Bahan Baku (Deterjen/Parfum)</option>
                  <option value="Gaji Karyawan">Gaji & Komisi Karyawan</option>
                  <option value="Listrik & Air">Listrik, Air & Gas Boiler</option>
                  <option value="Sewa Tempat">Sewa Tempat / Ruko</option>
                  <option value="Perawatan Mesin">Maintenance & Servis Mesin</option>
                  <option value="Marketing">Marketing & Iklan</option>
                  <option value="Lainnya">Pengeluaran Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Keterangan Biaya *</label>
                <input
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Contoh: Beli Plastik Packing 10 Roll..."
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    min={1000}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-bold text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Sumber Kas / Bank</label>
                  <select
                    value={expAccount}
                    onChange={(e) => setExpAccount(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {cashAccounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl font-black shadow-md"
                >
                  Simpan Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
