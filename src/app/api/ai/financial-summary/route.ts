import { NextResponse } from 'next/server';
import { FinancialSummaryData } from '@/types/database';
import { formatRupiah } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { summaryData, mosqueName = 'Masjid Raya Al-Muhajirin' }: { summaryData: FinancialSummaryData; mosqueName?: string } = body;

    if (!summaryData) {
      return NextResponse.json({ error: 'Data keuangan deterministik diperlukan' }, { status: 400 });
    }

    const {
      totalIncome,
      totalExpense,
      currentBalance,
      incomeCount,
      expenseCount,
      topExpenseCategory,
      monthlyComparison,
      categoriesBreakdown,
    } = summaryData;

    const netCashflow = totalIncome - totalExpense;
    const isSurplus = netCashflow >= 0;

    // Prompt instructions ensuring the AI doesn't compute or hallucinate financial numbers,
    // but rather narrates the exact backend-calculated figures.
    const prompt = `Anda adalah seorang Penasihat Keuangan Masjid Profesional dan Akuntan Syariah untuk "${mosqueName}".
Berikut adalah HASIL PERHITUNGAN DETERMINISTIK SISTEM KEUANGAN MASJID:
- Total Pemasukan: ${formatRupiah(totalIncome)} (dari ${incomeCount} transaksi)
- Total Pengeluaran: ${formatRupiah(totalExpense)} (dari ${expenseCount} transaksi)
- Saldo Kas Akhir: ${formatRupiah(currentBalance)}
- Status Arus Kas: ${isSurplus ? 'Surplus positif' : 'Defisit operasional'} sebesar ${formatRupiah(Math.abs(netCashflow))}
- Kategori Pengeluaran Terbesar: ${topExpenseCategory ? `${topExpenseCategory.categoryName} (${formatRupiah(topExpenseCategory.totalAmount)}, menyerap ${topExpenseCategory.percentage}% total belanja)` : 'Belum ada data'}
- Perbandingan Bulan Ini vs Bulan Lalu:
  * Pemasukan Bulan Ini: ${formatRupiah(monthlyComparison?.thisMonthIncome || 0)} (perubahan ${monthlyComparison?.incomeChangePercent || 0}%)
  * Pengeluaran Bulan Ini: ${formatRupiah(monthlyComparison?.thisMonthExpense || 0)} (perubahan ${monthlyComparison?.expenseChangePercent || 0}%)

TUGAS ANDA:
Buatlah Laporan Narasi Eksekutif Keuangan Masjid yang jelas, mudah dipahami oleh Pengurus DKM dan Jamaah umum.
Format respon dalam 4 bagian markdown:
1. 📊 **Ringkasan Kesehatan Kas & Likuiditas** (Jelaskan kondisi saldo dan surplus/defisit secara lugas)
2. 🔍 **Sorotan Pos Belanja Utama** (Ulas kategori belanja terbesar dan urgensinya bagi operasional)
3. 📈 **Analisis Tren & Evaluasi Kinerja** (Bandingkan pencapaian bulan ini vs bulan lalu)
4. 💡 **Rekomendasi Strategis DKM** (Berikan 2-3 saran nyata untuk bendahara, misalnya optimalisasi QRIS atau efisiensi energi listrik)

ATURAN KETAT:
- Gunakan angka persis yang telah dihitung oleh backend di atas, jangan mengubah satu digit pun.
- Selalu cantumkan catatan kaki: "*Analisis AI ini merupakan ringkasan pendukung dan harus tetap diverifikasi oleh Bendahara DKM.*"`;

    // 1. Try Gemini API if key is present
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 900 },
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({
              narrative: text,
              source: 'gemini',
              calculatedData: summaryData,
            });
          }
        }
      } catch (err) {
        console.warn('Gemini financial summary failed, falling back:', err);
      }
    }

    // 2. Try OpenAI API if key is present
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return NextResponse.json({
              narrative: text,
              source: 'openai',
              calculatedData: summaryData,
            });
          }
        }
      } catch (err) {
        console.warn('OpenAI financial summary failed, falling back:', err);
      }
    }

    // 3. Fallback deterministic structured executive narrative
    const fallbackNarrative = `### 📊 Ringkasan Kesehatan Kas & Likuiditas
Alhamdulillah, kondisi keuangan **${mosqueName}** berada dalam status **${isSurplus ? 'Sehat (Surplus)' : 'Perlu Pengawasan (Defisit)'}**. 
Total penerimaan kas yang telah diverifikasi mencapai **${formatRupiah(totalIncome)}** dari ${incomeCount} transaksi, sedangkan total pengeluaran terealisasi sebesar **${formatRupiah(totalExpense)}** dari ${expenseCount} transaksi. 
Saat ini saldo kas aktif yang tersimpan dan siap dialokasikan berjumlah **${formatRupiah(currentBalance)}**.

### 🔍 Sorotan Pos Belanja Utama
${
  topExpenseCategory
    ? `Beban pengeluaran paling dominan terkonsentrasi pada **${topExpenseCategory.categoryName}** dengan nominal **${formatRupiah(topExpenseCategory.totalAmount)}** atau mencakup **${topExpenseCategory.percentage}%** dari seluruh anggaran keluar masjid. Alokasi ini wajar untuk menjamin kelangsungan ibadah harian jamaah dan pemeliharaan kenyamanan masjid.`
    : 'Belum ada catatan pengeluaran signifikan yang terverifikasi.'
}

### 📈 Analisis Tren & Evaluasi Kinerja
- **Pemasukan Bulan Ini:** Tercatat **${formatRupiah(monthlyComparison?.thisMonthIncome || 0)}** (${(monthlyComparison?.incomeChangePercent || 0) >= 0 ? 'Meningkat' : 'Menurun'} ${(monthlyComparison?.incomeChangePercent || 0)}% dibandingkan bulan sebelumnya).
- **Pengeluaran Bulan Ini:** Tercatat **${formatRupiah(monthlyComparison?.thisMonthExpense || 0)}** (${(monthlyComparison?.expenseChangePercent || 0) >= 0 ? 'Kenaikan' : 'Penghematan'} ${(monthlyComparison?.expenseChangePercent || 0)}% dari bulan lalu).
- Tren infaq kotak Jumat dan QRIS digital menunjukkan partisipasi jamaah yang konsisten dan penuh amanah.

### 💡 Rekomendasi Strategis DKM & Bendahara
1. **Penguatan Dana Cadangan (Reserve Fund):** Pertahankan saldo kas likuid minimal 2 bulan biaya operasional rutin (listrik, marbot, kebersihan) untuk mengantisipasi kebutuhan pemeliharaan darurat.
2. **Optimalisasi Infaq Digital QRIS:** Sosialisasikan barcode QRIS saat pengajian akhir pekan dan salat Jumat untuk memudahkan jamaah non-tunai.
3. **Efisiensi Energi Berkelanjutan:** Pertimbangkan otomatisasi timer pendingin ruangan (AC) dan penerangan hemat energi guna mengendalikan tagihan listrik bulanan.

---
> ⚠️ *Catatan: Analisis AI ini dihitung secara deterministik dari database dan disajikan sebagai alat bantu telaah manajerial pengurus. Pengambilan keputusan keuangan final tetap menjadi wewenang DKM.*`;

    return NextResponse.json({
      narrative: fallbackNarrative,
      source: 'deterministic_engine',
      calculatedData: summaryData,
    });
  } catch (error: any) {
    console.error('Financial summary error:', error);
    return NextResponse.json({ error: error?.message || 'Gagal memproses ringkasan keuangan' }, { status: 500 });
  }
}
