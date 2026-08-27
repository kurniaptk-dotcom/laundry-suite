import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, ServiceItem, PaymentMethod } from '../../types';
import { 
  Home, ListOrdered, PlusCircle, Tag, User, 
  Wallet, Bell, ArrowRight, ChevronRight, ArrowLeft, 
  MapPin, Clock, Calendar, CheckCircle2, QrCode, 
  Camera, CreditCard, Gift, Star, Phone, Mail, 
  HelpCircle, Shield, FileText, Info, LogOut, 
  Sparkles, Check, Copy, Percent, ShoppingBag, Plus, Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';

type ScreenType = 
  | 'home'
  | 'orders'
  | 'order_detail'
  | 'booking_step1' // Pilih Layanan
  | 'booking_step2' // Detail Pesanan & Alamat
  | 'booking_step3' // Jadwal Penjemputan
  | 'booking_step4' // Konfirmasi Pesanan
  | 'booking_success'
  | 'wallet'
  | 'topup'
  | 'promo'
  | 'account'
  | 'edit_profile'
  | 'addresses';

export const CustomerTrackingPWA: React.FC = () => {
  const { 
    customers, orders, currentTenant, currentOutlet, 
    addOrder, addDeliveryTask, topupDeposit, vouchers,
    applyVoucherCode 
  } = useApp();

  // Current active customer data
  const [currentUser, setCurrentUser] = useState({
    id: customers[0]?.id || 'cust-1',
    name: 'Aisyah Putri',
    phone: '0812-3456-7890',
    email: 'aisyah@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    address: 'Jl. Melati Putih No. 12, RT 03/RW 04, Jakarta Selatan, 12345',
    depositBalance: 125000,
    loyaltyPoints: 340,
    tier: 'Gold',
  });

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'orders' | 'create' | 'promo' | 'account'>('home');

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  // Booking Flow State
  const [bookingService, setBookingService] = useState<ServiceItem | null>(currentOutlet?.services?.[0] || null);
  const [bookingWeight, setBookingWeight] = useState<number>(5.0);
  const [bookingNotes, setBookingNotes] = useState<string>('Tolong pisahkan pakaian putih.');
  const [bookingAddress, setBookingAddress] = useState<string>(currentUser.address);
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState<PaymentMethod>('deposit');
  const [bookingDate, setBookingDate] = useState<string>('Sel 13');
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('10:00 - 12:00');
  const [bookingVoucher, setBookingVoucher] = useState<string>('BERSIHHEMAT');
  const [bookingDiscount, setBookingDiscount] = useState<number>(5000);

  // Top Up State
  const [topupNominal, setTopupNominal] = useState<number>(50000);
  const [topupMethod, setTopupMethod] = useState<string>('bca_va');

  // Promo Filter State
  const [promoFilter, setPromoFilter] = useState<'all' | 'diskon' | 'cashback' | 'gratis_ongkir'>('all');
  const [promoInputCode, setPromoInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Profile Edit Form State
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editEmail, setEditEmail] = useState(currentUser.email);

  // Booking Calculation
  const subtotal = bookingService ? bookingService.price * (bookingService.unit === 'kg' ? bookingWeight : Math.max(1, bookingWeight)) : 45000;
  const deliveryFee = 10000;
  const totalPay = Math.max(0, subtotal + deliveryFee - bookingDiscount);

  // Navigate Helper
  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  // Submit Booking
  const handleConfirmBooking = () => {
    if (!bookingService) {
      alert('Harap pilih layanan laundry terlebih dahulu.');
      return;
    }
    const created = addOrder({
      tenantId: currentTenant?.id || 't-demo',
      outletId: currentOutlet?.id || 'out-1',
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerAddress: bookingAddress,
      orderType: 'pickup_delivery',
      status: 'received',
      paymentStatus: bookingPaymentMethod === 'deposit' ? 'paid' : 'unpaid',
      paymentMethod: bookingPaymentMethod,
      items: [
        {
          id: `itm-${Date.now()}`,
          serviceId: bookingService.id,
          serviceName: bookingService.name,
          category: bookingService.category,
          unit: bookingService.unit,
          qty: bookingWeight,
          unitPrice: bookingService.price,
          subtotal,
          notes: bookingNotes,
        }
      ],
      totalWeightKg: bookingService.unit === 'kg' ? bookingWeight : undefined,
      totalPcs: bookingService.unit !== 'kg' ? bookingWeight : undefined,
      subtotal,
      discount: bookingDiscount,
      deliveryFee,
      totalAmount: totalPay,
      paidAmount: bookingPaymentMethod === 'deposit' ? totalPay : 0,
      estimatedReady: 'Besok, 18:00 WIB',
      perfumeChoice: 'Sakura Blossom (Favorit)',
      notes: bookingNotes,
      tags: ['Online PWA Booking', 'Antar Jemput'],
    });

    // Also add to dispatch delivery
    addDeliveryTask({
      orderId: created.id,
      invoiceNumber: `REQ-PCK-${Date.now().toString().slice(-4)}`,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      address: bookingAddress,
      type: 'pickup',
      status: 'pending',
      scheduledTime: `${bookingDate}, ${bookingTimeSlot}`,
      notes: `Estimasi berat: ${bookingWeight} kg. ${bookingNotes}`,
    });

    if (bookingPaymentMethod === 'deposit') {
      setCurrentUser(prev => ({ ...prev, depositBalance: Math.max(0, prev.depositBalance - totalPay) }));
    }

    setSelectedOrder(created);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setCurrentScreen('booking_success');
  };

  // Top Up Action
  const handleExecuteTopup = () => {
    topupDeposit(currentUser.id, topupNominal, 'acc-1');
    setCurrentUser(prev => ({ ...prev, depositBalance: prev.depositBalance + topupNominal }));
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    alert(`Top Up sebesar Rp ${topupNominal.toLocaleString('id-ID')} berhasil ditambahkan ke saldo Wallet!`);
    setCurrentScreen('wallet');
  };

  // Copy Promo Code
  const handleCopyPromo = (code: string) => {
    setCopiedCode(code);
    setBookingVoucher(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: editName,
      phone: editPhone,
      email: editEmail
    }));
    alert('Profil berhasil diperbarui!');
    setCurrentScreen('account');
  };

  return (
    <div className="py-6 px-3 sm:px-6 flex justify-center bg-slate-100 min-h-screen">
      {/* Smartphone Device Frame */}
      <div className="w-full max-w-[420px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 flex flex-col min-h-[850px] relative overflow-hidden">
        
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2"></div>
          <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Screen Content Container */}
        <div className="bg-white rounded-[40px] overflow-hidden flex-1 flex flex-col relative">
          
          {/* ======================================================== */}
          {/* 1. SCREEN: HOME DASHBOARD */}
          {/* ======================================================== */}
          {currentScreen === 'home' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              {/* Header Profile & Bell */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-extrabold text-base text-slate-900">
                    <span>Halo, {currentUser.name.split(' ')[0]}</span>
                    <span>👋</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Bersih itu nyaman</div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigateTo('wallet')}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 relative hover:bg-slate-200 transition"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-2 right-2"></span>
                  </button>
                  <img 
                    src={currentUser.avatar} 
                    alt="Profile" 
                    onClick={() => { setCurrentScreen('account'); setActiveBottomNav('account'); }}
                    className="w-9 h-9 rounded-full object-cover border-2 border-brand-600 cursor-pointer shadow-xs"
                  />
                </div>
              </div>

              {/* Promo Banner Card */}
              <div className="px-5 py-2">
                <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-500 rounded-2xl p-4 text-white shadow-lg shadow-brand-500/20 relative overflow-hidden flex justify-between items-center">
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-100 bg-white/20 px-2 py-0.5 rounded-md inline-block">
                      DISKON SPESIAL
                    </span>
                    <div className="text-2xl font-black tracking-tight">20% OFF</div>
                    <div className="text-[10px] text-blue-100">Untuk Order Pertama Anda</div>
                    <button 
                      onClick={() => { setCurrentScreen('booking_step1'); setActiveBottomNav('create'); }}
                      className="mt-2 px-3 py-1 bg-white text-brand-700 font-bold text-[11px] rounded-lg shadow-sm hover:bg-brand-50 transition"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                  <div className="w-24 h-24 bg-white/10 rounded-full absolute -right-4 -bottom-4 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-white/30" />
                  </div>
                </div>
              </div>

              {/* Saldo Wallet Card */}
              <div className="px-5 py-2">
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">SALDO WALLET</div>
                      <div className="text-base font-extrabold text-slate-900">
                        Rp {currentUser.depositBalance.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigateTo('topup')}
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    Top Up
                  </button>
                </div>
              </div>

              {/* Layanan Kami Grid */}
              <div className="px-5 pt-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">Layanan Kami</span>
                  <button 
                    onClick={() => { setCurrentScreen('booking_step1'); setActiveBottomNav('create'); }}
                    className="text-[11px] font-bold text-brand-600 hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { name: 'Cuci & Setrika', icon: '🧺', srv: currentOutlet.services[0] },
                    { name: 'Cuci Kering', icon: '👕', srv: currentOutlet.services[2] },
                    { name: 'Setrika Saja', icon: '⚡', srv: currentOutlet.services[0] },
                    { name: 'Bed Cover', icon: '🛋️', srv: currentOutlet.services[3] },
                    { name: 'Sepatu', icon: '👟', srv: currentOutlet.services[6] },
                    { name: 'Jas Satuan', icon: '👔', srv: currentOutlet.services[5] },
                    { name: 'Karpet', icon: '✨', srv: currentOutlet.services[7] },
                    { name: 'Tas Kulit', icon: '👜', srv: currentOutlet.services[6] },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBookingService(item.srv);
                        setCurrentScreen('booking_step1');
                        setActiveBottomNav('create');
                      }}
                      className="p-2.5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-500 flex flex-col items-center gap-1.5 transition text-center shadow-xs group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50/70 group-hover:bg-brand-50 text-xl flex items-center justify-center transition">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pesanan Aktif Card */}
              <div className="px-5 pt-4 space-y-2">
                <span className="text-xs font-extrabold text-slate-900">Pesanan Aktif</span>
                <div 
                  onClick={() => { setSelectedOrder(orders[0]); navigateTo('order_detail'); }}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm hover:border-brand-400 cursor-pointer transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">#{orders[0]?.trackingCode || 'LBJ-8842'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Sedang Dicuci
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">Cuci & Setrika • 5.5 Kg</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-600" />
                        <span>Selesai: 24 Ags 2026, 14:00 WIB</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Promo Spesial Section */}
              <div className="px-5 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">Promo Spesial</span>
                  <button onClick={() => { setCurrentScreen('promo'); setActiveBottomNav('promo'); }} className="text-[11px] font-bold text-brand-600">
                    Lihat Semua
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-dashed border-brand-300 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Cuci Hemat 15%</div>
                      <div className="text-[10px] text-slate-400">Min. order Rp 50.000 • Kode: BERSIHHEMAT</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopyPromo('BERSIHHEMAT')}
                    className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 text-[10px] font-bold rounded-lg"
                  >
                    {copiedCode === 'BERSIHHEMAT' ? 'Disalin ✓' : 'Klaim'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. SCREEN: TRACKING / DETAIL PESANAN */}
          {/* ======================================================== */}
          {currentScreen === 'order_detail' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              {/* Header */}
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('home')} className="p-1 hover:bg-slate-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Detail Pesanan</span>
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </div>

              <div className="p-4 space-y-4">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-brand-700 to-brand-600 text-white rounded-2xl p-4 space-y-1">
                  <div className="font-mono text-[11px] text-blue-200">#{selectedOrder?.trackingCode || 'LBJ-8842'}</div>
                  <div className="font-extrabold text-base">
                    {selectedOrder?.items[0]?.serviceName || 'Cuci & Setrika'} • {selectedOrder?.totalWeightKg || 5} Kg
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                    {selectedOrder?.status.toUpperCase() || 'SEDANG DICUCI'}
                  </span>
                </div>

                {/* Timeline Stepper */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Status Pengerjaan Cucian
                  </span>

                  <div className="space-y-3.5 pl-6 border-l-2 border-brand-200 relative ml-2 py-1">
                    {[
                      { title: 'Pesanan Diterima di Outlet', time: '15 Mei 2026, 10:30 WIB', done: true },
                      { title: 'Sedang Dicuci di Mesin', time: '15 Mei 2026, 11:30 WIB', current: true },
                      { title: 'Proses Pengeringan Suhu Terkontrol', time: 'Menunggu', pending: true },
                      { title: 'Setrika Uap & Pewangi Sakura', time: 'Menunggu', pending: true },
                      { title: 'QC, Packing Seal & Siap Diantar', time: 'Menunggu', pending: true },
                    ].map((step, idx) => (
                      <div key={idx} className="relative text-xs">
                        <div className={`absolute -left-[31px] -top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step.done ? 'bg-brand-600 text-white' :
                          step.current ? 'bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse' :
                          'bg-slate-200 text-slate-400'
                        }`}>
                          {step.done ? '✓' : idx + 1}
                        </div>
                        <div className={`font-bold ${step.current ? 'text-brand-700' : step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{step.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2 text-xs">
                  <span className="font-extrabold text-slate-900 uppercase text-[11px] block border-b border-slate-100 pb-2">
                    Rincian Order
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Layanan:</span>
                    <span className="font-semibold text-slate-800">{selectedOrder?.items[0]?.serviceName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Berat Timbangan:</span>
                    <span className="font-semibold text-slate-800">{selectedOrder?.totalWeightKg || 5} Kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Pilihan Parfum:</span>
                    <span className="font-semibold text-brand-700">🌸 {selectedOrder?.perfumeChoice || 'Sakura Blossom'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Jadwal Selesai:</span>
                    <span className="font-bold text-slate-900">{selectedOrder?.estimatedReady}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-900 font-extrabold text-sm pt-2">
                    <span>Total Tagihan:</span>
                    <span className="text-brand-700">Rp {selectedOrder?.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. MULTI-STEP BOOKING FLOW */}
          {/* ======================================================== */}
          
          {/* Step 1: Pilih Layanan */}
          {currentScreen === 'booking_step1' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('home')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Buat Pesanan</span>
                <div className="w-5"></div>
              </div>

              {/* 4-Step Stepper Bar */}
              <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                {[
                  { step: 1, label: 'Layanan', active: true },
                  { step: 2, label: 'Detail' },
                  { step: 3, label: 'Jadwal' },
                  { step: 4, label: 'Konfirmasi' },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      s.active ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {s.step}
                    </div>
                    <span className={`text-[9px] font-semibold ${s.active ? 'text-brand-700' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 space-y-3 flex-1">
                <span className="text-xs font-extrabold text-slate-900">Pilih Layanan Laundry</span>

                <div className="space-y-2.5">
                  {(currentOutlet?.services || []).map(srv => (
                    <div
                      key={srv.id}
                      onClick={() => setBookingService(srv)}
                      className={`p-3.5 rounded-2xl border bg-white cursor-pointer transition flex items-center justify-between ${
                        bookingService?.id === srv.id
                          ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                          bookingService?.id === srv.id ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {srv.category === 'kiloan' ? '🧺' : srv.category === 'satuan' ? '👔' : '👟'}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{srv.name}</div>
                          <div className="text-[11px] text-brand-600 font-extrabold mt-0.5">
                            Rp {srv.price.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">/{srv.unit}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        bookingService?.id === srv.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                      }`}>
                        {bookingService?.id === srv.id && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="p-4 bg-white border-t border-slate-100">
                <button
                  onClick={() => navigateTo('booking_step2')}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition"
                >
                  Lanjutkan ke Detail
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Detail Pesanan & Alamat */}
          {currentScreen === 'booking_step2' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('booking_step1')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Detail Pesanan</span>
                <div className="w-5"></div>
              </div>

              {/* Stepper Bar */}
              <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                {[
                  { step: 1, label: 'Layanan', done: true },
                  { step: 2, label: 'Detail', active: true },
                  { step: 3, label: 'Jadwal' },
                  { step: 4, label: 'Konfirmasi' },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      s.active ? 'bg-brand-600 text-white ring-4 ring-brand-100' : s.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {s.done ? '✓' : s.step}
                    </div>
                    <span className={`text-[9px] font-semibold ${s.active ? 'text-brand-700' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 space-y-4 flex-1">
                {/* Weight Input Box */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-xs font-extrabold text-slate-900">Estimasi Berat / Jumlah</span>
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-600 font-medium">Estimasi Berat (Kg):</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBookingWeight(Math.max(1, bookingWeight - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm text-slate-900 w-8 text-center">{bookingWeight}</span>
                      <button
                        onClick={() => setBookingWeight(bookingWeight + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes Input */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1.5">
                  <span className="text-xs font-extrabold text-slate-900">Catatan Khusus (Opsional)</span>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Contoh: Pisahkan pakaian putih, minta hanger..."
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Address Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">Alamat Penjemputan</span>
                    <button onClick={() => navigateTo('addresses')} className="text-[11px] font-bold text-brand-600">Ubah</button>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-slate-800">Rumah - {currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{bookingAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-xs font-extrabold text-slate-900">Metode Pembayaran</span>
                  <div className="space-y-2">
                    <div
                      onClick={() => setBookingPaymentMethod('deposit')}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        bookingPaymentMethod === 'deposit' ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-brand-600" />
                        <div>
                          <div className="font-bold text-xs text-slate-900">Saldo Wallet</div>
                          <div className="text-[10px] text-slate-500">Sisa Saldo: Rp {currentUser.depositBalance.toLocaleString('id-ID')}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${bookingPaymentMethod === 'deposit' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
                    </div>

                    <div
                      onClick={() => setBookingPaymentMethod('cash')}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        bookingPaymentMethod === 'cash' ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-slate-600" />
                        <div className="font-bold text-xs text-slate-900">Tunai / Bayar Saat Diambil</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${bookingPaymentMethod === 'cash' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <button
                  onClick={() => navigateTo('booking_step3')}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition"
                >
                  Pilih Jadwal Penjemputan
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pilih Jadwal Penjemputan */}
          {currentScreen === 'booking_step3' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('booking_step2')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Pilih Jadwal</span>
                <div className="w-5"></div>
              </div>

              {/* Stepper Bar */}
              <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                {[
                  { step: 1, label: 'Layanan', done: true },
                  { step: 2, label: 'Detail', done: true },
                  { step: 3, label: 'Jadwal', active: true },
                  { step: 4, label: 'Konfirmasi' },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      s.active ? 'bg-brand-600 text-white ring-4 ring-brand-100' : s.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {s.done ? '✓' : s.step}
                    </div>
                    <span className={`text-[9px] font-semibold ${s.active ? 'text-brand-700' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 space-y-4 flex-1">
                <span className="text-xs font-extrabold text-slate-900">Pilih Hari Penjemputan</span>
                
                {/* Date Picker Pills */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { day: 'SEN', date: '12' },
                    { day: 'SEL', date: '13' },
                    { day: 'RAB', date: '14' },
                    { day: 'KAM', date: '15' },
                    { day: 'JUM', date: '16' },
                  ].map((d, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBookingDate(`${d.day} ${d.date}`)}
                      className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center ${
                        bookingDate === `${d.day} ${d.date}`
                          ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-semibold opacity-80">{d.day}</span>
                      <span className="text-sm font-black">{d.date}</span>
                    </button>
                  ))}
                </div>

                <span className="text-xs font-extrabold text-slate-900 pt-2 block">Pilih Jam Penjemputan Kurir</span>
                
                {/* Time Slots */}
                <div className="space-y-2">
                  {[
                    '08:00 - 10:00 WIB',
                    '10:00 - 12:00 WIB',
                    '13:00 - 15:00 WIB',
                    '15:00 - 17:00 WIB',
                  ].map((slot, idx) => (
                    <div
                      key={idx}
                      onClick={() => setBookingTimeSlot(slot)}
                      className={`p-3.5 rounded-2xl border bg-white flex items-center justify-between cursor-pointer transition ${
                        bookingTimeSlot === slot ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 font-bold text-xs text-slate-800">
                        <Clock className="w-4 h-4 text-brand-600" />
                        <span>{slot}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${bookingTimeSlot === slot ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <button
                  onClick={() => navigateTo('booking_step4')}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition"
                >
                  Lihat Ringkasan & Konfirmasi
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Konfirmasi Pesanan */}
          {currentScreen === 'booking_step4' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('booking_step3')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Konfirmasi Pesanan</span>
                <div className="w-5"></div>
              </div>

              <div className="p-4 space-y-3.5 flex-1">
                {/* Summary Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Layanan</span>
                      <div className="font-bold text-xs text-slate-900">{bookingService?.name || 'Layanan Laundry'}</div>
                      <div className="text-[11px] text-slate-500">Estimasi: {bookingWeight} Kg</div>
                    </div>
                    <button onClick={() => navigateTo('booking_step1')} className="text-[10px] font-bold text-brand-600">Ubah</button>
                  </div>

                  <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Jadwal Jemput</span>
                      <div className="font-bold text-xs text-slate-900">{bookingDate}, {bookingTimeSlot}</div>
                    </div>
                    <button onClick={() => navigateTo('booking_step3')} className="text-[10px] font-bold text-brand-600">Ubah</button>
                  </div>

                  <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Alamat Jemput</span>
                      <div className="text-[11px] text-slate-700 max-w-[200px] truncate">{bookingAddress}</div>
                    </div>
                    <button onClick={() => navigateTo('booking_step2')} className="text-[10px] font-bold text-brand-600">Ubah</button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Pembayaran</span>
                      <div className="font-bold text-xs text-slate-900 capitalize">{bookingPaymentMethod === 'deposit' ? 'Saldo Wallet' : 'Tunai'}</div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600">Rp {currentUser.depositBalance.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 text-xs">
                  <span className="font-extrabold text-slate-900 uppercase text-[11px] block border-b border-slate-100 pb-2">
                    Rincian Pembayaran
                  </span>
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({bookingWeight} Kg):</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkos Kirim Kurir:</span>
                    <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                  </div>
                  {bookingDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Diskon Promo:</span>
                      <span>-Rp {bookingDiscount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                    <span>Total Bayar:</span>
                    <span className="text-brand-700">Rp {totalPay.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition"
                >
                  Konfirmasi & Kirim Pesanan
                </button>
              </div>
            </div>
          )}

          {/* Booking Success Screen */}
          {currentScreen === 'booking_success' && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Pesanan Berhasil Dibuat!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Kurir kami akan menjemput cucian Anda pada <b>{bookingDate}, {bookingTimeSlot}</b>.
                </p>
              </div>
              <div className="w-full space-y-2 pt-4">
                <button
                  onClick={() => navigateTo('order_detail')}
                  className="w-full py-3 bg-brand-600 text-white rounded-2xl font-bold text-xs shadow-md"
                >
                  Lacak Status Pesanan
                </button>
                <button
                  onClick={() => navigateTo('home')}
                  className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. SCREEN: WALLET & RIWAYAT TRANSAKSI */}
          {/* ======================================================== */}
          {currentScreen === 'wallet' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('home')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Wallet & Saldo</span>
                <div className="w-5"></div>
              </div>

              <div className="p-4 space-y-4">
                {/* Metallic Wallet Card */}
                <div className="bg-gradient-to-tr from-brand-800 via-brand-700 to-blue-600 text-white rounded-3xl p-5 shadow-xl space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                      SALDO WALLET ANDA
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Aman & Terlindungi
                    </span>
                  </div>

                  <div className="text-2xl font-black tracking-tight">
                    Rp {currentUser.depositBalance.toLocaleString('id-ID')}
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-blue-100 pt-2 border-t border-white/10">
                    <span>Poin Loyalty: <b>{currentUser.loyaltyPoints} Poin</b></span>
                    <span>Tier: <b>{currentUser.tier}</b></span>
                  </div>
                </div>

                {/* 4 Quick Actions Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Top Up', icon: PlusCircle, action: () => navigateTo('topup') },
                    { label: 'Riwayat', icon: ListOrdered, action: () => {} },
                    { label: 'Promo', icon: Tag, action: () => navigateTo('promo') },
                    { label: 'Voucher', icon: Gift, action: () => navigateTo('promo') },
                  ].map((btn, idx) => {
                    const Icon = btn.icon;
                    return (
                      <button
                        key={idx}
                        onClick={btn.action}
                        className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-1 shadow-xs hover:bg-slate-50 transition"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{btn.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Transaction History List */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                    Riwayat Transaksi Terakhir
                  </span>

                  <div className="space-y-2.5 divide-y divide-slate-100">
                    {[
                      { title: 'Top Up Wallet BCA', date: '15 Mei 2026, 09:00', amount: '+Rp 100.000', positive: true },
                      { title: 'Pembayaran Cuci & Setrika', date: '15 Mei 2026, 11:30', amount: '-Rp 35.000', positive: false },
                      { title: 'Pembayaran Bed Cover King', date: '12 Mei 2026, 14:20', amount: '-Rp 28.000', positive: false },
                      { title: 'Top Up Wallet Mandiri', date: '10 Mei 2026, 08:45', amount: '+Rp 50.000', positive: true },
                    ].map((tx, i) => (
                      <div key={i} className="pt-2 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{tx.title}</div>
                          <div className="text-[10px] text-slate-400">{tx.date}</div>
                        </div>
                        <span className={`font-extrabold ${tx.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('topup')}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition"
                >
                  Top Up Saldo Sekarang
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. SCREEN: TOP UP SALDO */}
          {/* ======================================================== */}
          {currentScreen === 'topup' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('wallet')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Top Up Saldo</span>
                <div className="w-5"></div>
              </div>

              <div className="p-4 space-y-4 flex-1">
                {/* Nominal Input & Quick Chips */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <span className="text-xs font-extrabold text-slate-900">Nominal Top Up</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 flex items-center">
                    <span className="font-bold text-slate-500 mr-1 text-sm">Rp</span>
                    <input
                      type="number"
                      value={topupNominal || ''}
                      onChange={(e) => setTopupNominal(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent font-black text-lg text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[20000, 50000, 100000, 200000].map(val => (
                      <button
                        key={val}
                        onClick={() => setTopupNominal(val)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          topupNominal === val ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        Rp {(val/1000)}rb
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Channels */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                    Pilih Metode Pembayaran
                  </span>

                  <div className="space-y-2 text-xs">
                    {[
                      { id: 'bca_va', name: 'BCA Virtual Account', type: 'Instant VA' },
                      { id: 'mandiri_va', name: 'Mandiri Virtual Account', type: 'Instant VA' },
                      { id: 'qris', name: 'QRIS (GoPay, OVO, DANA)', type: 'Instant QR' },
                      { id: 'cc', name: 'Kartu Kredit / Debit Online', type: 'Visa/Mastercard' },
                    ].map(ch => (
                      <div
                        key={ch.id}
                        onClick={() => setTopupMethod(ch.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          topupMethod === ch.id ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-800">{ch.name}</div>
                          <div className="text-[10px] text-slate-400">{ch.type}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${topupMethod === ch.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <button
                  onClick={handleExecuteTopup}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition"
                >
                  Bayar Rp {topupNominal.toLocaleString('id-ID')} Sekarang
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. SCREEN: DAFTAR PROMO & VOUCHER SAYA */}
          {/* ======================================================== */}
          {currentScreen === 'promo' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('home')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Promo & Voucher</span>
                <div className="w-5"></div>
              </div>

              <div className="p-4 space-y-4 flex-1">
                {/* Input Promo Code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ketik kode promo (misal: BERSIHHEMAT)..."
                    value={promoInputCode}
                    onChange={(e) => setPromoInputCode(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl uppercase font-mono font-bold"
                  />
                  <button
                    onClick={() => {
                      if (promoInputCode.trim()) {
                        handleCopyPromo(promoInputCode.trim());
                        alert(`Kode promo ${promoInputCode} berhasil digunakan!`);
                      }
                    }}
                    className="px-4 bg-brand-600 text-white font-bold text-xs rounded-xl"
                  >
                    Terapkan
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {[
                    { key: 'all', label: 'Semua' },
                    { key: 'diskon', label: 'Diskon 20%' },
                    { key: 'cashback', label: 'Cashback' },
                    { key: 'gratis_ongkir', label: 'Gratis Ongkir' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setPromoFilter(f.key as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        promoFilter === f.key ? 'bg-brand-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Voucher Cards List */}
                <div className="space-y-3">
                  {[
                    { code: 'BERSIHHEMAT', title: 'Diskon 20% Cucian Kiloan', desc: 'Min. order Rp 50.000 • Berlaku hingga 31 Mei 2026', tag: 'Diskon' },
                    { code: 'ONGKIRGRATIS', title: 'Gratis Ongkir Penjemputan', desc: 'Untuk semua layanan delivery kurir', tag: 'Ongkir' },
                    { code: 'CASHBACK10', title: 'Cashback Saldo Rp 10.000', desc: 'Maks. cashback Rp 10.000 ke saldo Wallet', tag: 'Cashback' },
                  ].map((v, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-brand-700">
                          {v.tag}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Kode: {v.code}</span>
                      </div>

                      <div>
                        <div className="font-extrabold text-xs text-slate-900">{v.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{v.desc}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                          {v.code}
                        </span>
                        <button
                          onClick={() => handleCopyPromo(v.code)}
                          className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          {copiedCode === v.code ? 'Digunakan ✓' : 'Gunakan'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. SCREEN: AKUN SAYA (PROFILE & SETTINGS) */}
          {/* ======================================================== */}
          {currentScreen === 'account' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <span className="font-extrabold text-sm text-slate-900">Akun Saya</span>
                <Sparkles className="w-4 h-4 text-brand-600" />
              </div>

              <div className="p-4 space-y-4">
                {/* Profile Card */}
                <div className="bg-gradient-to-r from-brand-700 to-brand-600 rounded-3xl p-4 text-white flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <div className="font-extrabold text-sm">{currentUser.name}</div>
                      <div className="text-[11px] text-blue-100">{currentUser.phone}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('edit_profile')}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold rounded-xl backdrop-blur-sm transition"
                  >
                    Ubah Profil
                  </button>
                </div>

                {/* Account Menu List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
                  {[
                    { label: 'Alamat Saya', icon: MapPin, action: () => navigateTo('addresses') },
                    { label: 'Metode Pembayaran & Wallet', icon: CreditCard, action: () => navigateTo('wallet') },
                    { label: 'Pengaturan Notifikasi', icon: Bell, action: () => alert('Notifikasi WhatsApp & PWA aktif!') },
                    { label: 'Bantuan & FAQ', icon: HelpCircle, action: () => alert('Hubungi CS Hotline: 0812-8899-0011') },
                    { label: 'Syarat & Ketentuan', icon: FileText, action: () => alert('Syarat & Ketentuan Layanan Laundry Suite') },
                    { label: 'Kebijakan Privasi', icon: Shield, action: () => alert('Privasi data Anda aman dan terenkripsi.') },
                    { label: 'Tentang Laundry Suite', icon: Info, action: () => alert('Laundry Suite v1.0 • Platform SaaS Laundry Indonesia') },
                  ].map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={i}
                        onClick={m.action}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3 text-slate-800 font-semibold">
                          <Icon className="w-4 h-4 text-brand-600" />
                          <span>{m.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    );
                  })}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => alert('Simulasi Logout berhasil.')}
                  className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold text-xs border border-rose-200 flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 8. SCREEN: UBAH PROFIL (EDIT PROFILE) */}
          {/* ======================================================== */}
          {currentScreen === 'edit_profile' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <button onClick={() => navigateTo('account')} className="p-1">
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <span className="font-extrabold text-sm text-slate-900">Ubah Profil</span>
                <div className="w-5"></div>
              </div>

              <form onSubmit={handleSaveProfile} className="p-4 space-y-4 flex-1">
                <div className="flex flex-col items-center py-2">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center absolute bottom-0 right-0 shadow-sm cursor-pointer">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Nomor HP / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* 9. SCREEN: DAFTAR PESANAN SAYA */}
          {/* ======================================================== */}
          {currentScreen === 'orders' && (
            <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-20 pt-8">
              <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <span className="font-extrabold text-sm text-slate-900">Pesanan Saya</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-brand-700">
                  {orders.length} Order
                </span>
              </div>

              <div className="p-4 space-y-3">
                {orders.map(ord => (
                  <div
                    key={ord.id}
                    onClick={() => { setSelectedOrder(ord); navigateTo('order_detail'); }}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-brand-400 cursor-pointer transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-slate-900">#{ord.trackingCode}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ord.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'washing' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800">
                      {ord.items[0]?.serviceName} • {ord.totalWeightKg ? `${ord.totalWeightKg} Kg` : `${ord.totalPcs || 1} Pcs`}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{ord.createdAt}</span>
                      <span className="font-extrabold text-slate-900">Rp {ord.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* BOTTOM NAVIGATION BAR (Fixed Mobile Tab Bar) */}
          {/* ======================================================== */}
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200/80 px-4 py-2 flex items-center justify-between z-40 shadow-lg">
            {/* Beranda */}
            <button
              onClick={() => { setCurrentScreen('home'); setActiveBottomNav('home'); }}
              className={`flex flex-col items-center gap-1 transition ${
                activeBottomNav === 'home' ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[9px]">Beranda</span>
            </button>

            {/* Pesanan */}
            <button
              onClick={() => { setCurrentScreen('orders'); setActiveBottomNav('orders'); }}
              className={`flex flex-col items-center gap-1 transition ${
                activeBottomNav === 'orders' ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ListOrdered className="w-5 h-5" />
              <span className="text-[9px]">Pesanan</span>
            </button>

            {/* Center Floating Action: Buat Pesanan */}
            <button
              onClick={() => { setCurrentScreen('booking_step1'); setActiveBottomNav('create'); }}
              className="w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center -mt-5 shadow-lg shadow-brand-500/30 active:scale-95 transition"
            >
              <Plus className="w-6 h-6" />
            </button>

            {/* Promo */}
            <button
              onClick={() => { setCurrentScreen('promo'); setActiveBottomNav('promo'); }}
              className={`flex flex-col items-center gap-1 transition ${
                activeBottomNav === 'promo' ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Tag className="w-5 h-5" />
              <span className="text-[9px]">Promo</span>
            </button>

            {/* Akun */}
            <button
              onClick={() => { setCurrentScreen('account'); setActiveBottomNav('account'); }}
              className={`flex flex-col items-center gap-1 transition ${
                activeBottomNav === 'account' ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[9px]">Akun</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
