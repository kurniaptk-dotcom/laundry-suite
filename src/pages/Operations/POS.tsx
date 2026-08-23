import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem, Customer, PaymentMethod, Order } from '../../types';
import { 
  Search, Plus, User, ShoppingBag, Sparkles, 
  Trash2, Tag, Percent, QrCode, CreditCard, 
  Wallet, Banknote, Printer, Clock, Zap, 
  CheckCircle2, AlertCircle, ArrowRight, Edit3,
  Settings, Layers, Sliders, Check, X, ShieldAlert,
  Coins, UserCheck, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface POSProps {
  onOrderCreated: (order: Order) => void;
}

export const POS: React.FC<POSProps> = ({ onOrderCreated }) => {
  const { 
    currentTenant, currentOutlet, customers, 
    addCustomer, addOrder, applyVoucherCode,
    services, addService, updateService, deleteService,
    perfumes, addPerfume, deletePerfume,
    cashierShifts, currentShift, openShift, closeShift,
    currentRole
  } = useApp();

  // POS Module Mode: 'pos_cashier' | 'crud_services' | 'crud_perfumes' | 'shifts'
  const [posMode, setPosMode] = useState<'pos_cashier' | 'crud_services' | 'crud_perfumes' | 'shifts'>('pos_cashier');

  // =================== POS CASHIER STATE ===================
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'kiloan' | 'satuan' | 'sepatu_tas' | 'karpet_linen'>('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Cart / Order Items
  const [cartItems, setCartItems] = useState<Array<{
    service: ServiceItem;
    qty: number;
    notes?: string;
  }>>([
    { service: services[0] || { id: 'srv-1', name: 'Cuci Setrika Reguler', category: 'kiloan', unit: 'kg', price: 10000, durationHours: 48 }, qty: 4.5, notes: 'Warna campur' }
  ]);

  // Order Options
  const [selectedPerfume, setSelectedPerfume] = useState(perfumes[0] || 'Sakura Blossom (Favorit)');
  const [isExpress, setIsExpress] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // =================== CRUD SERVICE MODAL STATE ===================
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormName, setServiceFormName] = useState('');
  const [serviceFormCategory, setServiceFormCategory] = useState<'kiloan' | 'satuan' | 'sepatu_tas' | 'karpet_linen'>('kiloan');
  const [serviceFormUnit, setServiceFormUnit] = useState<'kg' | 'pcs' | 'pasang' | 'm2'>('kg');
  const [serviceFormPrice, setServiceFormPrice] = useState<number>(10000);
  const [serviceFormDuration, setServiceFormDuration] = useState<number>(48);
  const [serviceFormMinQty, setServiceFormMinQty] = useState<number>(1);
  const [serviceFormDesc, setServiceFormDesc] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');

  // =================== CRUD PERFUME STATE ===================
  const [newPerfumeInput, setNewPerfumeInput] = useState('');

  // =================== CASHIER SHIFT STATE ===================
  const [openShiftInitialCash, setOpenShiftInitialCash] = useState<number>(300000);
  const [closeShiftCollectedCash, setCloseShiftCollectedCash] = useState<number>(0);

  // Filter services
  const filteredServices = services.filter(s => {
    const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calculate Totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.service.price * item.qty);
  }, 0);

  const expressSurcharge = isExpress ? Math.round(subtotal * 0.5) : 0;
  const totalAmount = Math.max(0, subtotal + expressSurcharge - appliedDiscount);
  const changeAmount = paymentMethod === 'cash' ? Math.max(0, (cashGiven || totalAmount) - totalAmount) : 0;

  // Add item to cart
  const addToCart = (service: ServiceItem) => {
    const existingIndex = cartItems.findIndex(item => item.service.id === service.id);
    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].qty += service.unit === 'kg' ? 1.0 : 1;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { service, qty: service.unit === 'kg' ? 3.0 : 1 }]);
    }
  };

  const updateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(cartItems.filter((_, i) => i !== index));
    } else {
      const updated = [...cartItems];
      updated[index].qty = Math.round(newQty * 10) / 10;
      setCartItems(updated);
    }
  };

  const updateItemNotes = (index: number, notes: string) => {
    const updated = [...cartItems];
    updated[index].notes = notes;
    setCartItems(updated);
  };

  // Voucher apply
  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    const res = applyVoucherCode(voucherInput, subtotal);
    if (res.valid) {
      setAppliedDiscount(res.discount);
      setVoucherMessage({ type: 'success', text: res.message });
    } else {
      setAppliedDiscount(0);
      setVoucherMessage({ type: 'error', text: res.message });
    }
  };

  // Add customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const created = addCustomer({
      tenantId: currentTenant.id,
      name: newCustName,
      phone: newCustPhone,
      email: `${newCustName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: newCustAddress || 'Alamat belum diisi',
      membershipTier: 'Silver',
      notes: 'Pelanggan baru dari POS Kasir'
    });

    setSelectedCustomer(created);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
  };

  // Process checkout order
  const handleCheckout = () => {
    if (!selectedCustomer) {
      alert('Harap pilih atau daftarkan pelanggan terlebih dahulu.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Keranjang order masih kosong.');
      return;
    }

    if (paymentMethod === 'deposit' && selectedCustomer.depositBalance < totalAmount) {
      alert(`Saldo deposit pelanggan (Rp ${selectedCustomer.depositBalance.toLocaleString('id-ID')}) tidak mencukupi untuk total transaksi Rp ${totalAmount.toLocaleString('id-ID')}`);
      return;
    }

    setIsProcessing(true);

    const now = new Date();
    const readyDate = new Date(now.getTime() + (isExpress ? 6 : 48) * 60 * 60 * 1000);
    const estimatedReady = readyDate.toISOString().slice(0, 16).replace('T', ' ');

    const totalWeight = cartItems
      .filter(item => item.service.unit === 'kg')
      .reduce((sum, item) => sum + item.qty, 0);

    const totalPcs = cartItems
      .filter(item => item.service.unit !== 'kg')
      .reduce((sum, item) => sum + item.qty, 0);

    const newOrder = addOrder({
      tenantId: currentTenant.id,
      outletId: currentOutlet.id,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      orderType: 'walk_in',
      status: 'received',
      paymentStatus: 'paid',
      paymentMethod,
      items: cartItems.map((item, idx) => ({
        id: `itm-${idx + 1}`,
        serviceId: item.service.id,
        serviceName: item.service.name,
        category: item.service.category,
        unit: item.service.unit,
        qty: item.qty,
        unitPrice: item.service.price,
        subtotal: item.service.price * item.qty,
        notes: item.notes,
      })),
      totalWeightKg: totalWeight > 0 ? totalWeight : undefined,
      totalPcs: totalPcs > 0 ? totalPcs : undefined,
      subtotal,
      discount: appliedDiscount,
      deliveryFee: 0,
      totalAmount,
      paidAmount: totalAmount,
      isExpress,
      perfumeChoice: selectedPerfume,
      notes: orderNotes,
      estimatedReady,
      tags: isExpress ? ['Express'] : ['Reguler'],
    });

    setIsProcessing(false);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Open receipt print modal
    onOrderCreated(newOrder);

    // Reset cart
    setCartItems([]);
    setAppliedDiscount(0);
    setVoucherInput('');
    setOrderNotes('');
  };

  // =================== SERVICE CRUD HANDLERS ===================
  const handleOpenAddServiceModal = () => {
    setEditingServiceId(null);
    setServiceFormName('');
    setServiceFormCategory('kiloan');
    setServiceFormUnit('kg');
    setServiceFormPrice(10000);
    setServiceFormDuration(48);
    setServiceFormMinQty(1);
    setServiceFormDesc('');
    setShowServiceModal(true);
  };

  const handleOpenEditServiceModal = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setServiceFormName(service.name);
    setServiceFormCategory(service.category);
    setServiceFormUnit(service.unit);
    setServiceFormPrice(service.price);
    setServiceFormDuration(service.durationHours);
    setServiceFormMinQty(service.minQty || 1);
    setServiceFormDesc(service.description || '');
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormName.trim() || serviceFormPrice <= 0) {
      alert('Harap isi nama layanan dan harga tarif dengan benar.');
      return;
    }

    if (editingServiceId) {
      updateService(editingServiceId, {
        name: serviceFormName,
        category: serviceFormCategory,
        unit: serviceFormUnit,
        price: serviceFormPrice,
        durationHours: serviceFormDuration,
        minQty: serviceFormMinQty,
        description: serviceFormDesc
      });
    } else {
      addService({
        name: serviceFormName,
        category: serviceFormCategory,
        unit: serviceFormUnit,
        price: serviceFormPrice,
        durationHours: serviceFormDuration,
        minQty: serviceFormMinQty,
        description: serviceFormDesc
      });
    }

    setShowServiceModal(false);
  };

  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan "${name}" dari katalog POS?`)) {
      deleteService(id);
    }
  };

  // =================== PERFUME CRUD HANDLERS ===================
  const handleAddPerfumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerfumeInput.trim()) return;
    addPerfume(newPerfumeInput.trim());
    setNewPerfumeInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header & Feature Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            Kasir Point of Sale (POS) & Manajemen Layanan
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan order kasir, timbangan timbang kg, kelola tarif layanan (CRUD), aroma parfum, dan shift kasir.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setPosMode('pos_cashier')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              posMode === 'pos_cashier' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Kasir Transaksi</span>
          </button>

          <button
            onClick={() => setPosMode('crud_services')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              posMode === 'crud_services' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Kelola Layanan (CRUD)</span>
          </button>

          <button
            onClick={() => setPosMode('crud_perfumes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              posMode === 'crud_perfumes' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kelola Parfum</span>
          </button>

          <button
            onClick={() => setPosMode('shifts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              posMode === 'shifts' ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Shift Kasir</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. VIEW: POS CASHIER TRANSACTION SCREEN                 */}
      {/* ======================================================== */}
      {posMode === 'pos_cashier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Customer & Service Catalog */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Customer Selector Card */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-600" />
                  Data Pelanggan
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(true)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Pelanggan Baru</span>
                </button>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => {
                    const match = customers.find(c => c.id === e.target.value);
                    if (match) setSelectedCustomer(match);
                  }}
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} • {c.phone} ({c.membershipTier}) - Saldo: Rp {c.depositBalance.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Catalog with Category Filters */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Katalog Layanan Outlet
                </span>

                {/* Direct Shortcut to Add / Manage Service */}
                <button
                  onClick={() => setPosMode('crud_services')}
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Kelola / + Tambah Layanan</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'kiloan', label: '🧺 Kiloan' },
                  { key: 'satuan', label: '👔 Satuan' },
                  { key: 'sepatu_tas', label: '👟 Sepatu' },
                  { key: 'karpet_linen', label: '🛋️ Karpet' },
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedCategory === cat.key
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {filteredServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => addToCart(service)}
                    className="p-3 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-400 rounded-2xl text-left transition flex flex-col justify-between group active:scale-95 space-y-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-brand-700">
                          {service.name}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          /{service.unit}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {service.description || 'Layanan laundry premium'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-xs font-extrabold text-slate-900">
                        Rp {service.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] font-bold text-brand-600 group-hover:underline">
                        + Tambah
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Active Cart & Checkout */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-brand-600" />
                Keranjang Order ({cartItems.length} Item)
              </span>
              {cartItems.length > 0 && (
                <button
                  onClick={() => setCartItems([])}
                  className="text-[11px] font-semibold text-rose-500 hover:underline"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Keranjang masih kosong. Pilih layanan di sebelah kiri.
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">{item.service.name}</span>
                      <button onClick={() => updateItemQty(idx, 0)} className="text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty Stepper */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateItemQty(idx, item.qty - (item.service.unit === 'kg' ? 0.5 : 1))}
                          className="w-5 h-5 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold text-slate-900 w-12 text-center font-mono">
                          {item.qty} {item.service.unit}
                        </span>
                        <button
                          onClick={() => updateItemQty(idx, item.qty + (item.service.unit === 'kg' ? 0.5 : 1))}
                          className="w-5 h-5 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-slate-900">
                        Rp {(item.service.price * item.qty).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="Catatan item (misal: warna putih, kemeja gantung)..."
                      value={item.notes || ''}
                      onChange={(e) => updateItemNotes(idx, e.target.value)}
                      className="w-full text-[11px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Perfume Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Pilihan Aroma Parfum Laundry
              </label>
              <select
                value={selectedPerfume}
                onChange={(e) => setSelectedPerfume(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white"
              >
                {perfumes.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Express 6-Hour Checkbox */}
            <label className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200 rounded-2xl cursor-pointer">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-amber-900">Layanan Kilat Express (6 Jam)</div>
                  <div className="text-[10px] text-amber-700">Prioritas mesin cuci (+50% biaya)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isExpress}
                onChange={(e) => setIsExpress(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600"
              />
            </label>

            {/* Voucher Input */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <input
                type="text"
                placeholder="Kode Voucher Promo (misal: BERSIHHEMAT)"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-800"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Gunakan
              </button>
            </form>

            {voucherMessage && (
              <div className={`text-[11px] font-bold p-2 rounded-xl ${
                voucherMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
              }`}>
                {voucherMessage.text}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 block">Metode Pembayaran</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'cash', label: 'Tunai', icon: Banknote },
                  { key: 'qris', label: 'QRIS', icon: QrCode },
                  { key: 'bca_bank', label: 'Bank BCA', icon: CreditCard },
                  { key: 'deposit', label: 'Saldo Deposit', icon: Wallet },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPaymentMethod(m.key as any)}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        paymentMethod === m.key
                          ? 'border-brand-600 bg-brand-50/60 text-brand-700 font-extrabold ring-1 ring-brand-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cash Given Input */}
            {paymentMethod === 'cash' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Uang Diterima:</span>
                  <input
                    type="number"
                    value={cashGiven || ''}
                    onChange={(e) => setCashGiven(Number(e.target.value))}
                    placeholder={totalAmount.toString()}
                    className="w-36 text-right font-mono font-bold text-xs p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                {changeAmount > 0 && (
                  <div className="flex justify-between text-xs font-extrabold text-emerald-700 bg-emerald-50 p-2 rounded-xl">
                    <span>Kembalian:</span>
                    <span>Rp {changeAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Total Summary Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Layanan:</span>
                <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Promo:</span>
                  <span>-Rp {appliedDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {isExpress && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Biaya Express 6 Jam:</span>
                  <span>+Rp {expressSurcharge.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>TOTAL AKHIR:</span>
                <span className="text-base text-brand-700">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              disabled={isProcessing || cartItems.length === 0}
              onClick={handleCheckout}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs shadow-lg shadow-brand-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Proses Order & Cetak Resi Thermal</span>
            </button>

          </div>

        </div>
      )}


      {/* ======================================================== */}
      {/* 2. VIEW: CRUD LAYANAN & TARIF CATALOG                    */}
      {/* ======================================================== */}
      {posMode === 'crud_services' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-600" />
                Manajemen Tarif & Katalog Layanan Laundry (CRUD)
              </h2>
              <p className="text-xs text-slate-500">
                Tambah jenis layanan baru, ubah harga per kg/satuan, atur durasi pengerjaan (SLA), dan hapus layanan.
              </p>
            </div>

            <button
              onClick={handleOpenAddServiceModal}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black rounded-xl shadow-md shadow-brand-500/20 transition flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Layanan Baru</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama layanan laundry..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'kiloan', label: 'Kiloan' },
                { key: 'satuan', label: 'Satuan' },
                { key: 'sepatu_tas', label: 'Sepatu' },
                { key: 'karpet_linen', label: 'Karpet' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === cat.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Layanan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Satuan</th>
                  <th className="py-3 px-4">Tarif Harga</th>
                  <th className="py-3 px-4">Durasi Pengerjaan (SLA)</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map(srv => (
                  <tr key={srv.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{srv.name}</div>
                      <div className="text-[10px] text-slate-400">{srv.description || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                        {srv.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      /{srv.unit}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-brand-700 text-sm">
                      Rp {srv.price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      ⏱️ {srv.durationHours} Jam ({Math.round(srv.durationHours / 24)} Hari)
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditServiceModal(srv)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition"
                          title="Edit Layanan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id, srv.name)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition"
                          title="Hapus Layanan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 3. VIEW: CRUD VARIAN PARFUM LAUNDRY                     */}
      {/* ======================================================== */}
      {posMode === 'crud_perfumes' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Kelola Varian Aroma Parfum Laundry
            </h2>
            <p className="text-xs text-slate-500">
              Daftar pilihan parfum yang dapat dipilih kasir saat pelanggan membuat order cucian.
            </p>
          </div>

          {/* Add Perfume Form */}
          <form onSubmit={handleAddPerfumeSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Ketik nama aroma baru (misal: Snappy, Fresh Clean)..."
              value={newPerfumeInput}
              onChange={(e) => setNewPerfumeInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-600"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              + Tambah Aroma
            </button>
          </form>

          {/* Perfume List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Daftar Aroma Aktif ({perfumes.length}):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {perfumes.map((perfume, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span>🌸</span>
                    <span>{perfume}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePerfume(perfume)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    title="Hapus Aroma"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 4. VIEW: CASHIER SHIFT & CASH DRAWER                     */}
      {/* ======================================================== */}
      {posMode === 'shifts' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                Manajemen Shift Kasir & Laci Kas (Cash Drawer)
              </h2>
              <p className="text-xs text-slate-500">
                Catat modal kas awal shift, pantau uang masuk, dan serah terima kasir saat pergantian jam kerja.
              </p>
            </div>
          </div>

          {/* Current Active Shift Status */}
          {currentShift ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Shift Kasir Sedang Berjalan (Aktif)</span>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  ID: #{currentShift.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-emerald-100">
                  <span className="text-slate-400 font-semibold block">Kasir Bertugas:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{currentShift.cashierName}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-100">
                  <span className="text-slate-400 font-semibold block">Waktu Buka:</span>
                  <span className="font-semibold text-slate-800">{currentShift.openTime}</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-100">
                  <span className="text-slate-400 font-semibold block">Modal Kas Awal:</span>
                  <span className="font-black text-emerald-700 text-sm">Rp {currentShift.initialCash.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Close Shift Action */}
              <div className="pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-emerald-800">
                  Total Kas Terkumpul: <strong>Rp {currentShift.totalCashCollected.toLocaleString('id-ID')}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const counted = prompt('Masukkan total uang tunai fisik di laci saat ini (Rp):', currentShift.totalCashCollected.toString());
                    if (counted !== null) {
                      closeShift(currentShift.id, Number(counted));
                      alert('Shift kasir berhasil ditutup dan diserahterimakan!');
                    }
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md transition"
                >
                  Tutup Shift & Serah Terima Kas
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <Coins className="w-6 h-6" />
              </div>
              <div className="font-extrabold text-slate-800">Belum Ada Shift Kasir yang Dibuka</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Buka shift kasir baru dan masukkan modal uang receh/kembalian di laci kasir sebelum memulai transaksi.
              </p>
              <div className="flex justify-center gap-2 pt-2 max-w-xs mx-auto">
                <input
                  type="number"
                  value={openShiftInitialCash}
                  onChange={(e) => setOpenShiftInitialCash(Number(e.target.value))}
                  placeholder="300000"
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold w-36"
                />
                <button
                  type="button"
                  onClick={() => openShift(openShiftInitialCash, 'Nurul Hidayah')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md"
                >
                  Buka Shift
                </button>
              </div>
            </div>
          )}

          {/* Past Shift History */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Riwayat Shift Sebelumnya:</span>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
              {cashierShifts.map((shift, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{shift.cashierName} • #{shift.id}</div>
                    <div className="text-[10px] text-slate-400">Buka: {shift.openTime} {shift.closeTime && `• Tutup: ${shift.closeTime}`}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      shift.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {shift.status.toUpperCase()}
                    </span>
                    <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                      Rp {shift.totalCashCollected.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT LAYANAN (CRUD)                      */}
      {/* ======================================================== */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {editingServiceId ? 'Edit Layanan & Tarif' : 'Tambah Layanan Laundry Baru'}
                </h3>
                <p className="text-[11px] text-slate-400">Atur rincian harga, satuan, dan SLA durasi pengerjaan</p>
              </div>
              <button onClick={() => setShowServiceModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Layanan *</label>
                <input
                  type="text"
                  value={serviceFormName}
                  onChange={(e) => setServiceFormName(e.target.value)}
                  placeholder="Contoh: Cuci Setrika Super Wangi, Sepatu Boots Deep Clean..."
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-brand-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori Layanan *</label>
                  <select
                    value={serviceFormCategory}
                    onChange={(e) => setServiceFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="kiloan">🧺 Kiloan</option>
                    <option value="satuan">👔 Satuan</option>
                    <option value="sepatu_tas">👟 Sepatu & Tas</option>
                    <option value="karpet_linen">🛋️ Karpet & Linen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Satuan Tarif *</label>
                  <select
                    value={serviceFormUnit}
                    onChange={(e) => setServiceFormUnit(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="kg">Per Kilogram (kg)</option>
                    <option value="pcs">Per Potong (pcs)</option>
                    <option value="pasang">Per Pasang</option>
                    <option value="m2">Per Meter Persegi (m²)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Harga Tarif (Rp) *</label>
                  <input
                    type="number"
                    value={serviceFormPrice}
                    onChange={(e) => setServiceFormPrice(Number(e.target.value))}
                    min={1000}
                    step={500}
                    required
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Durasi Pengerjaan SLA (Jam) *</label>
                  <input
                    type="number"
                    value={serviceFormDuration}
                    onChange={(e) => setServiceFormDuration(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi Layanan</label>
                <textarea
                  value={serviceFormDesc}
                  onChange={(e) => setServiceFormDesc(e.target.value)}
                  placeholder="Keterangan cara pencucian atau fasilitas..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl resize-none text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black shadow-md"
                >
                  {editingServiceId ? 'Simpan Perubahan' : 'Tambah ke Katalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* MODAL: TAMBAH PELANGGAN CEPAT DARI KASIR                */}
      {/* ======================================================== */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Tambah Pelanggan Baru Cepat</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap Pelanggan *</label>
                <input
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="Contoh: Rina Melati"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="081234567890"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Alamat Domisili</label>
                <textarea
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="Jl. Mawar No. 12, RT 02/05..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                >
                  Simpan & Pilih
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
