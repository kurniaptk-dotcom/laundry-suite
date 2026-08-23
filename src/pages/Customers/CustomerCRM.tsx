import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, MembershipTier, Voucher } from '../../types';
import { 
  Users, Award, Wallet, Gift, Search, Plus, 
  Phone, Mail, MapPin, Sparkles, MessageSquare, 
  ArrowUpRight, Ticket, Check, ChevronRight, Share2,
  Calendar, Cake, AlertCircle, TrendingUp, UserCheck,
  Send, Percent, Trash2, Edit3, ShieldAlert
} from 'lucide-react';

export const CustomerCRM: React.FC = () => {
  const { 
    customers, addCustomer, topupDeposit, 
    redeemPoints, vouchers, sendWhatsAppNotification,
    currentTenant, cashAccounts 
  } = useApp();

  // Active CRM Tab
  const [crmTab, setCrmTab] = useState<'directory' | 'membership' | 'vouchers' | 'referral' | 'campaigns'>('directory');

  // Search & Filters
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'vip' | 'active' | 'inactive'>('all');

  // Topup Deposit Modal
  const [selectedCustForTopup, setSelectedCustForTopup] = useState<Customer | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(100000);
  const [selectedAccount, setSelectedAccount] = useState<string>(cashAccounts[0]?.id || '');

  // Add Customer Modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [tier, setTier] = useState<MembershipTier>('Bronze');
  const [notes, setNotes] = useState('');

  // Voucher CRUD State
  const [voucherList, setVoucherList] = useState<Voucher[]>(vouchers);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [vCode, setVCode] = useState('');
  const [vTitle, setVTitle] = useState('');
  const [vDiscountType, setVDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [vDiscountVal, setVDiscountVal] = useState(15);
  const [vMinOrder, setVMinOrder] = useState(50000);
  const [vValidUntil, setVValidUntil] = useState('2026-12-31');

  // Campaigns broadcast state
  const [campaignMessage, setCampaignMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'vip' | 'inactive'>('all');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.referralCode.toLowerCase().includes(search.toLowerCase());

    const matchesTier = tierFilter === 'all' || c.membershipTier === tierFilter;
    
    let matchesSegment = true;
    if (segmentFilter === 'vip') matchesSegment = c.membershipTier === 'Platinum' || c.membershipTier === 'Gold';
    if (segmentFilter === 'inactive') matchesSegment = c.totalOrders <= 2;
    if (segmentFilter === 'active') matchesSegment = c.totalOrders > 2;

    return matchesSearch && matchesTier && matchesSegment;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addCustomer({
      tenantId: currentTenant.id,
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: address || 'Alamat Belum Diisi',
      membershipTier: tier,
      notes,
    });

    setShowAddCustomerModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
  };

  const handleExecuteTopup = () => {
    if (!selectedCustForTopup || topupAmount <= 0) return;
    topupDeposit(selectedCustForTopup.id, topupAmount, selectedAccount);

    sendWhatsAppNotification(
      selectedCustForTopup.phone,
      selectedCustForTopup.name,
      'promo_blast',
      `Top-up deposit berhasil! Kak ${selectedCustForTopup.name}, saldo deposit sebesar Rp ${topupAmount.toLocaleString('id-ID')} telah masuk ke akun laundry Anda. Terima kasih!`,
    );

    setSelectedCustForTopup(null);
    alert(`Top-up deposit Rp ${topupAmount.toLocaleString('id-ID')} berhasil untuk ${selectedCustForTopup.name}!`);
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCode.trim() || !vTitle.trim()) return;

    const newV: Voucher = {
      id: `vch-${Date.now()}`,
      code: vCode.toUpperCase().trim(),
      title: vTitle,
      discountType: vDiscountType,
      discountValue: vDiscountVal,
      minOrder: vMinOrder,
      validUntil: vValidUntil,
      usageCount: 0,
      maxUsage: 100,
      isActive: true
    };

    setVoucherList(prev => [newV, ...prev]);
    setShowVoucherModal(false);
    setVCode('');
    setVTitle('');
    alert(`Voucher ${newV.code} berhasil dibuat!`);
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignMessage.trim()) return;

    const targets = filteredCustomers;
    targets.forEach(c => {
      sendWhatsAppNotification(
        c.phone,
        c.name,
        'promo_blast',
        `Halo Kak ${c.name}! ${campaignMessage}`
      );
    });

    alert(`Broadcast campaign WhatsApp berhasil dikirim ke ${targets.length} pelanggan!`);
    setCampaignMessage('');
  };

  const getTierColor = (tier: MembershipTier) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Gold': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Silver': return 'bg-slate-200 text-slate-800 border-slate-300';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            CRM, Membership, Loyalty & Program Promosi
          </h1>
          <p className="text-xs text-slate-500">
            Database pelanggan, segmentasi RFM, saldo wallet deposit, kupon voucher, referral, dan kampanye WhatsApp otomatis.
          </p>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          {[
            { key: 'directory', label: '👥 Profil Pelanggan', icon: Users },
            { key: 'membership', label: '🏆 Membership & Saldo', icon: Award },
            { key: 'vouchers', label: '🎟️ Voucher & Promo', icon: Ticket },
            { key: 'referral', label: '🤝 Referral Program', icon: Share2 },
            { key: 'campaigns', label: '📢 Campaign WhatsApp', icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCrmTab(tab.key as any)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                crmTab === tab.key
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. TAB: CUSTOMER DIRECTORY & RFM SEGMENTATION            */}
      {/* ======================================================== */}
      {crmTab === 'directory' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-card">
              <span className="text-[11px] text-slate-500 font-semibold block">Total Pelanggan</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{customers.length} Orang</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-card">
              <span className="text-[11px] text-slate-500 font-semibold block">Member VIP (Platinum/Gold)</span>
              <div className="text-2xl font-black text-purple-700 mt-1">
                {customers.filter(c => c.membershipTier === 'Platinum' || c.membershipTier === 'Gold').length} Member
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-card">
              <span className="text-[11px] text-slate-500 font-semibold block">Total Deposit Mengendap</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                Rp {customers.reduce((s, c) => s + c.depositBalance, 0).toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-card">
              <span className="text-[11px] text-slate-500 font-semibold block">Total Poin Loyalty</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {customers.reduce((s, c) => s + c.loyaltyPoints, 0).toLocaleString('id-ID')} Poin
              </div>
            </div>
          </div>

          {/* Action Bar: Search, Segmentation Filter, + Add Customer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, nomor WA, referral code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value as any)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
              >
                <option value="all">Semua Segmentasi</option>
                <option value="vip">👑 Member VIP & Loyal</option>
                <option value="active">⚡ Pelanggan Aktif</option>
                <option value="inactive">💤 Pelanggan Inaktif (Win-Back)</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
              >
                <option value="all">Semua Tier</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddCustomerModal(true)}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black shadow-md shadow-brand-500/20 flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Pelanggan Baru</span>
            </button>
          </div>

          {/* Customer Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Nama Pelanggan</th>
                    <th className="py-3.5 px-4">Tier Membership</th>
                    <th className="py-3.5 px-4">Saldo Wallet</th>
                    <th className="py-3.5 px-4">Poin Reward</th>
                    <th className="py-3.5 px-4">Total Belanja</th>
                    <th className="py-3.5 px-4">Kode Referral</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{cust.name}</div>
                        <div className="text-[10px] text-slate-400">{cust.phone} • {cust.address}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${getTierColor(cust.membershipTier)}`}>
                          {cust.membershipTier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700 text-xs">
                        Rp {cust.depositBalance.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">
                        ⭐ {cust.loyaltyPoints} Poin
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Rp {cust.totalSpent.toLocaleString('id-ID')} ({cust.totalOrders}x Order)
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                        {cust.referralCode}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedCustForTopup(cust)}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition border border-emerald-200"
                        >
                          + Top Up
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 2. TAB: MEMBERSHIP TIERS & PRIVILEGES                   */}
      {/* ======================================================== */}
      {crmTab === 'membership' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { tier: 'Bronze', color: 'from-orange-700 to-amber-800', discount: 'Diskon 0%', minSpent: 'Pelanggan Baru', points: '1 Poin / Rp 10rb', members: customers.filter(c => c.membershipTier === 'Bronze').length },
              { tier: 'Silver', color: 'from-slate-600 to-slate-800', discount: 'Diskon 5%', minSpent: 'Belanja > Rp 300rb', points: '1.2x Poin', members: customers.filter(c => c.membershipTier === 'Silver').length },
              { tier: 'Gold', color: 'from-amber-500 to-yellow-700', discount: 'Diskon 10%', minSpent: 'Belanja > Rp 1 Juta', points: '1.5x Poin', members: customers.filter(c => c.membershipTier === 'Gold').length },
              { tier: 'Platinum', color: 'from-purple-600 to-indigo-900', discount: 'Diskon 15% + Free Ongkir', minSpent: 'Belanja > Rp 2 Juta', points: '2x Poin + Antrean Prioritas', members: customers.filter(c => c.membershipTier === 'Platinum').length },
            ].map(m => (
              <div key={m.tier} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card flex flex-col justify-between">
                <div className={`p-5 bg-gradient-to-tr ${m.color} text-white space-y-1`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Tier Member</div>
                  <h3 className="text-xl font-black">{m.tier}</h3>
                  <p className="text-xs text-white/90">{m.discount}</p>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Syarat Minimal:</span>
                    <span className="font-bold text-slate-900">{m.minSpent}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Benefit Poin:</span>
                    <span className="font-bold text-slate-900">{m.points}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-100">
                    <span>Anggota Aktif:</span>
                    <span className="font-black text-brand-700">{m.members} Pelanggan</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 3. TAB: VOUCHER & PROMO MANAGEMENT (CRUD)               */}
      {/* ======================================================== */}
      {crmTab === 'vouchers' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-600" />
                Manajemen Kupon Diskon & Voucher Promo (CRUD)
              </h2>
              <p className="text-xs text-slate-500">
                Buat kode promo baru untuk kasir POS dan aplikasi mobile pelanggan (PWA).
              </p>
            </div>
            <button
              onClick={() => setShowVoucherModal(true)}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Voucher Baru</span>
            </button>
          </div>

          {/* Voucher Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {voucherList.map(v => (
              <div key={v.id} className="p-4 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/30 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-brand-800 text-base bg-brand-100 px-2.5 py-0.5 rounded-lg">
                    {v.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Aktif
                  </span>
                </div>

                <div>
                  <div className="font-black text-sm text-slate-900">{v.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Potongan: <strong>{v.discountType === 'percentage' ? `${v.discountValue}%` : `Rp ${v.discountValue.toLocaleString('id-ID')}`}</strong> (Min. Order Rp {v.minOrder.toLocaleString('id-ID')})
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-brand-100">
                  <span>Berlaku s/d: {v.validUntil}</span>
                  <span className="font-bold text-slate-700">Terpakai: {v.usageCount}/{v.maxUsage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 4. TAB: REFERRAL PROGRAM                                */}
      {/* ======================================================== */}
      {crmTab === 'referral' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-600" />
              Program Referral "Ajak Teman Cuci Laundry"
            </h2>
            <p className="text-xs text-slate-500">
              Pelanggan membagikan kode referral dan mendapatkan bonus deposit Rp 10.000 otomatis untuk setiap teman yang melakukan order pertama kali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-xs text-emerald-700 font-bold block">Total Referral Berhasil</span>
              <div className="text-2xl font-black text-emerald-950 mt-1">42 Member Baru</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-xs text-blue-700 font-bold block">Total Reward Terbagikan</span>
              <div className="text-2xl font-black text-blue-950 mt-1">Rp 420.000</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
              <span className="text-xs text-purple-700 font-bold block">Top Referrer Bulan Ini</span>
              <div className="text-base font-black text-purple-950 mt-1">Aisyah Putri (8 Teman)</div>
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 5. TAB: CAMPAIGN BROADCAST WHATSAPP                     */}
      {/* ======================================================== */}
      {crmTab === 'campaigns' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-5 max-w-2xl mx-auto animate-in fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              WhatsApp Marketing & Broadcast Campaign
            </h2>
            <p className="text-xs text-slate-500">
              Kirim promosi otomatis, ucapan ulang tahun, atau kampanye win-back ke pelanggan yang sudah lama tidak mencuci.
            </p>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Segmentasi Pelanggan</label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="all">Semua Pelanggan ({customers.length} Orang)</option>
                <option value="vip">👑 Khusus Member VIP / Platinum</option>
                <option value="inactive">💤 Win-Back: Pelanggan Inaktif (&gt; 14 Hari)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Template Pesan WhatsApp Promosi</label>
              <textarea
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                placeholder="Contoh: Kami kangen baju wangi Kakak! Dapatkan Diskon Spesial 20% untuk cuci kiloan akhir pekan ini dengan kode KANGENLAUNDRY..."
                rows={4}
                required
                className="w-full p-3 border border-slate-300 rounded-2xl text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Broadcast Sekarang</span>
            </button>
          </form>
        </div>
      )}


      {/* ======================================================== */}
      {/* MODAL: TOP UP SALDO DEPOSIT                              */}
      {/* ======================================================== */}
      {selectedCustForTopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Top Up Saldo Deposit Wallet</h3>
              <button onClick={() => setSelectedCustForTopup(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
              <div className="text-slate-500">Nama Pelanggan: <strong>{selectedCustForTopup.name}</strong></div>
              <div className="text-slate-500">Saldo Saat Ini: <strong className="text-emerald-600">Rp {selectedCustForTopup.depositBalance.toLocaleString('id-ID')}</strong></div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Nominal Top Up (Rp):</label>
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(Number(e.target.value))}
                min={10000}
                step={10000}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 font-mono"
              />
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[50000, 100000, 200000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className="p-1.5 bg-slate-100 hover:bg-emerald-50 rounded-lg text-xs font-bold text-slate-700"
                  >
                    Rp {amt / 1000}rb
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustForTopup(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteTopup}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md"
              >
                Konfirmasi Top Up
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* MODAL: TAMBAH VOUCHER PROMO BARU                        */}
      {/* ======================================================== */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Buat Voucher Promo Baru</h3>
              <button onClick={() => setShowVoucherModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kode Voucher (Kupon) *</label>
                <input
                  type="text"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  placeholder="Contoh: HEMAT20, GAJIANBERSIH"
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul Promosi *</label>
                <input
                  type="text"
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  placeholder="Contoh: Diskon Kiloan Spesial Akhir Pekan"
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipe Diskon</label>
                  <select
                    value={vDiscountType}
                    onChange={(e) => setVDiscountType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nilai Diskon</label>
                  <input
                    type="number"
                    value={vDiscountVal}
                    onChange={(e) => setVDiscountVal(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={vMinOrder}
                    onChange={(e) => setVMinOrder(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Berlaku Sampai</label>
                  <input
                    type="date"
                    value={vValidUntil}
                    onChange={(e) => setVValidUntil(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVoucherModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-black shadow-md"
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH PELANGGAN BARU                            */}
      {/* ======================================================== */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Tambah Pelanggan Baru</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Sarah Kartika"
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tier Membership Awal</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Bronze">Bronze (Member Baru)</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum (VIP)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Alamat Domisili</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap untuk kurir antar jemput..."
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-black shadow-md"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
