'use client';

import React, { useState } from 'react';
import {
  Settings,
  Database,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Key,
  Shield,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataStore } from '@/lib/data/store';

export default function AdminPengaturanPage() {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [city, setCity] = useState('Jakarta');

  const handleResetData = () => {
    if (
      confirm(
        'Apakah Anda yakin ingin mengembalikan seluruh data transaksi, kegiatan, dan pengaturan ke data contoh awal?'
      )
    ) {
      DataStore.resetDemoData();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const hasSupabase =
    typeof window !== 'undefined' &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Konfigurasi Sistem</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Pengaturan Sistem & Integrasi MasjidSmart AI
          </h1>
          <p className="text-xs text-slate-500">
            Status konektivitas Supabase, pengaturan API AI, dan opsi reset data demonstrasi
          </p>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          Data berhasil direset ke demonstrasi awal. Memuat ulang halaman...
        </div>
      )}

      {/* Integration Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supabase Status */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 rounded-xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Database Supabase PostgreSQL
                </h3>
                <p className="text-[11px] text-slate-500">Penyimpanan relational terpusat</p>
              </div>
            </div>
            <Badge variant="success">
              {hasSupabase ? 'Tersambung Supabase' : 'Mode Offline / Local DB'}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {hasSupabase
              ? 'Aplikasi telah tersambung langsung ke Supabase PostgreSQL dengan Row Level Security aktif.'
              : 'Aplikasi saat ini beroperasi menggunakan penyimpanan lokal persisten dengan data simulasi realistis. Untuk menyambungkan ke Supabase Anda, cukup masukkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY pada file .env.local.'}
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
            <br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
          </div>
        </Card>

        {/* AI Model Status */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-800 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Integrasi Model AI (LLM)
                </h3>
                <p className="text-[11px] text-slate-500">Google Gemini / OpenAI Server-Side</p>
              </div>
            </div>
            <Badge variant="gold">Server API Siap</Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            AI Assistant dan Ringkasan Keuangan berjalan aman melalui Server-Side Route. Jika API key belum dipasang, sistem cerdas memiliki fallback knowledge engine deterministik sehingga chatbot dan ringkasan tetap menjawab akurat berdasarkan database masjid!
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            GEMINI_API_KEY=AIzaSy...
            <br />
            OPENAI_API_KEY=sk-... (Opsional)
          </div>
        </Card>
      </div>

      {/* Reset Demo Data & Testing Card */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          Pemeliharaan Data Demonstrasi
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Jika Anda telah melakukan banyak penambahan atau pembatalan transaksi saat pengujian dan ingin mengembalikan aplikasi ke kondisi bersih awal (data demonstrasi Masjid Raya Al-Muhajirin), Anda dapat mereset data kapan saja.
        </p>
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="text-xs gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Data ke Demonstrasi Semula
          </Button>
        </div>
      </Card>
    </div>
  );
}
