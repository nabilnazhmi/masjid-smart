# 🕌 MasjidSmart AI - Sistem Informasi Masjid & Transparansi Keuangan Terpadu

**MasjidSmart AI** adalah sistem informasi manajemen masjid modern, responsif, dan terintegrasi berbasis kecerdasan buatan (AI) yang dirancang khusus untuk mempermudah pengurus Dewan Kemakmuran Masjid (DKM), bendahara kas, dan melayani jamaah serta masyarakat secara transparan.

---

## 🌟 Fitur Unggulan

### 1. 🌐 Portal Publik Jamaah (Tanpa Login)
- **Beranda Digital:** Informasi identitas masjid, sambutan DKM, jadwal ibadah harian realtime, agenda kajian terdekat, warta pengumuman, dan ringkasan kas umat.
- **Jadwal Salat Otomatis:** Terhubung ke API jadwal salat Indonesia (Kemenag/Aladhan) dengan countdown waktu salat berikutnya dan jam digital WIB.
- **Profil Masjid Interaktif:** Sejarah, visi, misi, kontak resmi sekretariat, dan struktur pengurus DKM.
- **Informasi Kegiatan & Kajian:** Filter kategori agenda (Kajian Rutin, Subuh, Workshop, Santunan Yatim), pencarian, dan formulir pendaftaran peserta.
- **Transparansi Keuangan Terbuka:**
  - Grafik visual interaktif pemasukan vs pengeluaran bulanan (Recharts).
  - Distribusi komposisi pos belanja kas (Pie Chart).
  - Tabel mutasi kas terverifikasi dengan fitur pencarian, filter, dan unduh CSV / cetak laporan.
  - Penjagaan privasi donatur hamba Allah sesuai syariah & etika keterbukaan.

### 2. 🤖 MasjidSmart AI Assistant (Chatbot & Analitik)
- **Chatbot Pelayanan Jamaah:** Menjawab pertanyaan seputar jadwal kajian, struktur pengurus, nomor rekening donasi/QRIS, dan transparansi kas secara factual dari database tanpa halusinasi.
- **Ringkasan Naratif Keuangan Eksekutif:** AI mengonversi angka matematis deterministik dari database menjadi analisis narasi eksekutif untuk bahan rapat evaluasi DKM.
- **Deteksi Anomali Mutasi Kas:** Sistem heuristik mendeteksi potensi pencatatan ganda pada tanggal yang sama, deskripsi kosong, atau fluktuasi nilai donasi ekstrem untuk diverifikasi bendahara.
- **Keamanan & Etika:** Server-side API protection (API keys tidak bocor ke browser), proteksi data pribadi, dan peringatan bahwa keputusan keuangan tetap berada di tangan pengurus.

### 3. 🛡️ Dashboard Manajemen DKM (Internal Staff)
- **Role-Based Access Control (RBAC):** Pemisahan hak akses antara Admin DKM, Bendahara Kas, dan Jamaah.
- **Modul Pembukuan Keuangan:** Tambah pemasukan, tambah belanja, penomoran referensi otomatis, pagination, serta mekanisme pembatalan mutasi (void) yang meninggalkan jejak audit (`audit_logs`).
- **Manajemen Kategori Pos Kas:** Pengelompokan pos anggaran penerimaan dan pengeluaran beserta toggle visibilitas publik.
- **Manajemen Agenda Dakwah & Warta Pengumuman:** Publikasi kegiatan dan pengumuman dengan tingkat prioritas (Normal / Mendesak).
- **Pengaturan Profil & Rekening:** Perbarui nama masjid, visi misi, rekening BSI/bank syariah, dan susunan kepengurusan secara instan.

---

## 🛠️ Arsitektur & Teknologi

| Komponen | Teknologi |
|---|---|
| **Framework** | Next.js (App Router) + TypeScript |
| **Styling & UI** | Tailwind CSS (Emerald Dark, White, Gold Accent) + Lucide Icons |
| **Visualisasi Data** | Recharts (Bar Charts & Donut Charts) |
| **Validasi Skema** | Zod |
| **Database & Auth** | Supabase PostgreSQL + Supabase Auth + Row Level Security (RLS) |
| **Model AI (LLM)** | Google Gemini API (v1beta) / OpenAI API (Server-Side Route) |
| **Jadwal Salat** | Aladhan / Kemenag API Integration |

---

## 🚀 Panduan Instalasi Lokal

### 1. Prasyarat
- Node.js versi 18 ke atas (Direkomendasikan Node.js v20 atau v24)
- npm atau pnpm

### 2. Clone atau Buka Direktori Proyek
```bash
cd masjidsmart-ai
```

### 3. Pasang Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi konfigurasi Anda (lihat bagian Konfigurasi Supabase & AI di bawah).

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Konfigurasi Supabase PostgreSQL

Skrip migrasi database lengkap tersedia di folder `supabase/migrations/`:
1. `01_initial_schema.sql` (Tabel profiles, mosque_settings, categories, transactions, activities, announcements, audit_logs)
2. `02_rls_policies.sql` (Kebijakan Row Level Security ketat untuk tiap peran)
3. `03_seed_demo_data.sql` (Data realistis demonstrasi Masjid Raya Al-Muhajirin)

### Langkah Setup Supabase:
1. Buat project baru di [Supabase Dashboard](https://supabase.com).
2. Masuk ke menu **SQL Editor**, buka dan jalankan file `01_initial_schema.sql`, `02_rls_policies.sql`, lalu `03_seed_demo_data.sql`.
3. Buka **Project Settings -> API**, salin `URL` dan `anon public key` ke dalam `.env.local`.

---

## 🤖 Konfigurasi API AI (Google Gemini / OpenAI)

1. Dapatkan API Key Google Gemini gratis di [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Tambahkan ke file `.env.local`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
*(Catatan: Jika API key belum dipasang, sistem tetap beroperasi normal dengan Intelligent Knowledge Engine bawaan).*

---

## 🔑 Akun Demonstrasi Cepat (Pengujian)

Pada halaman login (`/login`), tersedia tombol **Akses Cepat Pengujian Demo**:
- **Admin DKM:** `admin@masjidsmart.id` (Akses penuh seluruh modul)
- **Bendahara Kas:** `bendahara@masjidsmart.id` (Akses pembukuan kas & audit anomali)
- **Jamaah:** `jamaah@masjidsmart.id` (Akses publik)

---

## 📄 Struktur Direktori Proyek

```
masjidsmart-ai/
├── src/
│   ├── app/
│   │   ├── (public)/          # Halaman publik (Beranda, Profil, Kegiatan, Keuangan)
│   │   ├── admin/             # Dashboard DKM (Keuangan, Kategori, AI, dll)
│   │   ├── api/               # Server-side API (AI chat, summary, anomaly, prayer)
│   │   ├── login/             # Portal autentikasi
│   │   ├── globals.css        # Tailwind & Print CSS
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ai/                # Widget chatbot AI Assistant
│   │   ├── public/            # Navbar, Footer, PrayerTimesBar
│   │   └── ui/                # Button, Card, Badge, Modal
│   ├── lib/
│   │   ├── data/              # DataStore, Deterministic calculations, Demo data
│   │   ├── supabase/          # Client & Server Supabase helpers
│   │   └── utils.ts           # Format Rupiah, Tanggal Indonesia, Helper cn
│   └── types/                 # Database types & Interfaces
├── supabase/
│   └── migrations/            # SQL migration & seed scripts
├── .env.example
├── README.md
├── PANDUAN_PENGURUS_MASJID.md
├── CHECKLIST_PENGUJIAN.md
└── PANDUAN_DEPLOYMENT.md
```
