'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  XCircle,
  FileText,
  ShieldCheck,
  Eye,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataStore, calculateFinancialSummary } from '@/lib/data/store';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import {
  Transaction,
  TransactionCategory,
  FinancialSummaryData,
  TransactionStatus,
} from '@/types/database';

export default function AdminKeuanganPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [summary, setSummary] = useState<FinancialSummaryData | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState<Transaction | null>(null);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState<string>('');
  const [formSourceDest, setFormSourceDest] = useState<string>('');
  const [formIsPublic, setFormIsPublic] = useState<boolean>(true);
  const [formError, setFormError] = useState<string>('');

  // Cancellation Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetTrx, setCancelTargetTrx] = useState<Transaction | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const refreshData = () => {
    const cats = DataStore.getCategories();
    const trxs = DataStore.getTransactions();
    setCategories(cats);
    setTransactions(trxs);
    setSummary(calculateFinancialSummary(trxs, cats));
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    const matchType = filterType === 'all' || t.transaction_type === filterType;
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchCategory = filterCategory === 'all' || t.category_id === filterCategory;
    const matchDateStart = !filterStartDate || t.transaction_date >= filterStartDate;
    const matchDateEnd = !filterEndDate || t.transaction_date <= filterEndDate;
    const matchSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.source_destination && t.source_destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.reference_number && t.reference_number.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchType && matchStatus && matchCategory && matchDateStart && matchDateEnd && matchSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedTransactions = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = (type: 'income' | 'expense') => {
    setEditingTrx(null);
    setFormType(type);
    const availableCats = categories.filter((c) => c.transaction_type === type);
    setFormCategoryId(availableCats[0]?.id || '');
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormSourceDest('');
    setFormIsPublic(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: Transaction) => {
    setEditingTrx(t);
    setFormType(t.transaction_type);
    setFormCategoryId(t.category_id);
    setFormAmount(String(t.amount));
    setFormDate(t.transaction_date);
    setFormDescription(t.description);
    setFormSourceDest(t.source_destination || '');
    setFormIsPublic(t.is_public);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const numAmount = Number(formAmount);
    if (!formAmount || isNaN(numAmount) || numAmount <= 0) {
      setFormError('Nominal transaksi harus lebih besar dari 0');
      return;
    }

    if (!formDescription.trim()) {
      setFormError('Uraian deskripsi transaksi wajib diisi');
      return;
    }

    if (!formCategoryId) {
      setFormError('Kategori transaksi wajib dipilih');
      return;
    }

    if (editingTrx) {
      // Update
      DataStore.updateTransaction(editingTrx.id, {
        transaction_type: formType,
        category_id: formCategoryId,
        amount: numAmount,
        transaction_date: formDate,
        description: formDescription,
        source_destination: formSourceDest,
        is_public: formIsPublic,
      });
    } else {
      // Add new
      DataStore.addTransaction({
        transaction_type: formType,
        category_id: formCategoryId,
        amount: numAmount,
        transaction_date: formDate,
        description: formDescription,
        source_destination: formSourceDest,
        is_public: formIsPublic,
        status: 'approved',
      });
    }

    setIsModalOpen(false);
    refreshData();
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelTargetTrx || !cancellationReason.trim()) return;

    DataStore.cancelTransaction(cancelTargetTrx.id, cancellationReason);
    setIsCancelModalOpen(false);
    setCancelTargetTrx(null);
    setCancellationReason('');
    refreshData();
  };

  const handleExportCSV = () => {
    const headers = [
      'No. Referensi',
      'Tanggal',
      'Tipe',
      'Kategori',
      'Deskripsi',
      'Pemberi/Penerima',
      'Nominal',
      'Status',
      'Publik',
    ];
    const rows = filtered.map((t) => [
      t.reference_number || '-',
      t.transaction_date,
      t.transaction_type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.category?.name || 'Umum',
      `"${t.description.replace(/"/g, '""')}"`,
      `"${(t.source_destination || '-').replace(/"/g, '""')}"`,
      t.amount,
      t.status,
      t.is_public ? 'Ya' : 'Tidak',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Buku_Kas_DKM_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 print-container">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Modul Pembukuan</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Manajemen Keuangan & Kas Masjid
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan kas masuk, belanja operasional, verifikasi bukti, dan rekapitulasi audit
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddModal('income')}
            className="gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            + Pemasukan
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleOpenAddModal('expense')}
            className="gap-1.5"
          >
            <TrendingDown className="w-4 h-4 text-white" />
            + Pengeluaran
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5">
            <Download className="w-4 h-4 text-emerald-700" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
            <Printer className="w-4 h-4 text-slate-700" />
            Cetak
          </Button>
        </div>
      </div>

      {/* Financial Metrics Summary Bar */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-emerald-900 text-white rounded-xl shadow-xs">
            <span className="text-[11px] text-emerald-200 uppercase font-semibold">
              Saldo Kas Aktif (Net)
            </span>
            <div className="text-2xl font-black text-amber-300 mt-1">
              {formatRupiah(summary.currentBalance)}
            </div>
            <p className="text-[10px] text-emerald-300/80 mt-1">
              Dari seluruh transaksi terverifikasi (Approved)
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">
              Total Pemasukan Kas
            </span>
            <div className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mt-1">
              {formatRupiah(summary.totalIncome)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {summary.incomeCount} transaksi tercatat
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">
              Total Pengeluaran Kas
            </span>
            <div className="text-xl font-bold text-red-800 dark:text-red-400 mt-1">
              {formatRupiah(summary.totalExpense)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {summary.expenseCount} transaksi belanja/santunan
            </p>
          </Card>
        </div>
      )}

      {/* Filter and Search Panel */}
      <Card className="p-4 no-print space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari uraian, ref, nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Semua Jenis Transaksi</option>
            <option value="income">Hanya Pemasukan</option>
            <option value="expense">Hanya Pengeluaran</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Semua Kategori Pos</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.transaction_type === 'income' ? 'Pemasukan' : 'Pengeluaran'})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">Semua Status Audit</option>
            <option value="approved">Sah (Approved)</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Dibatalkan (Void)</option>
          </select>

          {/* Reset Filters button */}
          <button
            onClick={() => {
              setFilterType('all');
              setFilterStatus('all');
              setFilterCategory('all');
              setFilterStartDate('');
              setFilterEndDate('');
              setSearchQuery('');
            }}
            className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold hover:underline text-left sm:text-center py-1.5"
          >
            Reset Semua Filter
          </button>
        </div>
      </Card>

      {/* Main Transactions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">No. Referensi</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Uraian / Deskripsi</th>
                <th className="py-3 px-3">Pihak Terkait</th>
                <th className="py-3 px-3 text-right">Nominal (Rp)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Tidak ditemukan data transaksi kas yang sesuai.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t) => {
                  const isIncome = t.transaction_type === 'income';
                  const isCancelled = t.status === 'cancelled';
                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                        isCancelled ? 'opacity-60 bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                        {formatDateIndo(t.transaction_date)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {t.reference_number || '-'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-medium">{t.category?.name || 'Umum'}</span>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="truncate font-medium">{t.description}</div>
                        {isCancelled && t.cancellation_reason && (
                          <div className="text-[10px] text-red-600 italic">
                            Alasan batal: {t.cancellation_reason}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        {t.source_destination || '-'}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-bold whitespace-nowrap ${
                          isCancelled
                            ? 'line-through text-slate-400'
                            : isIncome
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {isIncome ? `+${formatRupiah(t.amount)}` : `-${formatRupiah(t.amount)}`}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <Badge
                          variant={
                            t.status === 'approved'
                              ? 'success'
                              : t.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {t.status === 'approved'
                            ? 'Sah'
                            : t.status === 'pending'
                            ? 'Pending'
                            : 'Dibatalkan'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(t)}
                            title="Edit Transaksi"
                            className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCancelled && (
                            <button
                              onClick={() => {
                                setCancelTargetTrx(t);
                                setCancellationReason('');
                                setIsCancelModalOpen(true);
                              }}
                              title="Batalkan Transaksi (Audit Trail)"
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between no-print text-xs text-slate-500">
          <div>
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} transaksi
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="text-xs px-2.5 h-8"
            >
              Sebelumnya
            </Button>
            <span className="px-2 font-medium">
              Hal {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="text-xs px-2.5 h-8"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {/* Add / Edit Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTrx ? 'Ubah Catatan Transaksi' : `Tambah ${formType === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
        description="Pastikan nominal dan bukti faktur sesuai dengan mutasi fisik kas masjid."
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {formError}
            </div>
          )}

          {/* Type Toggle if adding */}
          {!editingTrx && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setFormType('income');
                  const av = categories.filter((c) => c.transaction_type === 'income');
                  setFormCategoryId(av[0]?.id || '');
                }}
                className={`py-2 rounded-md ${
                  formType === 'income' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                + Pemasukan (Infaq/Wakaf)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormType('expense');
                  const av = categories.filter((c) => c.transaction_type === 'expense');
                  setFormCategoryId(av[0]?.id || '');
                }}
                className={`py-2 rounded-md ${
                  formType === 'expense' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                - Pengeluaran (Belanja/Biaya)
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Transaksi *
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Pos Kas *
              </label>
              <select
                required
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              >
                {categories
                  .filter((c) => c.transaction_type === formType)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nominal Transaksi (Rp) *
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                required
                placeholder="Contoh: 1500000"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pemberi / Penerima Transaksi
              </label>
              <input
                type="text"
                placeholder="Contoh: Jamaah Jumat / PLN Rayon"
                value={formSourceDest}
                onChange={(e) => setFormSourceDest(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Uraian Lengkap Deskripsi *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan tujuan transaksi, nomor nota, atau spesifikasi barang/jasa..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPublicCheck"
              checked={formIsPublic}
              onChange={(e) => setFormIsPublic(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4"
            />
            <label htmlFor="isPublicCheck" className="text-xs text-slate-700 dark:text-slate-300">
              Publikasikan pada Laporan Transparansi Keuangan Jamaah
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Transaksi Kas
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancellation Modal (Audit Trail Requirement) */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Konfirmasi Pembatalan Transaksi"
        description="Mekanisme pembatalan ini tidak akan menghapus jejak audit, melainkan mengubah status menjadi Voided/Cancelled."
      >
        <form onSubmit={handleConfirmCancel} className="space-y-4">
          <div className="p-3 bg-red-50 text-red-900 text-xs rounded-xl border border-red-200">
            <p className="font-bold">Transaksi yang akan dibatalkan:</p>
            <p className="mt-1 font-mono">
              {cancelTargetTrx?.reference_number} • {formatRupiah(cancelTargetTrx?.amount)}
            </p>
            <p className="mt-0.5 text-slate-600">{cancelTargetTrx?.description}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alasan Pembatalan Administratif *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Contoh: Kesalahan input nominal ganda oleh sekretaris / nota fisik dibatalkan vendor..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Kembali
            </Button>
            <Button type="submit" variant="destructive" size="sm">
              Batalkan Transaksi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
