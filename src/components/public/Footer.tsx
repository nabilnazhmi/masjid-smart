import React from 'react';
import Link from 'next/link';
import { Landmark, MapPin, Phone, Mail, Heart, Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 border border-amber-400/30">
                <Landmark className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                MasjidSmart <span className="text-amber-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Platform modern pengelolaan administrasi, transparansi keuangan donasi umat, jadwal kegiatan, dan asisten kecerdasan buatan terpadu untuk kemakmuran masjid.
            </p>
            <div className="pt-2 text-xs text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Didukung Integrasi AI & Audit Kas Syariah</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-800/80 pb-2">
              Navigasi Jamaah
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  Beranda & Jadwal Salat
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-amber-300 transition-colors">
                  Profil & Struktur DKM
                </Link>
              </li>
              <li>
                <Link href="/kegiatan" className="hover:text-amber-300 transition-colors">
                  Jadwal Kajian & Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/keuangan" className="hover:text-amber-300 transition-colors">
                  Transparansi & Pembukuan Kas
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors text-amber-300/90 font-medium flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Portal Khusus Pengurus DKM
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bank & Donasi */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-800/80 pb-2">
              Rekening Kas Donasi
            </h4>
            <div className="bg-emerald-900/60 rounded-xl p-3.5 border border-emerald-800 text-xs space-y-1.5">
              <p className="text-emerald-300 font-semibold">Bank Syariah Indonesia (BSI)</p>
              <p className="font-mono text-base font-bold text-amber-300 tracking-wider">
                7123-4567-89
              </p>
              <p className="text-emerald-200 text-[11px]">a.n. DKM Masjid Nurul Huda</p>
              <div className="pt-2 text-[10px] text-emerald-300/80 border-t border-emerald-800/80 mt-2">
                *Seluruh pemasukan dicatat transparan dan diaudit realtime oleh sistem.
              </div>
            </div>
          </div>

          {/* Col 4: Kontak Sekretariat */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-800/80 pb-2">
              Sekretariat DKM
            </h4>
            <ul className="space-y-3 text-xs text-emerald-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Jl. Kemang Raya No. 45, Mampang Prapatan, Jakarta Selatan 12730</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>sekretariat@nurulhuda.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>© {new Date().getFullYear()} MasjidSmart AI. Proyek Pengabdian & Digitalisasi Masjid Mahasiswa.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> untuk Kemakmuran Masjid & Ummat.
          </p>
        </div>
      </div>
    </footer>
  );
}
