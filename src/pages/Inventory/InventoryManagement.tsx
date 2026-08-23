import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem, InventoryCategory } from '../../types';
import { 
  Package, AlertTriangle, Plus, Search, 
  ShoppingCart, RefreshCw, Truck, ArrowUpRight, 
  Check, FileText, Building2
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const { 
    inventory, addInventoryItem, updateInventoryStock, 
    addExpense, currentTenant, currentOutlet, cashAccounts 
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);

  // New item state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('chemical');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number>(10);
  const [unit, setUnit] = useState('Jerigen (20L)');
  const [threshold, setThreshold] = useState<number>(5);
  const [cost, setCost] = useState<number>(120000);
  const [supplier, setSupplier] = useState('PT Kimia Sejahtera Abadi');

  // PO form state
  const [poSupplier, setPoSupplier] = useState('PT Sukses Kimia Pratama');
  const [poItemName, setPoItemName] = useState('Deterjen Cair Konsentrat EcoClean');
  const [poQty, setPoQty] = useState<number>(5);
  const [poCost, setPoCost] = useState<number>(140000);
  const [poAccount, setPoAccount] = useState(cashAccounts[1]?.id || cashAccounts[0]?.id);

  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStockThreshold);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addInventoryItem({
      tenantId: currentTenant.id,
      outletId: currentOutlet.id,
      name,
      category,
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      currentStock: stock,
      unit,
      minStockThreshold: threshold,
      costPerUnit: cost,
      supplierName: supplier,
    });

    setShowAddItemModal(false);
    setName('');
    setSku('');
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPO = poQty * poCost;

    // Find item to update stock
    const item = inventory.find(i => i.name === poItemName);
    if (item) {
      updateInventoryStock(item.id, poQty);
    }

    // Add Expense
    addExpense({
      tenantId: currentTenant.id,
      outletId: currentOutlet.id,
      date: new Date().toISOString().slice(0, 10),
      category: 'Bahan Baku',
      description: `Pembelian PO ${poItemName} (${poQty} unit) dari ${poSupplier}`,
      amount: totalPO,
      accountId: poAccount,
      accountName: cashAccounts.find(a => a.id === poAccount)?.name || 'Kas',
    });

    alert(`Purchase Order berhasil diterbitkan! Stok ${poItemName} bertambah +${poQty} dan tercatat di pengeluaran kas.`);
    setShowPOModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            Manajemen Stok & Bahan Baku Laundry
          </h1>
          <p className="text-xs text-slate-500">
            Monitoring deterjen, pewangi, softener, plastik packing, tag label, dan Purchase Order.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPOModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>+ Buat Purchase Order (PO)</span>
          </button>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Item Bahan</span>
          </button>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-900">
                Peringatan Stok Kritis: {lowStockItems.length} Item Perlu Segera Direstock!
              </div>
              <div className="text-[11px] text-rose-700">
                {lowStockItems.map(i => `${i.name} (Sisa: ${i.currentStock} ${i.unit})`).join(' • ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPOModal(true)}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition"
          >
            Restock Otomatis
          </button>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama bahan, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'chemical', 'packaging', 'tagging'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs rounded-xl font-semibold transition ${
                categoryFilter === cat ? 'bg-brand-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Semua Bahan' :
               cat === 'chemical' ? '🧪 Kimia & Parfum' :
               cat === 'packaging' ? '📦 Plastik Packing' : '🏷️ Tag & Label'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Nama Bahan & SKU</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Stok Saat Ini</th>
                <th className="py-3.5 px-4">Batas Minimum</th>
                <th className="py-3.5 px-4">Harga Beli / Unit</th>
                <th className="py-3.5 px-4">Supplier & Restock</th>
                <th className="py-3.5 px-4 text-center">Update Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map(item => {
                const isLow = item.currentStock <= item.minStockThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-extrabold ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                          {item.currentStock} {item.unit}
                        </span>
                        {isLow && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 animate-pulse">
                            Kritis
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {item.minStockThreshold} {item.unit}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      Rp {item.costPerUnit.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.supplierName}</div>
                      <div className="text-[10px] text-slate-400">Terakhir: {item.lastRestocked}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateInventoryStock(item.id, -1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                          title="Kurangi 1 (Pemakaian)"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, 1)}
                          className="w-6 h-6 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs"
                          title="Tambah 1"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              Buat Purchase Order (PO) Bahan Baku
            </h2>
            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Pilih Item Bahan</label>
                <select
                  value={poItemName}
                  onChange={(e) => {
                    setPoItemName(e.target.value);
                    const itm = inventory.find(i => i.name === e.target.value);
                    if (itm) setPoCost(itm.costPerUnit);
                  }}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  {inventory.map(i => (
                    <option key={i.id} value={i.name}>{i.name} (Sisa: {i.currentStock} {i.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Supplier</label>
                <input
                  type="text"
                  value={poSupplier}
                  onChange={(e) => setPoSupplier(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Jumlah Unit Beli</label>
                  <input
                    type="number"
                    min="1"
                    value={poQty}
                    onChange={(e) => setPoQty(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Harga Beli / Unit</label>
                  <input
                    type="number"
                    value={poCost}
                    onChange={(e) => setPoCost(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                <span className="font-semibold text-emerald-900">Total Nilai PO:</span>
                <span className="font-extrabold text-sm text-emerald-700">
                  Rp {(poQty * poCost).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Terbitkan PO & Update Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Tambah Item Bahan Baku Baru
            </h2>
            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Item Bahan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Parfum Laundry Lavender"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="chemical">Bahan Kimia / Parfum</option>
                    <option value="packaging">Plastik & Hanger</option>
                    <option value="tagging">Label & Barcode</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Satuan Kemasan</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Batas Minimum Peringatan</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Harga Beli Rata-rata</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
                >
                  Simpan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
