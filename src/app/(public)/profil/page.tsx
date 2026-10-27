'use client';

import React, { useEffect, useState } from 'react';
import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Users,
  Compass,
  History,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataStore } from '@/lib/data/store';
import { MosqueSettings } from '@/types/database';

export default function ProfilPage() {
  const [settings, setSettings] = useState<MosqueSettings | null>(null);

  useEffect(() => {
    setSettings(DataStore.getSettings());
  }, []);

  if (!settings) {
    return (
      <div className="py-20 text-center text-gray-500">
        Memuat profil masjid...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="gold">Profil Lengkap</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 dark:text-white">
          {settings.mosque_name}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {settings.tagline}
        </p>
      </div>

      {/* Overview & History Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Tentang Masjid
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {settings.description}
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-xl">
                <History className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Sejarah Singkat Pendirian
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {settings.history ||
                'Masjid didirikan atas inisiatif dan kebersamaan warga serta para tokoh muslim dalam mewujudkan pusat ibadah dan pembinaan generasi Qurani di lingkungan masyarakat.'}
            </p>
          </Card>
        </div>

        {/* Sidebar Info & Kontak */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-emerald-900 text-white rounded-2xl">
            <h3 className="font-bold text-base text-amber-300 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" /> Kontak & Lokasi Resmi
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-emerald-300 text-[11px] font-semibold">Alamat Lengkap:</span>
                <p className="text-white mt-1 leading-relaxed">{settings.address}</p>
              </div>
              <div>
                <span className="text-emerald-300 text-[11px] font-semibold">Telepon / WhatsApp:</span>
                <p className="text-white mt-1 font-mono font-medium">{settings.contact_phone}</p>
              </div>
              <div>
                <span className="text-emerald-300 text-[11px] font-semibold">Email Sekretariat:</span>
                <p className="text-white mt-1">{settings.contact_email}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-dashed border-2 border-emerald-300 dark:border-gray-700">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Kelola Data Profil
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Seluruh informasi profil, visi misi, dan struktur pengurus masjid ini dapat diperbarui oleh pengurus DKM melalui Dashboard Admin.
            </p>
          </Card>
        </div>
      </div>

      {/* Visi & Misi Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 sm:p-8 bg-emerald-50/60 dark:bg-gray-800/40 border-emerald-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-800 text-white rounded-xl">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
              Visi Masjid
            </h2>
          </div>
          <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base leading-relaxed italic font-serif">
            "{settings.vision}"
          </p>
        </Card>

        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-gray-900" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Misi Utama
            </h2>
          </div>
          <ul className="space-y-3">
            {settings.mission?.map((m, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Struktur Pengurus DKM */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="neutral">Organisasi DKM</Badge>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Susunan Pengurus Dewan Kemakmuran Masjid (DKM)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Pengurus yang diamanahkan untuk mengelola ibadah, dakwah, keuangan, dan pelayanan jamaah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {settings.structure_json?.map((member, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow text-center p-5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 font-bold text-lg border-2 border-emerald-300">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
              <Badge variant="gold" className="mb-2">
                {member.role}
              </Badge>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                {member.name}
              </h3>
              {member.phone && (
                <p className="text-[11px] text-gray-500 mt-1 font-mono">{member.phone}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
