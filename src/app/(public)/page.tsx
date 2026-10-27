'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  MapPin,
  Bot,
  Sparkles,
  ShieldCheck,
  Megaphone,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DataStore, calculateFinancialSummary } from '@/lib/data/store';
import { formatRupiah, formatDateIndo, formatDateTimeIndo } from '@/lib/utils';
import { MosqueSettings, Activity, Announcement, FinancialSummaryData } from '@/types/database';

export default function HomePage() {
  const [settings, setSettings] = useState<MosqueSettings | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from store
    const s = DataStore.getSettings();
    const acts = DataStore.getActivities('upcoming');
    const anns = DataStore.getAnnouncements('published');
    const cats = DataStore.getCategories();
    const trxs = DataStore.getTransactions({ publicOnly: true });

    setSettings(s);
    setActivities(acts.slice(0, 3)); // 3 upcoming
    setAnnouncements(anns.slice(0, 3));
    setFinancialSummary(calculateFinancialSummary(trxs, cats));
    setLoading(false);
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Memuat portal MasjidSmart AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white py-16 sm:py-24">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-600 text-amber-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Sistem Informasi & Transparansi Berbasis AI
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Selamat Datang di <br />
              <span className="text-amber-400">{settings.mosque_name}</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              {settings.tagline || settings.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/kegiatan">
                <Button variant="gold" size="lg" className="gap-2 shadow-lg shadow-amber-500/20">
                  <Calendar className="w-5 h-5 text-gray-900" />
                  Jadwal Kajian Terdekat
                </Button>
              </Link>
              <Link href="/keuangan">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-emerald-700/40 border-emerald-500 text-white hover:bg-emerald-700/70"
                >
                  <TrendingUp className="w-5 h-5 text-amber-300" />
                  Transparansi Kas Masjid
                </Button>
              </Link>
            </div>

            {/* Address bar */}
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 pt-4 border-t border-emerald-700/60">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ringkasan Keuangan Publik (Transparansi Utama) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
        <Card className="shadow-xl border-emerald-900/10 overflow-hidden bg-white dark:bg-gray-900">
          <div className="bg-emerald-50 dark:bg-gray-800/80 px-6 py-4 border-b border-emerald-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-emerald-950 dark:text-white">
                  Transparansi Kas Umat (Terverifikasi DKM)
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Pencatatan kas masuk dan keluar yang disahkan bendahara & diaudit terbuka.
              </p>
            </div>
            <Link href="/keuangan" className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1">
              Lihat Pembukuan Lengkap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Saldo Kas */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-900 text-white shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
                  Saldo Kas Tersedia
                </span>
                <span className="p-2 rounded-lg bg-emerald-700/60 text-amber-300">
                  <DollarSign className="w-5 h-5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-3 text-amber-300 tracking-tight">
                {formatRupiah(financialSummary?.currentBalance || 0)}
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                Siap digunakan untuk operasional & dakwah
              </p>
            </div>

            {/* Total Pemasukan */}
            <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-gray-800/60 border border-emerald-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                  Pemasukan Terdata
                </span>
                <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <TrendingUp className="w-5 h-5" />
                </span>
              </div>
              <div className="text-2xl font-bold mt-3 text-emerald-900 dark:text-emerald-400">
                {formatRupiah(financialSummary?.totalIncome || 0)}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Dari {financialSummary?.incomeCount || 0} pos penerimaan infaq/wakaf
              </p>
            </div>

            {/* Total Pengeluaran */}
            <div className="p-5 rounded-xl bg-red-50/70 dark:bg-gray-800/60 border border-red-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                  Penyaluran & Belanja
                </span>
                <span className="p-2 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300">
                  <TrendingDown className="w-5 h-5" />
                </span>
              </div>
              <div className="text-2xl font-bold mt-3 text-red-900 dark:text-red-400">
                {formatRupiah(financialSummary?.totalExpense || 0)}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Operasional listrik, marbot, santunan yatim & kajian
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Sambutan & Visi DKM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Badge variant="success">Profil & Amanah DKM</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              Membangun Masjid yang Mandiri, Transparan, dan Memakmurkan Jamaah
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {settings.description}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Transparansi Syar'i 100%
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                    Laporan keuangan dipublikasikan secara terbuka kepada seluruh jamaah.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 flex-1">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-300">
                    Pelayanan Jamaah Berbasis AI
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                    Asisten virtual 24 jam menjawab pertanyaan seputar masjid & kegiatan.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Link href="/profil">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Selengkapnya tentang Profil Masjid <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="border-emerald-200 dark:border-gray-800 p-6 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-800 rounded-xl text-amber-300 border border-amber-400/30">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Infaq & Sedekah Terpercaya</h3>
                  <p className="text-xs text-emerald-200">Salurkan donasi ke rekening resmi masjid</p>
                </div>
              </div>

              <div className="space-y-3 bg-emerald-800/60 p-4 rounded-xl border border-emerald-700/80 text-xs">
                <div>
                  <span className="text-[11px] text-emerald-300">Nama Bank:</span>
                  <p className="font-bold text-sm text-white">{settings.bank_name}</p>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-300">Nomor Rekening:</span>
                  <p className="font-mono text-lg font-extrabold text-amber-300 tracking-wider">
                    {settings.bank_account_number}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-300">Atas Nama:</span>
                  <p className="font-medium text-white">{settings.bank_account_holder}</p>
                </div>
              </div>

              <p className="text-[11px] text-emerald-200/80 mt-4 leading-relaxed">
                Setiap rupiah yang Anda infaqkan dialokasikan untuk operasional masjid, santunan anak yatim, dan kemakmuran dakwah.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Jadwal Kajian & Kegiatan Terdekat */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <Badge variant="info">Agenda Dakwah</Badge>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              Kajian & Kegiatan Mendatang
            </h2>
            <p className="text-xs text-gray-500">
              Mari hadir dan raih keberkahan majelis ilmu di {settings.mosque_name}.
            </p>
          </div>
          <Link href="/kegiatan">
            <Button variant="outline" size="sm" className="gap-1.5 self-start">
              Lihat Seluruh Kegiatan <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-gray-50 rounded-xl text-gray-500 text-sm">
              Belum ada kegiatan mendatang yang dijadwalkan.
            </div>
          ) : (
            activities.map((act) => (
              <Card key={act.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="gold">{act.category}</Badge>
                    {act.registration_required && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Wajib Daftar
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base mt-2 line-clamp-2 leading-snug">
                    {act.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 pb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{formatDateTimeIndo(act.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{act.location}</span>
                  </div>
                  {act.speaker && (
                    <div className="pt-2 text-[11px] font-medium text-emerald-800 dark:text-emerald-400">
                      Narasumber: {act.speaker}
                    </div>
                  )}
                  {act.description && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 pt-1">{act.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* 5. Pengumuman Resmi DKM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-800 text-amber-300 rounded-xl">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Warta & Pengumuman DKM</h2>
              <p className="text-xs text-emerald-200">Informasi resmi terkini untuk seluruh jamaah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-emerald-900/60 rounded-xl p-4 border border-emerald-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-300 mb-2">
                    <span className="font-semibold uppercase tracking-wider">{ann.category || 'Umum'}</span>
                    <span>{formatDateIndo(ann.published_at)}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2 leading-snug">{ann.title}</h4>
                  <p className="text-xs text-emerald-100/80 line-clamp-3 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
