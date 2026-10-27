import { NextResponse } from 'next/server';
import { Transaction, TransactionCategory, AnomalyReport } from '@/types/database';
import { detectTransactionAnomalies } from '@/lib/data/store';
import { formatRupiah } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      transactions = [],
      categories = [],
    }: { transactions: Transaction[]; categories: TransactionCategory[] } = body;

    // Run deterministic anomaly detection
    const heuristicReports: AnomalyReport[] = detectTransactionAnomalies(transactions, categories);

    // If Gemini key or OpenAI key is available, we can also generate an intelligent audit executive summary
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    let aiAuditBrief = '';

    if (heuristicReports.length === 0) {
      aiAuditBrief = 'Tidak ditemukan indikasi anomali sistem. Seluruh transaksi tercatat dalam rentang wajar dan memiliki atribut lengkap.';
    } else {
      const summaryItems = heuristicReports.map(
        (r, idx) =>
          `${idx + 1}. [${r.severity.toUpperCase()}] Ref: ${r.referenceNumber || r.transactionId} | Tgl: ${r.date} | Nominal: ${formatRupiah(r.amount)} | Alasan: ${r.reasons.join(', ')}`
      ).join('\n');

      const auditPrompt = `Anda adalah Asisten Auditor Internal Sistem MasjidSmart AI.
Berikut temuan sistem heuristik otomatis terhadap transaksi kas masjid:
${summaryItems}

Tolong buatkan kesimpulan telaah singkat (maksimal 2 paragraf) dalam bahasa Indonesia untuk Bendahara DKM.
ATURAN ETIKA:
1. Jangan gunakan kata-kata menghakimi seperti "korupsi", "penipuan", atau "kejahatan".
2. Gunakan terminologi audit santun seperti "perlu klarifikasi faktur", "kemungkinan salah input ganda", "kelengkapan nota bukti", atau "fluktuasi nilai donasi".
3. Tekankan bahwa bendahara hanya perlu mencocokkan dengan kwitansi/rekening koran fisik.`;

      if (geminiKey) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: auditPrompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 400 },
              }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            aiAuditBrief = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }
        } catch (err) {
          console.warn('Gemini anomaly summary failed:', err);
        }
      } else if (openAiKey) {
        try {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: auditPrompt }],
              temperature: 0.1,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            aiAuditBrief = data.choices?.[0]?.message?.content || '';
          }
        } catch (err) {
          console.warn('OpenAI anomaly summary failed:', err);
        }
      }

      if (!aiAuditBrief) {
        aiAuditBrief = `Ditemukan ${heuristicReports.length} transaksi yang memerlukan telaah verifikasi administratif oleh Bendahara. Sebagian besar terkait catatan ganda pada tanggal yang sama atau transaksi bernominal besar di atas rata-rata pos bersangkutan. Hal ini lumrah terjadi pada penerimaan wakaf atau servis berkala fasilitas gedung masjid.`;
      }
    }

    return NextResponse.json({
      reports: heuristicReports,
      aiAuditBrief,
      totalAnomalies: heuristicReports.length,
      disclaimer: 'Deteksi anomali ini bersifat peringatan dini administratif dan bukan merupakan tuduhan kesalahan/fraud. Seluruh data wajib diverifikasi dengan bukti fisik/mutasi bank oleh Bendahara DKM.',
    });
  } catch (error: any) {
    console.error('Anomaly detection error:', error);
    return NextResponse.json({ error: error?.message || 'Gagal menjalankan deteksi anomali' }, { status: 500 });
  }
}
