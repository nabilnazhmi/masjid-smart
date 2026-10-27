'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Lock,
  Layers,
  Send,
  User,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataStore, calculateFinancialSummary } from '@/lib/data/store';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import {
  FinancialSummaryData,
  AnomalyReport,
  Transaction,
  TransactionCategory,
} from '@/types/database';

export default function AdminAiAssistantPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'anomaly' | 'test'>('summary');
  const [summaryData, setSummaryData] = useState<FinancialSummaryData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  // 1. Financial Summary
  const [narrativeSummary, setNarrativeSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  // 2. Anomaly Detection
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [anomalyBrief, setAnomalyBrief] = useState<string>('');
  const [loadingAnomaly, setLoadingAnomaly] = useState(false);

  // 3. Interactive Testing
  const [testMessages, setTestMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'assistant',
      content:
        'Halo Pengurus DKM! Saya MasjidSmart AI Assistant. Anda dapat menguji pertanyaan jamaah atau meminta data kas langsung di sini.',
    },
  ]);
  const [testInput, setTestInput] = useState('');
  const [loadingTest, setLoadingTest] = useState(false);

  useEffect(() => {
    const trxs = DataStore.getTransactions();
    const cats = DataStore.getCategories();
    setTransactions(trxs);
    setCategories(cats);
    setSummaryData(calculateFinancialSummary(trxs, cats));
  }, []);

  const handleGenerateFinancialSummary = async () => {
    if (!summaryData) return;
    setLoadingSummary(true);
    try {
      const res = await fetch('/api/ai/financial-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryData,
          mosqueName: DataStore.getSettings().mosque_name,
        }),
      });
      const data = await res.json();
      setNarrativeSummary(data.narrative || 'Gagal memproses narasi.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleRunAnomalyDetection = async () => {
    setLoadingAnomaly(true);
    try {
      const res = await fetch('/api/ai/anomaly-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          categories,
        }),
      });
      const data = await res.json();
      setAnomalies(data.reports || []);
      setAnomalyBrief(data.aiAuditBrief || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnomaly(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || loadingTest) return;

    const query = testInput;
    setTestMessages((prev) => [...prev, { role: 'user', content: query }]);
    setTestInput('');
    setLoadingTest(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: testMessages.slice(-4),
          contextData: {
            settings: DataStore.getSettings(),
            activities: DataStore.getActivities(),
            announcements: DataStore.getAnnouncements(),
            categories: DataStore.getCategories(),
            transactions: DataStore.getTransactions(),
          },
        }),
      });
      const data = await res.json();
      setTestMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Tidak ada balasan.',
        },
      ]);
    } catch (err) {
      setTestMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Terjadi gangguan saat memproses API AI.',
        },
      ]);
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Kecerdasan Buatan Terpadu</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            MasjidSmart AI Intelligence Hub
          </h1>
          <p className="text-xs text-slate-500">
            Pusat analitik AI untuk ringkasan kas eksekutif, deteksi anomali mutasi, dan simulasi asisten jamaah
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'summary'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Ringkasan Keuangan AI
        </button>
        <button
          onClick={() => setActiveTab('anomaly')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'anomaly'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Deteksi Anomali Mutasi
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'test'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          Uji Coba Chatbot Jamaah
        </button>
      </div>

      {/* TAB 1: FINANCIAL SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Generator Laporan Naratif Eksekutif Kas
                </h3>
                <p className="text-xs text-slate-500">
                  AI mengonversi seluruh angka matematis deterministik dari database menjadi telaah naratif yang mudah dipahami musyawarah DKM.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateFinancialSummary}
                isLoading={loadingSummary}
                className="gap-2 shrink-0"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                {narrativeSummary ? 'Analisis Ulang Kas' : 'Jalankan Analisis AI'}
              </Button>
            </div>

            {narrativeSummary ? (
              <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed space-y-2">
                {narrativeSummary}
              </div>
            ) : (
              <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-3">
                <TrendingUp className="w-10 h-10 text-emerald-700 mx-auto" />
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Belum ada narasi yang di-generate. Klik tombol di atas untuk menghasilkan telaah komparasi bulan ini, surplus/defisit, dan saran penghematan listrik/operasional masjid.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: ANOMALY DETECTION */}
      {activeTab === 'anomaly' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  Deteksi Anomali & Rekomendasi Verifikasi Bendahara
                </h3>
                <p className="text-xs text-slate-500">
                  Sistem mengecek indikasi potensi salah catat, catatan ganda pada tanggal yang sama, deskripsi kosong, atau lonjakan nominal ekstrem.
                </p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleRunAnomalyDetection}
                isLoading={loadingAnomaly}
                className="gap-2 shrink-0"
              >
                <AlertTriangle className="w-4 h-4 text-white" />
                Pindai Transaksi Kas
              </Button>
            </div>

            {/* AI Auditor Brief */}
            {anomalyBrief && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 mb-6 leading-relaxed">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <Bot className="w-4 h-4 text-amber-700" />
                  Telaah Ringkas AI Auditor:
                </span>
                {anomalyBrief}
              </div>
            )}

            {/* Anomaly items */}
            {anomalies.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ditemukan {anomalies.length} transaksi yang perlu diverifikasi bendahara:
                </p>
                {anomalies.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="danger">
                          {a.severity === 'high' ? 'Perhatian Utama' : 'Klarifikasi'}
                        </Badge>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          Ref: {a.referenceNumber || a.transactionId}
                        </span>
                        <span className="text-slate-500">({formatDateIndo(a.date)})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatRupiah(a.amount)}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      Pos: {a.categoryName} • Uraian: "{a.description}"
                    </p>

                    <div className="text-[11px] text-red-700 dark:text-red-300 space-y-0.5">
                      {a.reasons.map((r, rIdx) => (
                        <p key={rIdx}>• {r}</p>
                      ))}
                    </div>

                    <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium pt-1">
                      💡 Saran Verifikasi: {a.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Klik "Pindai Transaksi Kas" untuk menjalankan algoritma audit heuristik terhadap pembukuan masjid.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 3: PLAYGROUND / TESTER */}
      {activeTab === 'test' && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Simulator Interaktif Chatbot Jamaah
            </h3>
            <p className="text-xs text-slate-500">
              Uji bagaimana AI Assistant menjawab pertanyaan jamaah mengenai jadwal kajian, infaq, kontak sekretariat, dan pengumuman.
            </p>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs mb-3">
            {testMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-xl whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loadingTest && (
              <div className="text-[11px] text-slate-400 italic">AI sedang menjawab...</div>
            )}
          </div>

          <form onSubmit={handleSendTest} className="flex gap-2">
            <input
              type="text"
              placeholder="Ketik pertanyaan simulasi jamaah (e.g. Kapan kajian berikutnya?)"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
            <Button type="submit" variant="primary" size="sm" disabled={loadingTest}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}

      {/* Security notice card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Keamanan & Etika AI:</strong> Seluruh pemanggilan AI dijalankan melalui API server-side terproteksi. Data sensitif pribadi donatur tidak pernah dikirim ke penyedia AI. Hasil deteksi anomali bersifat telaah manajerial dan tidak menggantikan keputusan musyawarah pengurus DKM.
        </p>
      </div>
    </div>
  );
}
