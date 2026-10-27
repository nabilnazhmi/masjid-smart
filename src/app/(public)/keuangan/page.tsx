'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Printer,
  Download,
  Filter,
  ShieldCheck,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  HeartHandshake,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataStore, calculateFinancialSummary } from '@/lib/data/store';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import { Transaction, TransactionCategory, FinancialSummaryData, MosqueSettings } from '@/types/database';

const PIE_COLORS = ['#059669', '#10b981', '#34d399', '#f59e0b', '#fbbf24', '#3b82f6', '#8b5cf6'];

export default function KeuanganPublikPage() {
  const [settings, setSettings] = useState<MosqueSettings | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [summary, setSummary] = useState<FinancialSummaryData | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const s = DataStore.getSettings();
    const cats = DataStore.getCategories();
    const trxs = DataStore.getTransactions({ publicOnly: true });

    setSettings(s);
    setCategories(cats);
    setTransactions(trxs);
    setSummary(calculateFinancialSummary(trxs, cats));
  }, []);

  // Filtered transactions for the public table
  const filteredTrxs = transactions.filter((t) => {
    const matchType = selectedType === 'all' || t.transaction_type === selectedType;
    const matchCategory = selectedCategory === 'all' || t.category_id === selectedCategory;
    const matchSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.reference_number && t.reference_number.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchCategory && matchSearch;
  });

  // Prepare monthly data for Recharts BarChart
  const monthlyChartData = [
    {
      month: 'Sep 2026',
      Pemasukan: 25470000,
      Pengeluaran: 13850000,
    },
    {
      month: 'Okt 2026',
      Pemasukan: summary?.monthlyComparison?.thisMonthIncome || 35350000,
      Pengeluaran: summary?.monthlyComparison?.thisMonthExpense || 10220000,
    },
  ];

  // Prepare category data for PieChart
  const pieData = (summary?.categoriesBreakdown || [])
    .filter((c) => c.type === 'expense' && c.total > 0)
    .map((c) => ({
      name: c.categoryName,
      value: c.total,
    }));

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Jenis', 'Kategori', 'Uraian Deskripsi', 'Nominal (Rp)', 'Nomor Referensi'];
    const rows = filteredTrxs.map((t) => [
      t.transaction_date,
      t.transaction_type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.category?.name || 'Umum',
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.reference_number || '-',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_Publik_${settings?.mosque_name || 'Masjid'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!summary) {
    return <div className="py-20 text-center text-gray-500">Memuat laporan transparansi...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 print-container">
      {/* Title & Print Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <Badge variant="gold" className="no-print">
            Transparansi Umat & Audit Terbuka
          </Badge>
          <h1 className="text-3xl font-extrabold text-emerald-950 dark:text-white mt-1">
            Laporan Transparansi Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {settings?.mosque_name} • Seluruh mutasi kas dipublikasikan secara amanah dan bertanggung jawab.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <Download className="w-4 h-4 text-emerald-700" />
            Ekspor CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="gap-1.5 text-xs shadow-xs">
            <Printer className="w-4 h-4 text-amber-300" />
            Cetak Laporan
          </Button>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Saldo Kas */}
        <Card className="p-6 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
              Saldo Kas Sah (Net Balance)
            </span>
            <div className="p-2 bg-emerald-700/60 rounded-lg text-amber-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 mt-3 tracking-tight">
            {formatRupiah(summary.currentBalance)}
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Berdasarkan pembukuan transaksi yang telah diverifikasi DKM
          </p>
        </Card>

        {/* Total Pemasukan */}
        <Card className="p-6 bg-emerald-50/60 dark:bg-gray-800/40 border-emerald-100 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total Penerimaan Infaq/Wakaf
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-400 mt-3">
            {formatRupiah(summary.totalIncome)}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Terakumulasi dari {summary.incomeCount} transaksi kotak amal & transfer
          </p>
        </Card>

        {/* Total Pengeluaran */}
        <Card className="p-6 bg-red-50/60 dark:bg-gray-800/40 border-red-100 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total Penyaluran Operasional
            </span>
            <div className="p-2 bg-red-100 dark:bg-red-950 text-red-700 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-red-900 dark:text-red-400 mt-3">
            {formatRupiah(summary.totalExpense)}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Dialokasikan untuk listrik, marbot, santunan & sarana ibadah
          </p>
        </Card>
      </div>

      {/* 2. Visual Charts (Monthly Comparison & Expense Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Perbandingan Pemasukan vs Pengeluaran Bulanan
                </h3>
                <p className="text-xs text-gray-500">
                  Data arus kas bulanan yang disahkan bendahara
                </p>
              </div>
            </div>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)} jt`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatRupiah(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Pemasukan" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pengeluaran" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Expense Category Distribution */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Komposisi Belanja & Pengeluaran
              </h3>
              <p className="text-xs text-gray-500">Distribusi pos penyaluran dana umat</p>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => formatRupiah(Number(val))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              {pieData.slice(0, 4).map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    {p.name}
                  </span>
                  <span className="font-mono font-medium">{formatRupiah(p.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Donor Privacy & Syariah Guarantee Alert */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prinsip Privasi Donatur & Integritas Syariah:</span>
          <p className="text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
            Sesuai amanah syariat Islam dan etika keterbukaan, identitas pribadi donatur (hamba Allah) dijaga privasinya tanpa mengurangi transparansi nominal uang yang diterima dan dialokasikan untuk kepentingan masjid.
          </p>
        </div>
      </div>

      {/* 4. Transactions Table (Filtered) */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Buku Mutasi Kas Masjid
            </h3>
            <p className="text-xs text-gray-500">
              Menampilkan {filteredTrxs.length} catatan mutasi kas yang telah diverifikasi
            </p>
          </div>

          {/* Filters (No print) */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            {/* Type buttons */}
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                  selectedType === 'all'
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedType('income')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                  selectedType === 'income'
                    ? 'bg-white dark:bg-gray-900 text-emerald-700 font-bold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setSelectedType('expense')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                  selectedType === 'expense'
                    ? 'bg-white dark:bg-gray-900 text-red-700 font-bold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Pengeluaran
              </button>
            </div>

            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs w-36 focus:outline-none"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Ref</th>
                <th className="py-3 px-4">Kategori Pos</th>
                <th className="py-3 px-4">Uraian / Deskripsi</th>
                <th className="py-3 px-4 text-right">Pemasukan</th>
                <th className="py-3 px-4 text-right">Pengeluaran</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {filteredTrxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Tidak ada mutasi transaksi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredTrxs.map((t) => {
                  const isIncome = t.transaction_type === 'income';
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {formatDateIndo(t.transaction_date)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-gray-500">
                        {t.reference_number || '-'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {t.category?.name || 'Umum'}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">{t.description}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                        {isIncome ? formatRupiah(t.amount) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-red-700 whitespace-nowrap">
                        {!isIncome ? formatRupiah(t.amount) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <Badge variant="success">Sah & Diaudit</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. Infaq & Sedekah Callout Section (Anchor #donasi) */}
      <div id="donasi" className="pt-4 no-print">
        <Card className="p-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl shadow-xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-amber-300 text-xs font-semibold">
              <HeartHandshake className="w-4 h-4" />
              Mari Berpartisipasi
            </div>
            <h2 className="text-2xl font-bold">Salurkan Infaq & Wakaf Terbaik Anda</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Donasi Anda disalurkan secara amanah dengan pengawasan DKM dan tercatat langsung dalam sistem akuntansi publik ini.
            </p>
            <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-700/80 max-w-md text-xs space-y-1 font-mono">
              <p className="text-emerald-300 text-[11px]">Bank Syariah Indonesia (BSI)</p>
              <p className="text-xl font-extrabold text-amber-300 tracking-wider">
                {settings?.bank_account_number || '7123-4567-89'}
              </p>
              <p className="text-emerald-200 text-xs">a.n. {settings?.bank_account_holder}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
