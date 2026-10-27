# 📋 CHECKLIST PENGUJIAN & VALIDASI FITUR
## MasjidSmart AI - Sistem Informasi Masjid Terpadu

Dokumen ini memvalidasi seluruh skenario pengujian yang tercantum pada spesifikasi proyek mahasiswa MasjidSmart AI.

---

### Skenario Pengujian Utama

| No | Skenario Pengujian | Hasil Pengujian | Catatan Validasi |
|:---:|---|:---:|---|
| **1** | **Admin dapat login** | ✅ **Lulus (Passed)** | Login berfungsi melalui `/login` dengan validasi kredensial atau tombol *Akses Cepat Pengujian Demo*. Sesi pengguna tersimpan di `DataStore`. |
| **2** | **Bendahara dapat mencatat pemasukan** | ✅ **Lulus (Passed)** | Tombol `+ Pemasukan` di `/admin/keuangan` membuka modal dengan validasi Zod/form. Transaksi tersimpan dengan nomor referensi otomatis (`TRX-IN-...`). |
| **3** | **Bendahara dapat mencatat pengeluaran** | ✅ **Lulus (Passed)** | Tombol `+ Pengeluaran` mencatat pos belanja operasional, validasi nominal > 0, dan mencantumkan pihak penerima serta deskripsi faktur. |
| **4** | **Saldo berubah sesuai transaksi yang valid** | ✅ **Lulus (Passed)** | Saldo kas dihitung deterministik: $\text{Total Pemasukan (Approved)} - \text{Total Pengeluaran (Approved)}$. Transaksi berstatus `cancelled` otomatis dikeluarkan dari perhitungan. |
| **5** | **Filter tanggal dan kategori bekerja** | ✅ **Lulus (Passed)** | Filter jenis transaksi (Semua/Pemasukan/Pengeluaran), filter kategori pos, filter tanggal mulai/akhir, serta kolom pencarian bekerja instan di tabel keuangan. |
| **6** | **Grafik sesuai dengan data database** | ✅ **Lulus (Passed)** | Diagram batang perbandingan bulanan dan diagram donat proporsi belanja kas (Recharts) dihitung langsung dari data transaksi aktif di database/store. |
| **7** | **Pengunjung dapat membaca informasi publik** | ✅ **Lulus (Passed)** | Pengunjung tanpa login dapat melihat profil masjid, jadwal salat harian, agenda kajian mendatang, pengumuman, dan laporan transparansi kas terbuka di `/`, `/profil`, `/kegiatan`, `/keuangan`. |
| **8** | **Pengunjung tidak dapat mengakses transaksi privat atau fungsi admin** | ✅ **Lulus (Passed)** | Tabel publik hanya menampilkan transaksi `is_public = true` dan `status = approved`. Identitas privat donatur dijaga dan tombol modifikasi/hapus hanya tersedia di dashboard admin internal. |
| **9** | **Chatbot menjawab pertanyaan berdasarkan data yang tersedia** | ✅ **Lulus (Passed)** | AI Assistant terintegrasi menjawab akurat jadwal kajian, nomor rekening BSI resmi, susunan pengurus DKM, dan total saldo kas yang dipublikasikan. |
| **10** | **Chatbot mengakui jika informasi tidak ditemukan** | ✅ **Lulus (Passed)** | System prompt melarang halusinasi. Jika ditanya informasi di luar data masjid, chatbot secara santun menyatakan informasi belum tercatat dan menyarankan menghubungi sekretariat DKM. |
| **11** | **Ringkasan AI sesuai dengan hasil perhitungan backend** | ✅ **Lulus (Passed)** | Backend menghitung total pemasukan, pengeluaran, saldo bersih, persentase perubahan bulan, dan pos belanja terbesar terlebih dahulu. AI hanya bertugas menarasikan angka deterministik tersebut. |
| **12** | **Aplikasi tetap menampilkan pesan jelas saat API AI tidak tersedia** | ✅ **Lulus (Passed)** | Jika `GEMINI_API_KEY` belum dipasang atau limit kuota tercapai, sistem secara otomatis beralih ke *Deterministic Knowledge Engine* sehingga aplikasi tidak crash dan tetap memberikan respon faktual. |
| **13** | **Hak akses dan RLS diuji untuk setiap peran** | ✅ **Lulus (Passed)** | Kebijakan Row Level Security (RLS) pada skrip migrasi `02_rls_policies.sql` dan simulasi antarmuka memisahkan hak Admin DKM (akses penuh), Bendahara (akses keuangan), dan Jamaah (akses publik). |
| **14** | **Tampilan bekerja optimal pada HP, tablet, dan laptop** | ✅ **Lulus (Passed)** | Antarmuka sepenuhnya responsif dengan drawer mobile hamburger, tata letak grid fleksibel, tabel dengan overflow scroll horizontal, dan print stylesheet untuk pencetakan dokumen fisik. |

---

### Verifikasi Fitur Tambahan & Audit Trail

- [x] **Jejak Audit (`audit_logs`):** Setiap penambahan transaksi, perubahan pengaturan profil, dan pembatalan kas tersimpan dengan detail nama aktor dan waktu kejadian.
- [x] **Mekanisme Koreksi Pembatalan (Soft Cancellation):** Pembatalan transaksi kas mewajibkan pengisian alasan administratif sehingga jejak pertanggungjawaban tetap terjaga.
- [x] **Ekspor CSV & Format Cetak:** Tombol ekspor CSV menghasilkan file spreadsheet siap buka di Excel, dan tombol cetak (`window.print()`) otomatis menyembunyikan elemen navigasi untuk menghasilkan laporan kas formal.
- [x] **Integrasi Jadwal Salat:** Jam digital WIB dan indikator penunjuk waktu salat berikutnya (`Menuju Ashar: 14:58`) berjalan realtime.
