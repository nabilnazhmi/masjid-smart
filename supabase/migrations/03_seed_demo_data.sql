-- ==============================================================================
-- MASJIDSMART AI - DEMO SEED DATA
-- Migration: 03_seed_demo_data.sql
-- Description: Realistic initial demonstration data for demonstration & testing
-- Note: Data is clearly marked as demonstration/sample records
-- ==============================================================================

-- 1. Insert Mosque Profile & Settings
INSERT INTO public.mosque_settings (
    id,
    mosque_name,
    tagline,
    address,
    city,
    description,
    history,
    vision,
    mission,
    structure_json,
    contact_email,
    contact_phone,
    bank_name,
    bank_account_number,
    bank_account_holder,
    prayer_api_city
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Masjid Raya Al-Muhajirin',
    'Pusat Ibadah, Dakwah, dan Pemberdayaan Umat Modern Berbasis AI',
    'Jl. Kemang Raya No. 45, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730',
    'Jakarta',
    'Masjid Raya Al-Muhajirin merupakan pusat peradaban dan ibadah kaum muslimin yang berkomitmen pada transparansi manajemen, keterbukaan laporan keuangan, dan pemanfaatan teknologi kecerdasan buatan demi kenyamanan jamaah.',
    'Didirikan pada tahun 1998 atas inisiatif warga perumahan dan tokoh masyarakat setempat. Sejak renovasi besar pada tahun 2021, masjid ini kini memiliki kapasitas 1.500 jamaah dan dilengkapi sarana digital modern serta fasilitas ramah lansia dan disabilitas.',
    'Menjadi masjid yang mandiri, transparan, dan menjadi pelopor peradaban umat yang rahmatan lil alamin dengan teknologi digital.',
    '[
        "Menyelenggarakan ibadah salat fardhu dan kegiatan keagamaan secara rutin dan khidmat",
        "Menerapkan transparansi penuh dalam pengelolaan keuangan donasi umat melalui sistem digital",
        "Menyelenggarakan program pendidikan Al-Quran, kajian keislaman tematik, dan pembinaan pemuda",
        "Memberdayakan ekonomi jamaah dan menyalurkan program bantuan sosial bagi dhuafa serta anak yatim"
    ]'::jsonb,
    '[
        {"role": "Ketua DKM", "name": "Drs. H. Ahmad Farhan, M.Ag", "phone": "0812-3456-7890"},
        {"role": "Wakil Ketua DKM", "name": "Ir. H. Budi Santoso", "phone": "0813-8765-4321"},
        {"role": "Sekretaris", "name": "Muhammad Ridwan, S.Kom", "phone": "0856-1122-3344"},
        {"role": "Bendahara Utama", "name": "H. Bambang Irawan, SE, Ak", "phone": "0818-9988-7766"},
        {"role": "Ketua Bidang Dakwah & Ibadah", "name": "Ustadz Faisal Rahman, Lc", "phone": "0812-9900-1122"},
        {"role": "Ketua Bidang Sosial & Yatim", "name": "Hj. Siti Aisyah, S.Pd", "phone": "0813-4455-6677"},
        {"role": "Koordinator Sarana & Marbot", "name": "Pak Sutrisno", "phone": "0857-7788-9900"}
    ]'::jsonb,
    'sekretariat@almuhajirin.id',
    '+62 812-3456-7890',
    'Bank Syariah Indonesia (BSI)',
    '7123-4567-89',
    'DKM Masjid Raya Al-Muhajirin',
    'Jakarta'
) ON CONFLICT (id) DO UPDATE SET
    mosque_name = EXCLUDED.mosque_name,
    tagline = EXCLUDED.tagline,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    description = EXCLUDED.description,
    vision = EXCLUDED.vision,
    mission = EXCLUDED.mission,
    structure_json = EXCLUDED.structure_json;

-- 2. Insert Transaction Categories
INSERT INTO public.transaction_categories (id, name, transaction_type, description, is_public) VALUES
    ('11111111-0000-0000-0000-000000000001', 'Infaq Kotak Jumat', 'income', 'Penerimaan infaq dan sedekah dari kotak amal salat Jumat', true),
    ('11111111-0000-0000-0000-000000000002', 'Sedekah Subuh & Harian', 'income', 'Penerimaan sedekah rutin harian jamaah dan transfer QRIS', true),
    ('11111111-0000-0000-0000-000000000003', 'Zakat Maal & Fitrah', 'income', 'Penerimaan zakat maal warga untuk disalurkan ke asnaf', true),
    ('11111111-0000-0000-0000-000000000004', 'Wakaf Renovasi & Sarana', 'income', 'Donasi terikat untuk pembangunan sarana fisik dan pendingin ruangan', true),
    ('11111111-0000-0000-0000-000000000005', 'Donasi Kegiatan Khusus', 'income', 'Sponsorship atau donasi untuk PHBI (Maulid, Isra Miraj, Ramadhan)', true),
    
    ('22222222-0000-0000-0000-000000000001', 'Operasional Listrik & Air (PLN/PAM)', 'expense', 'Pembayaran tagihan listrik AC masjid dan suplai air wudhu', true),
    ('22222222-0000-0000-0000-000000000002', 'Honorarium Imam, Muadzin & Marbot', 'expense', 'Mukafaah bulanan untuk petugas ibadah dan kebersihan masjid', true),
    ('22222222-0000-0000-0000-000000000003', 'Honorarium Penceramah & Kajian', 'expense', 'Bisyaf / honor narasumber kajian rutin pekanan dan tabligh akbar', true),
    ('22222222-0000-0000-0000-000000000004', 'Santunan Anak Yatim & Dhuafa', 'expense', 'Penyaluran dana santunan tunai dan paket sembako bulanan', true),
    ('22222222-0000-0000-0000-000000000005', 'Pemeliharaan Gedung & Sound System', 'expense', 'Perbaikan berkala sound system, AC, mikrofon, dan fasilitas toilet', true),
    ('22222222-0000-0000-0000-000000000006', 'Konsumsi Jamaah & Kajian', 'expense', 'Snack kajian, kurma, teh hangat, dan hidangan ifthar sunnah', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Initial Transactions (Realistic multi-month data for rich charts & calculations)
INSERT INTO public.transactions (
    id, transaction_date, transaction_type, category_id, amount, description, source_destination, reference_number, status, is_public
) VALUES
    -- Bulan Lalu (Pemasukan)
    ('33333333-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '35 days', 'income', '11111111-0000-0000-0000-000000000001', 5850000, 'Kotak Infaq Salat Jumat Pekan 1 Bulan Lalu', 'Jamaah Jumat', 'TRX-IN-001', 'approved', true),
    ('33333333-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '28 days', 'income', '11111111-0000-0000-0000-000000000001', 6420000, 'Kotak Infaq Salat Jumat Pekan 2 Bulan Lalu', 'Jamaah Jumat', 'TRX-IN-002', 'approved', true),
    ('33333333-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '26 days', 'income', '11111111-0000-0000-0000-000000000003', 10000000, 'Zakat Maal Perorangan via Transfer BSI', 'Hamba Allah', 'TRX-IN-003', 'approved', true),
    ('33333333-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '24 days', 'income', '11111111-0000-0000-0000-000000000002', 3200000, 'Sedekah Subuh & QRIS Pekanan', 'Jamaah Subuh', 'TRX-IN-004', 'approved', true),
    
    -- Bulan Lalu (Pengeluaran)
    ('33333333-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '30 days', 'expense', '22222222-0000-0000-0000-000000000001', 2850000, 'Tagihan Listrik PLN 3 Phase Bulan Lalu', 'PLN UID Jaya', 'TRX-OUT-001', 'approved', true),
    ('33333333-0000-0000-0000-000000000006', CURRENT_DATE - INTERVAL '27 days', 'expense', '22222222-0000-0000-0000-000000000002', 5000000, 'Mukafaah 2 Marbot & 1 Muadzin Bulan Lalu', 'Petugas DKM', 'TRX-OUT-002', 'approved', true),
    ('33333333-0000-0000-0000-000000000007', CURRENT_DATE - INTERVAL '25 days', 'expense', '22222222-0000-0000-0000-000000000004', 6000000, 'Penyaluran Santunan 20 Anak Yatim Binaan', 'Anak Yatim Kemang', 'TRX-OUT-003', 'approved', true),
    
    -- Bulan Ini (Pemasukan)
    ('33333333-0000-0000-0000-000000000008', CURRENT_DATE - INTERVAL '14 days', 'income', '11111111-0000-0000-0000-000000000001', 7150000, 'Kotak Infaq Salat Jumat Pekan 1', 'Jamaah Jumat', 'TRX-IN-005', 'approved', true),
    ('33333333-0000-0000-0000-000000000009', CURRENT_DATE - INTERVAL '10 days', 'income', '11111111-0000-0000-0000-000000000002', 4300000, 'Penerimaan Infaq QRIS & Sedekah Subuh', 'Jamaah Masjid', 'TRX-IN-006', 'approved', true),
    ('33333333-0000-0000-0000-000000000010', CURRENT_DATE - INTERVAL '7 days', 'income', '11111111-0000-0000-0000-000000000001', 6800000, 'Kotak Infaq Salat Jumat Pekan 2', 'Jamaah Jumat', 'TRX-IN-007', 'approved', true),
    ('33333333-0000-0000-0000-000000000011', CURRENT_DATE - INTERVAL '3 days', 'income', '11111111-0000-0000-0000-000000000004', 15000000, 'Wakaf Pengadaan AC Standing 5 PK Ruang Utama', 'H. Hendra Gunawan', 'TRX-IN-008', 'approved', true),
    ('33333333-0000-0000-0000-000000000012', CURRENT_DATE - INTERVAL '1 days', 'income', '11111111-0000-0000-0000-000000000002', 2100000, 'Sedekah Jamaah Pengajian Akhir Pekan', 'Keluarga Jamaah', 'TRX-IN-009', 'approved', true),

    -- Bulan Ini (Pengeluaran)
    ('33333333-0000-0000-0000-000000000013', CURRENT_DATE - INTERVAL '12 days', 'expense', '22222222-0000-0000-0000-000000000001', 3120000, 'Tagihan Listrik PLN Gedung Utama Bulan Berjalan', 'PLN Rayon Mampang', 'TRX-OUT-004', 'approved', true),
    ('33333333-0000-0000-0000-000000000014', CURRENT_DATE - INTERVAL '9 days', 'expense', '22222222-0000-0000-0000-000000000003', 1500000, 'Mukafaah Kajian Bulanan Ustadz Tamu', 'Ustadz Pemateri', 'TRX-OUT-005', 'approved', true),
    ('33333333-0000-0000-0000-000000000015', CURRENT_DATE - INTERVAL '5 days', 'expense', '22222222-0000-0000-0000-000000000005', 4750000, 'Servis 6 Unit AC dan Penggantian Kabel Sound System', 'CV Sejuk Bersama', 'TRX-OUT-006', 'approved', true),
    ('33333333-0000-0000-0000-000000000016', CURRENT_DATE - INTERVAL '2 days', 'expense', '22222222-0000-0000-0000-000000000006', 850000, 'Konsumsi dan Air Mineral Kajian Shubuh Ceria', 'Toko Berkah Snack', 'TRX-OUT-007', 'approved', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Activities
INSERT INTO public.activities (
    id, title, category, description, speaker, location, start_time, end_time, status, registration_required, max_participants
) VALUES
    (
        '44444444-0000-0000-0000-000000000001',
        'Kajian Riyadhus Shalihin: Membangun Akhlak Qurani',
        'Kajian Rutin',
        'Pembahasan rutin hadits-hadits pilihan dari kitab Riyadhus Shalihin karya Imam An-Nawawi untuk memperkokoh akhlak keluarga muslim.',
        'Ustadz Dr. H. Khalid Basalamah, MA',
        'Ruang Utama Masjid',
        (CURRENT_DATE + INTERVAL '2 days' + TIME '18:30:00'),
        (CURRENT_DATE + INTERVAL '2 days' + TIME '20:30:00'),
        'upcoming',
        false,
        null
    ),
    (
        '44444444-0000-0000-0000-000000000002',
        'Subuh Mengaji & Sarapan Bersama Jamaah',
        'Kajian Subuh',
        'Kajian tafsir tematik Juz Amma setelah salat Subuh berjamaah, dilanjutkan ramah tamah dan sarapan bubur ayam bersama jamaah.',
        'Ustadz Faisal Rahman, Lc',
        'Selasar Barat Masjid',
        (CURRENT_DATE + INTERVAL '4 days' + TIME '04:45:00'),
        (CURRENT_DATE + INTERVAL '4 days' + TIME '06:15:00'),
        'upcoming',
        false,
        null
    ),
    (
        '44444444-0000-0000-0000-000000000003',
        'Pelatihan Pengurusan Jenazah Sesuai Sunnah',
        'Workshop Keislaman',
        'Pelatihan praktis dan langsung tata cara memandikan, mengafani, dan menyalatkan jenazah lengkap dengan modul dan sertifikat.',
        'Tim Fardhu Kifayah DKM',
        'Aula Serbaguna Lt. 2',
        (CURRENT_DATE + INTERVAL '7 days' + TIME '08:30:00'),
        (CURRENT_DATE + INTERVAL '7 days' + TIME '12:00:00'),
        'upcoming',
        true,
        50
    ),
    (
        '44444444-0000-0000-0000-000000000004',
        'Bakti Sosial & Santunan 50 Yatim Piatu',
        'Sosial & Santunan',
        'Penyaluran paket perlengkapan sekolah dan santunan tunai kepada anak-anak yatim dhuafa di wilayah sekitar masjid.',
        'Ketua DKM & Pengurus Yatim',
        'Halaman Utama Masjid',
        (CURRENT_DATE + INTERVAL '12 days' + TIME '09:00:00'),
        (CURRENT_DATE + INTERVAL '12 days' + TIME '11:30:00'),
        'upcoming',
        false,
        null
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Announcements
INSERT INTO public.announcements (
    id, title, content, category, priority, published_at, status
) VALUES
    (
        '55555555-0000-0000-0000-000000000001',
        'Laporan Transparansi Infaq & Kas Masjid Periode Berjalan',
        'Alhamdulillah, seluruh rincian kas masuk dan keluar Masjid Raya Al-Muhajirin kini dapat dipantau langsung oleh jamaah melalui portal transparansi online dan papan digital masjid. Terima kasih atas amanah para muhsinin.',
        'Keuangan',
        'normal',
        CURRENT_DATE - INTERVAL '2 days',
        'published'
    ),
    (
        '55555555-0000-0000-0000-000000000002',
        'Penerimaan Pendaftaran Santri Baru TPQ Al-Muhajirin',
        'Dibuka pendaftaran calon santri baru Taman Pendidikan Al-Quran (TPQ) usia 5-12 tahun. Pembelajaran meliputi tahsin metode Ummi, hafalan juz 30, serta doa harian. Kuota terbatas 40 santri.',
        'Pendidikan',
        'normal',
        CURRENT_DATE - INTERVAL '5 days',
        'published'
    ),
    (
        '55555555-0000-0000-0000-000000000003',
        'Himbauan Kebersihan dan Menjaga Ketertiban Parkir Jamaah Jumat',
        'Demi kenyamanan bersama saat salat Jumat, dimohon jamaah untuk memarkir kendaraan roda dua dan empat di area yang telah disediakan oleh petugas security dan tidak meninggalkan barang berharga di kendaraan.',
        'Ketertiban',
        'urgent',
        CURRENT_DATE - INTERVAL '6 days',
        'published'
    )
ON CONFLICT (id) DO NOTHING;
