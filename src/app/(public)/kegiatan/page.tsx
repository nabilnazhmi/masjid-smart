'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataStore } from '@/lib/data/store';
import { formatDateTimeIndo } from '@/lib/utils';
import { Activity } from '@/types/database';

export default function KegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Registration modal state
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    setActivities(DataStore.getActivities());
  }, []);

  const categories = ['all', 'Kajian Rutin', 'Kajian Subuh', 'Workshop Keislaman', 'Sosial & Santunan'];

  const filtered = activities.filter((act) => {
    const matchCategory = selectedCategory === 'all' || act.category === selectedCategory;
    const matchSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.speaker && act.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setRegModalOpen(false);
      setRegName('');
      setRegPhone('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="gold">Jadwal Dakwah & Pembinaan</Badge>
        <h1 className="text-3xl font-extrabold text-emerald-950 dark:text-white">
          Informasi Kegiatan & Kajian
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Ikuti majelis ilmu, kegiatan sosial kemasyarakatan, dan program dakwah bersama jamaah.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tema, ustadz, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Activity Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 space-y-3">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Tidak ada kegiatan yang sesuai filter pencarian.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-emerald-700 font-semibold underline"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((act) => {
            const isCompleted = act.status === 'completed';
            return (
              <Card
                key={act.id}
                className="hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="gold">{act.category}</Badge>
                      <Badge
                        variant={
                          act.status === 'upcoming'
                            ? 'info'
                            : act.status === 'ongoing'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {act.status === 'upcoming'
                          ? 'Mendatang'
                          : act.status === 'ongoing'
                          ? 'Sedang Berlangsung'
                          : 'Selesai'}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 mt-1 leading-snug">
                      {act.title}
                    </h3>
                  </div>

                  <div className="p-5 space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{formatDateTimeIndo(act.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{act.location}</span>
                    </div>
                    {act.speaker && (
                      <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-medium">
                        <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Narasumber: {act.speaker}</span>
                      </div>
                    )}
                    {act.description && (
                      <p className="text-[11px] text-gray-500 pt-1 line-clamp-3 leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {act.registration_required ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        setSelectedActivity(act);
                        setRegModalOpen(true);
                      }}
                      disabled={isCompleted}
                    >
                      Daftar Peserta (Wajib)
                    </Button>
                  ) : (
                    <div className="text-center py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold rounded-lg border border-emerald-200 dark:border-emerald-900">
                      Terbuka untuk Umum (Tanpa Pendaftaran)
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        title="Form Pendaftaran Kegiatan"
        description={selectedActivity ? selectedActivity.title : ''}
      >
        {regSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-gray-900">Pendaftaran Berhasil!</h4>
            <p className="text-xs text-gray-500">
              Konfirmasi kehadiran telah dikirimkan ke panitia kegiatan DKM.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nama Lengkap Jamaah
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Contoh: Muhammad Ilham"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nomor WhatsApp Aktif
              </label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRegModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Kirim Pendaftaran
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
