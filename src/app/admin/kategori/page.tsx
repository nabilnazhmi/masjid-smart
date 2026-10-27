'use client';

import React, { useState, useEffect } from 'react';
import { Tags, PlusCircle, CheckCircle, Eye, EyeOff, Edit2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataStore } from '@/lib/data/store';
import { TransactionCategory } from '@/types/database';

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const refresh = () => {
    setCategories(DataStore.getCategories());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    DataStore.saveCategory({
      name,
      transaction_type: type,
      description,
      is_public: isPublic,
    });

    setName('');
    setDescription('');
    setModalOpen(false);
    refresh();
  };

  const incomeCats = categories.filter((c) => c.transaction_type === 'income');
  const expenseCats = categories.filter((c) => c.transaction_type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Pos Anggaran</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Kategori Transaksi Kas
          </h1>
          <p className="text-xs text-slate-500">
            Klasifikasi penerimaan infaq/sedekah dan belanja operasional masjid
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
          <PlusCircle className="w-4 h-4 text-amber-300" />
          Tambah Kategori Pos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card className="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Pos Penerimaan (Pemasukan)
            </h3>
            <span className="text-xs text-slate-400">{incomeCats.length} pos terdaftar</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {incomeCats.map((cat) => (
              <div key={cat.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{cat.description || '-'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {cat.is_public ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Eye className="w-3 h-3" /> Publik
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      <EyeOff className="w-3 h-3" /> Internal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Expense Categories */}
        <Card className="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
            <h3 className="font-bold text-sm text-red-900 dark:text-red-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              Pos Penyaluran (Pengeluaran)
            </h3>
            <span className="text-xs text-slate-400">{expenseCats.length} pos terdaftar</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenseCats.map((cat) => (
              <div key={cat.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{cat.description || '-'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {cat.is_public ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Eye className="w-3 h-3" /> Publik
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      <EyeOff className="w-3 h-3" /> Internal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Kategori Pos Kas Baru"
        description="Klasifikasikan pos anggaran agar memudahkan audit dan penyajian laporan transparansi."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-md ${
                type === 'income' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Pos Penerimaan (Pemasukan)
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-md ${
                type === 'expense' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Pos Belanja (Pengeluaran)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Pos Anggaran *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Pemeliharaan Sound System & AC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Keterangan / Deskripsi Pos
            </label>
            <textarea
              rows={2}
              placeholder="Uraikan ruang lingkup transaksi untuk pos ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="catPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded text-emerald-700 w-4 h-4"
            />
            <label htmlFor="catPublic" className="text-xs text-slate-700 dark:text-slate-300">
              Tampilkan pos ini pada diagram & laporan keuangan publik
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Kategori
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
