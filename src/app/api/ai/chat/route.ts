import { NextResponse } from 'next/server';
import { INITIAL_MOSQUE_SETTINGS, INITIAL_ACTIVITIES, INITIAL_ANNOUNCEMENTS, INITIAL_CATEGORIES, INITIAL_TRANSACTIONS } from '@/lib/data/demo-data';
import { calculateFinancialSummary } from '@/lib/data/store';
import { formatRupiah, formatDateIndo } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [], contextData } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Pesan wajib diisi' }, { status: 400 });
    }

    // Prepare contextual information from database
    const settings = contextData?.settings || INITIAL_MOSQUE_SETTINGS;
    const activities = contextData?.activities || INITIAL_ACTIVITIES;
    const announcements = contextData?.announcements || INITIAL_ANNOUNCEMENTS;
    const categories = contextData?.categories || INITIAL_CATEGORIES;
    const transactions = contextData?.transactions || INITIAL_TRANSACTIONS;

    const financialSummary = calculateFinancialSummary(transactions, categories);

    const upcomingActivities = activities
      .filter((a: any) => a.status === 'upcoming')
      .map((a: any) => `- ${a.title} (${a.category}) pada ${formatDateIndo(a.start_time)}, Lokasi: ${a.location}, Penceramah: ${a.speaker || 'DKM'}, Registrasi: ${a.registration_required ? 'Wajib daftar' : 'Gratis langsung datang'}`)
      .join('\n');

    const publishedAnnouncements = announcements
      .filter((a: any) => a.status === 'published')
      .map((a: any) => `- [${a.priority.toUpperCase()}] ${a.title}: ${a.content}`)
      .join('\n');

    const dkmStructure = settings.structure_json
      ?.map((s: any) => `- ${s.role}: ${s.name} (${s.phone || 'Hubungi sekretariat'})`)
      .join('\n') || '- Belum tercatat';

    const systemPrompt = `Anda adalah "MasjidSmart AI Assistant", asisten virtual resmi untuk ${settings.mosque_name}.
Tugas Anda adalah melayani jamaah dan masyarakat dengan memberikan informasi akurat mengenai masjid.

PEDOMAN PENTING:
1. Jawab HANYA berdasarkan DATA MASJID RESMI berikut ini.
2. JANGAN PERNAH MENGARANG fakta, jadwal, nama orang, nomor rekening, atau angka keuangan di luar data ini.
3. Jika informasi yang ditanyakan jamaah TIDAK TERCANTUM dalam data di bawah, katakan secara jujur dan sopan bahwa informasi tersebut belum tersedia di sistem saat ini, lalu sarankan jamaah menghubungi pengurus DKM melalui ${settings.contact_phone || settings.contact_email}.
4. Gunakan gaya bahasa Indonesia yang santun, ramah, islami, dan profesional. Beri salam "Assalamu'alaikum Warahmatullahi Wabarakatuh" pada awal percakapan bila sesuai.
5. Format jawaban dengan markdown rapi (bullet points, bolding).

DATA MASJID RESMI:
- Nama Masjid: ${settings.mosque_name}
- Tagline: ${settings.tagline}
- Alamat: ${settings.address}
- Kontak Resmi: Telepon ${settings.contact_phone}, Email ${settings.contact_email}
- Rekening Infaq Resmi: ${settings.bank_name} ${settings.bank_account_number} a.n. ${settings.bank_account_holder}
- Visi: ${settings.vision}
- Misi: ${settings.mission?.join('; ')}

STRUKTUR PENGURUS DKM:
${dkmStructure}

JADWAL KEGIATAN & KAJIAN TERDEKAT:
${upcomingActivities || '- Tidak ada kegiatan terdekat'}

PENGUMUMAN TERBARU:
${publishedAnnouncements || '- Tidak ada pengumuman baru'}

RINGKASAN KEUANGAN PUBLIK:
- Total Penerimaan Kas Terdata: ${formatRupiah(financialSummary.totalIncome)}
- Total Pengeluaran Kas Terdata: ${formatRupiah(financialSummary.totalExpense)}
- Saldo Kas Tersedia: ${formatRupiah(financialSummary.currentBalance)}
- Donatur dapat menyalurkan infaq melalui transfer bank BSI resmi di atas atau scan QRIS di masjid.`;

    // 1. Try Google Gemini API if key is present
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: systemPrompt }],
                },
                ...history.map((h: any) => ({
                  role: h.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: h.content }],
                })),
                {
                  role: 'user',
                  parts: [{ text: message }],
                },
              ],
              generationConfig: {
                temperature: 0.2, // low temperature for high factual accuracy
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              reply,
              source: 'gemini',
              disclaimer: 'Informasi disajikan oleh MasjidSmart AI Assistant berdasarkan data riil masjid.',
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local engine:', err);
      }
    }

    // 2. Try OpenAI API if key is present
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey) {
      try {
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content: message },
            ],
            temperature: 0.2,
          }),
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          const reply = openAiData.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              reply,
              source: 'openai',
              disclaimer: 'Informasi disajikan oleh MasjidSmart AI Assistant berdasarkan data riil masjid.',
            });
          }
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to local engine:', err);
      }
    }

    // 3. Intelligent Deterministic Knowledge Engine Fallback (when no external API key is provided or offline)
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('jadwal') || lower.includes('kajian') || lower.includes('kegiatan') || lower.includes('acara')) {
      reply = `**Assalamu'alaikum Warahmatullahi Wabarakatuh.**\n\nBerikut adalah jadwal kegiatan dan kajian terdekat di **${settings.mosque_name}**:\n\n${upcomingActivities}\n\n*Semua kegiatan terbuka untuk umum dan gratis kecuali workshop tertentu yang memerlukan registrasi.*`;
    } else if (lower.includes('pengurus') || lower.includes('dkm') || lower.includes('ketua') || lower.includes('bendahara') || lower.includes('struktur')) {
      reply = `**Susunan Pengurus DKM ${settings.mosque_name}:**\n\n${dkmStructure}\n\nUntuk keperluan administrasi atau permohonan kegiatan, silakan hubungi Sekretariat DKM di nomor **${settings.contact_phone}** atau email **${settings.contact_email}**.`;
    } else if (lower.includes('keuangan') || lower.includes('saldo') || lower.includes('infaq') || lower.includes('laporan') || lower.includes('uang') || lower.includes('kas')) {
      reply = `**Ringkasan Transparansi Keuangan ${settings.mosque_name}:**\n\n- **Total Kas Masuk (Pemasukan):** ${formatRupiah(financialSummary.totalIncome)}\n- **Total Pengeluaran Kas:** ${formatRupiah(financialSummary.totalExpense)}\n- **Saldo Kas Saat Ini:** ${formatRupiah(financialSummary.currentBalance)}\n\nDonasi dan infaq dapat disalurkan langsung melalui rekening resmi masjid:\n🏦 **${settings.bank_name}**: \`${settings.bank_account_number}\` a.n. **${settings.bank_account_holder}**\n\nAnda juga dapat melihat rincian grafik dan pembukuan lengkap pada halaman **Transparansi Keuangan**.`;
    } else if (lower.includes('rekening') || lower.includes('donasi') || lower.includes('transfer') || lower.includes('qris')) {
      reply = `Untuk menyalurkan infaq, sedekah, dan wakaf ke **${settings.mosque_name}**, jamaah dapat menggunakan rekening resmi berikut:\n\n- **Bank:** ${settings.bank_name}\n- **Nomor Rekening:** \`${settings.bank_account_number}\`\n- **Atas Nama:** ${settings.bank_account_holder}\n\nAtau dengan memindai kode **QRIS** yang tersedia di loket dan standing banner masjid. Semoga Allah membalas kebaikan Anda dengan pahala yang berlipat ganda.`;
    } else if (lower.includes('alamat') || lower.includes('lokasi') || lower.includes('kontak') || lower.includes('hubungi') || lower.includes('dimana')) {
      reply = `**${settings.mosque_name}** berlokasi di:\n📍 **${settings.address}**\n\n📞 **Kontak Pengurus:** ${settings.contact_phone}\n✉️ **Email:** ${settings.contact_email}\n\nMasjid buka setiap hari untuk salat fardhu berjamaah dan kegiatan keagamaan umat.`;
    } else if (lower.includes('pengumuman') || lower.includes('informasi terbaru') || lower.includes('berita')) {
      reply = `**Pengumuman Terbaru di ${settings.mosque_name}:**\n\n${publishedAnnouncements}\n\nUntuk informasi lebih lanjut, silakan pantau papan pengumuman digital masjid atau hubungi pengurus.`;
    } else if (lower.includes('visi') || lower.includes('misi') || lower.includes('sejarah') || lower.includes('profil')) {
      reply = `**Profil ${settings.mosque_name}:**\n\n${settings.description}\n\n**Visi:**\n${settings.vision}\n\n**Misi Utama:**\n${settings.mission?.map((m: string) => `1. ${m}`).join('\n')}\n\n*Didirikan: ${settings.history?.slice(0, 160)}...*`;
    } else {
      reply = `Assalamu'alaikum Warahmatullahi Wabarakatuh. Terima kasih telah menghubungi **MasjidSmart AI Assistant** untuk ${settings.mosque_name}.\n\nSaya dapat membantu Anda mencari informasi mengenai:\n- 📅 **Jadwal Kajian & Kegiatan**\n- 👥 **Struktur Pengurus DKM**\n- 💰 **Laporan Transparansi Keuangan**\n- 🏦 **Nomor Rekening Infaq & QRIS**\n- 📢 **Pengumuman Terbaru Masjid**\n- 📍 **Lokasi dan Kontak Sekretariat**\n\nJika ada pertanyaan spesifik lainnya yang belum terjawab, Anda dapat langsung menghubungi Sekretariat DKM di **${settings.contact_phone}**.`;
    }

    return NextResponse.json({
      reply,
      source: 'knowledge_engine',
      disclaimer: 'Menampilkan respons data faktual database masjid (Konfigurasikan GEMINI_API_KEY di .env.local untuk integrasi LLM penuh).',
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      {
        error: 'Terjadi kendala saat memproses pertanyaan Anda.',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
