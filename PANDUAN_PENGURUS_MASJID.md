# 📖 PANDUAN PENGGUNAAN PENGURUS MASJID (DKM)
## Sistem Informasi MasjidSmart AI

Panduan ini disusun untuk memudahkan Pengurus DKM, Bendahara, dan Panitia Kegiatan dalam mengoperasikan aplikasi MasjidSmart AI sehari-hari.

---

## 📌 1. Cara Masuk ke Portal Pengurus (Login)
1. Buka browser dan arahkan ke alamat website masjid.
2. Klik tombol **"Portal DKM"** di pojok kanan atas atau buka langsung URL `/login`.
3. Masukkan email dan kata sandi yang telah didaftarkan.
4. *Untuk demonstrasi awal:* Anda dapat menggunakan tombol cepat **"Masuk sbg Admin"** atau **"Masuk sbg Bendahara"**.

---

## 💰 2. Modul Keuangan & Pembukuan Kas (Untuk Bendahara)

### A. Mencatat Pemasukan Kas (Infaq/Sedekah/Wakaf)
1. Buka menu **Keuangan** di sidebar dashboard.
2. Klik tombol hijau **"+ Pemasukan"**.
3. Isi data transaksi:
   - **Tanggal Transaksi:** Pilih tanggal penerimaan dana.
   - **Kategori Pos:** Pilih pos yang sesuai (contoh: *Infaq Kotak Jumat*, *Sedekah Subuh*, *Zakat Maal*, atau *Wakaf Renovasi*).
   - **Nominal (Rp):** Masukkan angka tanpa titik (contoh: `5000000`).
   - **Pemberi / Sumber:** Isi dengan nama donatur atau *Hamba Allah*.
   - **Uraian Deskripsi:** Jelaskan secara ringkas peruntukan penerimaan.
   - **Centang "Publikasikan":** Agar nominal masuk ke laporan transparansi jamaah.
4. Klik **"Simpan Transaksi Kas"**. Saldo kas akan otomatis bertambah secara realtime.

### B. Mencatat Pengeluaran (Belanja Operasional & Santunan)
1. Buka menu **Keuangan**.
2. Klik tombol merah **"+ Pengeluaran"**.
3. Pilih kategori pos (contoh: *Operasional Listrik PLN*, *Honorarium Marbot*, *Santunan Yatim*).
4. Masukkan nominal dan uraian pengeluaran sesuai nota/kwitansi fisik.
5. Klik **"Simpan Transaksi Kas"**. Saldo kas akan otomatis berkurang secara presisi.

### C. Pembatalan Transaksi (Mekanisme Koreksi & Audit)
Sistem MasjidSmart AI menerapkan prinsip akuntansi amanah yang tidak menghapus transaksi sembarangan:
1. Cari transaksi yang ingin dibatalkan pada tabel.
2. Klik ikon tanda silang merah (**Batalkan**).
3. Masukkan **Alasan Pembatalan Administratif** (contoh: *"Salah input nominal ganda oleh panitia"*).
4. Transaksi akan diberi status **Dibatalkan (Void)** dan tidak lagi dihitung dalam saldo kas, namun tetap tersimpan pada jejak audit untuk transparansi.

### D. Ekspor dan Cetak Laporan Keuangan
- **Ekspor CSV:** Klik tombol **"CSV"** untuk mengunduh rekap mutasi ke format Microsoft Excel.
- **Cetak Laporan:** Klik tombol **"Cetak"** atau tekan `Ctrl + P`. Tampilan telah diformat rapi bebas dari tombol navigasi untuk ditandatangani Ketua DKM dan Bendahara.

---

## 📅 3. Mengelola Jadwal Kegiatan & Kajian (Untuk Sekretaris/Bidang Dakwah)
1. Masuk ke menu **Kegiatan** di sidebar.
2. Klik **"+ Tambah Jadwal Kegiatan"**.
3. Masukkan:
   - Judul / Tema kajian.
   - Kategori (Kajian Rutin, Subuh Mengaji, Workshop, Santunan).
   - Nama Ustadz / Narasumber.
   - Tanggal & jam mulai kegiatan.
   - Ruangan / lokasi masjid.
   - Opsi: Centang *"Wajibkan formulir pendaftaran"* jika kuota jamaah terbatas.
4. Klik **"Simpan Jadwal Kegiatan"**. Jadwal akan langsung terbit di Beranda Jamaah dan dapat dijawab oleh AI Assistant.

---

## 📢 4. Mempublikasikan Warta & Pengumuman
1. Masuk ke menu **Pengumuman** di sidebar.
2. Klik **"+ Buat Pengumuman Baru"**.
3. Masukkan judul dan isi pengumuman.
4. Pilih tingkat prioritas:
   - **Normal:** Untuk informasi kegiatan atau laporan umum.
   - **Mendesak / Penting:** Ditandai badge merah khusus di halaman depan (contoh: himbauan salat gerhana atau penataan parkir Jumat).
5. Pilih status **"Terbit"** lalu simpan.

---

## 🏛️ 5. Memperbarui Profil & Rekening Masjid
1. Masuk ke menu **Profil Masjid** di sidebar.
2. Anda dapat memperbarui:
   - Nama resmi masjid dan alamat lengkap.
   - Nomor WhatsApp resmi sekretariat DKM.
   - Rekening Bank Syariah & QRIS untuk infaq umat.
   - Visi & Misi DKM.
   - Susunan nama pengurus DKM (Ketua, Bendahara, Marbot, dll).
3. Klik **"Simpan Perubahan Profil Masjid"**.

---

## 🤖 6. Menggunakan AI Assistant & Deteksi Anomali
1. Masuk ke menu **AI Assistant** di sidebar.
2. **Ringkasan Keuangan AI:** Klik *"Jalankan Analisis AI"* untuk membuat ringkasan evaluasi kas bulanan otomatis yang siap dibacakan saat laporan pertanggungjawaban musyawarah DKM.
3. **Deteksi Anomali Mutasi:** Klik *"Pindai Transaksi Kas"*. AI akan menandai jika ada indikasi salah catat, catatan ganda pada tanggal yang sama, atau lonjakan nominal yang perlu dicocokkan dengan rekening koran.
4. **Simulator Chatbot:** Anda dapat menguji pertanyaan umum untuk memastikan asisten virtual memberikan respon yang ramah dan akurat.
