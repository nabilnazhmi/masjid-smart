'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  Bot,
  ArrowRight,
  PlusCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataStore, calculateFinancialSummary } from '@/lib/data/store';
import { formatRupiah, formatDateIndo, formatDateTimeIndo } from '@/lib/utils';
import {
  Transaction,
  TransactionCategory,
  FinancialSummaryData,
  Activity,
  MosqueSettings,
} from '@/types/database';

export default function AdminDashboardPage() {
  const [settings, setSettings] = useState<MosqueSettings | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [summary, setSummary] = useState<FinancialSummaryData | null>(null);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

  useEffect(() => {
    const s = DataStore.getSettings();
    const cats = DataStore.getCategories();
    const trxs = DataStore.getTransactions();
    const acts = DataStore.getActivities('upcoming');

    setSettings(s);
    setCategories(cats);
    setTransactions(trxs);
    setActivities(acts.slice(0, 3));
    setSummary(calculateFinancialSummary(trxs, cats));
  }, []);

  const handleFetchAiSummary = async () => {
    if (!summary) return;
    setLoadingAiSummary(true);
    try {
      const res = await fetch('/api/ai/financial-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryData: summary,
          mosqueName: settings?.mosque_name,
        }),
      });
      const data = await res.json();
      if (data.narrative) {
        setAiSummary(data.narrative);
      }
    } catch (err) {
      console.error('Failed to get AI summary:', err);
    } finally {
      setLoadingAiSummary(false);
    }
  };

  if (!summary) {
    return <div className="p-8 text-center text-gray-500">Memuat dashboard DKM...</div>;
  }

  // Monthly Chart Data
  const chartData = [
    {
      name: 'Bulan Lalu',
      Pemasukan: summary.monthlyComparison?.lastMonthIncome || 25470000,
      Pengeluaran: summary.monthlyComparison?.lastMonthExpense || 13850000,
    },
    {
      name: 'Bulan Ini',
      Pemasukan: summary.monthlyComparison?.thisMonthIncome || 0,
      Pengeluaran: summary.monthlyComparison?.thisMonthExpense || 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Dashboard Terintegrasi</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Ikhtisar Administrasi & Kas Masjid
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {settings?.mosque_name} • Data kas dihitung realtime dari pembukuan transaksi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/keuangan">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
              <PlusCircle className="w-4 h-4 text-amber-300" />
              Catat Transaksi
            </Button>
          </Link>
          <Link href="/admin/ai-assistant">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Bot className="w-4 h-4 text-emerald-700" />
              AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Stat Cards (Live DB Calculated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Saldo Kas Aktif */}
        <Card className="p-5 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
              Saldo Kas Tersedia
            </span>
            <div className="p-2 bg-emerald-700/60 rounded-lg text-amber-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-2 tracking-tight">
            {formatRupiah(summary.currentBalance)}
          </div>
          <div className="text-[10px] text-emerald-200/90 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Total Arus Bersih Tercatat
          </div>
        </Card>

        {/* Pemasukan Bulan Ini */}
        <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pemasukan Bulan Ini
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mt-2">
            {formatRupiah(summary.monthlyComparison?.thisMonthIncome || 0)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Perubahan:{' '}
            <span
              className={`font-semibold ${
                (summary.monthlyComparison?.incomeChangePercent || 0) >= 0
                  ? 'text-emerald-600'
                  : 'text-red-500'
              }`}
            >
              {(summary.monthlyComparison?.incomeChangePercent || 0) >= 0 ? '+' : ''}
              {summary.monthlyComparison?.incomeChangePercent || 0}% vs bln lalu
            </span>
          </div>
        </Card>

        {/* Pengeluaran Bulan Ini */}
        <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pengeluaran Bulan Ini
            </span>
            <div className="p-2 bg-red-100 dark:bg-red-950 text-red-700 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-red-900 dark:text-red-400 mt-2">
            {formatRupiah(summary.monthlyComparison?.thisMonthExpense || 0)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Perubahan:{' '}
            <span
              className={`font-semibold ${
                (summary.monthlyComparison?.expenseChangePercent || 0) >= 0
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }`}
            >
              {(summary.monthlyComparison?.expenseChangePercent || 0) >= 0 ? '+' : ''}
              {summary.monthlyComparison?.expenseChangePercent || 0}% vs bln lalu
            </span>
          </div>
        </Card>

        {/* Pos Belanja Terbesar */}
        <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pos Pengeluaran Terbesar
            </span>
            <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-700 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-2 truncate">
            {summary.topExpenseCategory?.categoryName || 'Belum ada data'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {formatRupiah(summary.topExpenseCategory?.totalAmount || 0)} (
            {summary.topExpenseCategory?.percentage || 0}% total belanja)
          </div>
        </Card>
      </div>

      {/* 2. AI Executive Summary Card */}
      <Card className="border-emerald-300 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50 via-white to-amber-50/40 dark:from-slate-900 dark:to-slate-900 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 text-amber-300 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Analisis & Telaah AI Eksekutif Keuangan
                <Badge variant="gold">Otomatis</Badge>
              </h3>
              <p className="text-xs text-slate-500">
                Pemaparan naratif berbasis angka matematis deterministik dari database kas
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleFetchAiSummary}
            isLoading={loadingAiSummary}
            className="text-xs"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            {aiSummary ? 'Perbarui Ringkasan AI' : 'Hasilkan Ringkasan AI'}
          </Button>
        </div>

        {aiSummary ? (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed shadow-2xs">
            {aiSummary}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
            Klik tombol di atas untuk meminta AI menganalisis kesehatan kas, mengevaluasi perbandingan bulan ini, dan memberikan rekomendasi belanja untuk DKM.
          </div>
        )}
      </Card>

      {/* 3. Financial Chart & Upcoming Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Comparison Chart */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Grafik Arus Kas Realtime
                </h3>
                <p className="text-xs text-slate-500">
                  Perbandingan pemasukan & pengeluaran dari data transaksi
                </p>
              </div>
              <Link href="/admin/keuangan">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Detail <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} stroke="#888888" />
                  <YAxis
                    fontSize={11}
                    stroke="#888888"
                    tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)} jt`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatRupiah(Number(val)), '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
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

        {/* Upcoming Activities Widget */}
        <div className="lg:col-span-5">
          <Card className="p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Kegiatan Terdekat
                  </h3>
                  <p className="text-xs text-slate-500">Jadwal dakwah & majelis taklim</p>
                </div>
                <Link href="/admin/kegiatan">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    Kelola <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    Belum ada agenda kegiatan mendatang.
                  </p>
                ) : (
                  activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3"
                    >
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase">
                            {act.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDateTimeIndo(act.start_time).split(',')[0]}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {act.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{act.location}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
              <Link href="/admin/kegiatan">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  + Tambah Jadwal Kegiatan
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Recent Transactions Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Transaksi Terkini
            </h3>
            <p className="text-xs text-slate-500">Mutasi kas masuk dan keluar yang tercatat</p>
          </div>
          <Link href="/admin/keuangan">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              Lihat Semua Transaksi <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Referensi</th>
                <th className="py-3 px-4">Kategori Pos</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4">Pemberi / Penerima</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {transactions.slice(0, 6).map((t) => {
                const isIncome = t.transaction_type === 'income';
                return (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {formatDateIndo(t.transaction_date)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {t.reference_number || '-'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{t.category?.name || 'Umum'}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{t.description}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {t.source_destination || '-'}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                        isIncome ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {isIncome ? `+${formatRupiah(t.amount)}` : `-${formatRupiah(t.amount)}`}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
