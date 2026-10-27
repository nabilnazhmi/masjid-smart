# 🚀 PANDUAN DEPLOYMENT KE VERCEL & SUPABASE
## MasjidSmart AI

Panduan lengkap ini menjelaskan langkah-langkah mendistribusikan (deploy) sistem informasi MasjidSmart AI ke platform cloud production (Vercel untuk frontend/API dan Supabase untuk database PostgreSQL).

---

## 🗄️ Langkah 1: Setup Supabase Database

1. **Buat Akun & Proyek:**
   - Kunjungi [supabase.com](https://supabase.com) dan buat proyek baru (misalnya dengan nama `masjidsmart-ai-prod`).
   - Pilih region terdekat (misalnya `Singapore - ap-southeast-1`).
   - Catat password database yang aman.

2. **Jalankan Skrip Migrasi SQL:**
   - Buka menu **SQL Editor** di dashboard Supabase.
   - Buka file `supabase/migrations/01_initial_schema.sql` di repository, salin isinya dan klik **Run**.
   - Buka file `supabase/migrations/02_rls_policies.sql`, salin dan klik **Run** untuk mengaktifkan Row Level Security.
   - Buka file `supabase/migrations/03_seed_demo_data.sql` dan klik **Run** untuk mengisi data awal demonstrasi masjid.

3. **Ambil Kredensial API:**
   - Buka menu **Project Settings -> API**.
   - Salin nilai **Project URL** (`https://xyz.supabase.co`).
   - Salin nilai **anon public key** (`eyJhbGciOi...`).

4. **Buat Akun Admin Pertama di Supabase Auth:**
   - Buka menu **Authentication -> Users** di Supabase.
   - Klik **Add User** -> Masukkan email admin masjid (contoh: `admin@masjid.id`) dan password kuat.
   - Salin `User UID` yang terbentuk.
   - Jalankan query SQL berikut di SQL Editor untuk menautkan profil ke user tersebut:
     ```sql
     INSERT INTO public.profiles (id, full_name, email, role)
     VALUES ('MASUKKAN-USER-UID-DISINI', 'Ketua DKM Masjid', 'admin@masjid.id', 'admin')
     ON CONFLICT (id) DO UPDATE SET role = 'admin';
     ```

---

## ☁️ Langkah 2: Deployment ke Vercel

1. **Push Source Code ke GitHub:**
   - Buat repository baru di GitHub (misal: `masjidsmart-ai`).
   - Inisialisasi dan push kode:
     ```bash
     git init
     git add .
     git commit -m "feat: complete MasjidSmart AI production ready release"
     git branch -M main
     git remote add origin https://github.com/USERNAME/masjidsmart-ai.git
     git push -u origin main
     ```

2. **Import ke Vercel:**
   - Buka [vercel.com](https://vercel.com) dan hubungkan akun GitHub Anda.
   - Klik **Add New... -> Project** lalu pilih repository `masjidsmart-ai`.
   - Pilih framework preset: **Next.js**.

3. **Konfigurasi Environment Variables di Vercel:**
   Di bagian **Environment Variables**, tambahkan variabel berikut:

   | Key | Value | Keterangan |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | URL proyek Supabase Anda |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Public Anon Key Supabase |
   | `GEMINI_API_KEY` | `AIzaSy...` | Google Gemini API Key |
   | `NEXT_PUBLIC_PRAYER_CITY` | `Jakarta` | Nama kota untuk jadwal salat |

4. **Klik "Deploy":**
   - Vercel akan otomatis meng-compile aplikasi Next.js dalam 1-2 menit.
   - Setelah selesai, Anda akan mendapatkan domain production resmi gratis seperti `https://masjidsmart-ai.vercel.app` atau dapat memasang custom domain masjid (misal: `masjidnurulhuda.id`).

---

## 🔒 Langkah 3: Verifikasi Pasca-Deployment

1. Buka domain production di browser.
2. Periksa jadwal salat harian pada bar bagian atas.
3. Buka floating widget **"Tanya AI Masjid"** dan coba tanyakan jadwal kajian terdekat.
4. Buka halaman **Transparansi Keuangan** dan pastikan grafik Recharts serta mutasi kas tampil sempurna.
5. Masuk ke halaman **Portal DKM** (`/login`) untuk menguji modul pembukuan kas dan penambahan kegiatan.
