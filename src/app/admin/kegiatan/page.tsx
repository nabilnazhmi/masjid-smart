'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, PlusCircle, Clock, MapPin, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataStore } from '@/lib/data/store';
import { formatDateTimeIndo } from '@/lib/utils';
import { Activity, ActivityStatus } from '@/types/database';

export default function AdminKegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAct, setEditingAct] = useState<Activity | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kajian Rutin');
  const [speaker, setSpeaker] = useState('');
  const [location, setLocation] = useState('Ruang Utama Masjid');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ActivityStatus>('upcoming');
  const [regRequired, setRegRequired] = useState(false);

  const refresh = () => {
    setActivities(DataStore.getActivities());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleOpenAdd = () => {
    setEditingAct(null);
    setTitle('');
    setCategory('Kajian Rutin');
    setSpeaker('');
    setLocation('Ruang Utama Masjid');
    setStartTime(new Date().toISOString().slice(0, 16));
    setEndTime('');
    setDescription('');
    setStatus('upcoming');
    setRegRequired(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingAct(act);
    setTitle(act.title);
    setCategory(act.category);
    setSpeaker(act.speaker || '');
    setLocation(act.location);
    setStartTime(act.start_time ? new Date(act.start_time).toISOString().slice(0, 16) : '');
    setEndTime(act.end_time ? new Date(act.end_time).toISOString().slice(0, 16) : '');
    setDescription(act.description || '');
    setStatus(act.status);
    setRegRequired(act.registration_required);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      DataStore.deleteActivity(id);
      refresh();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime) return;

    if (editingAct) {
      DataStore.updateActivity(editingAct.id, {
        title,
        category,
        speaker,
        location,
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : undefined,
        description,
        status,
        registration_required: regRequired,
      });
    } else {
      DataStore.addActivity({
        title,
        category,
        speaker,
        location,
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : undefined,
        description,
        status,
        registration_required: regRequired,
      });
    }

    setModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Dakwah & Ibadah</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Kelola Jadwal Kegiatan & Kajian
          </h1>
          <p className="text-xs text-slate-500">
            Jadwalkan kajian rutin, majelis taklim, bakti sosial, dan pendaftaran peserta
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="gap-1.5">
          <PlusCircle className="w-4 h-4 text-amber-300" />
          + Tambah Jadwal Kegiatan
        </Button>
      </div>

      {/* Activities Table Card */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Kegiatan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Waktu Mulai</th>
                <th className="py-3 px-4">Narasumber</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4 text-center">Pendaftaran</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Belum ada kegiatan yang terdaftar.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-xs">
                      <div>{act.title}</div>
                      {act.description && (
                        <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                          {act.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="gold">{act.category}</Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {formatDateTimeIndo(act.start_time)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {act.speaker || '-'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{act.location}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {act.registration_required ? (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                          Wajib Daftar
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Umum</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
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
                          ? 'Berlangsung'
                          : 'Selesai'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(act)}
                          className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(act.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAct ? 'Ubah Informasi Kegiatan' : 'Tambah Kegiatan Baru'}
        description="Jadwal ini akan otomatis tampil di kalender beranda publik dan dapat dijawab oleh AI Assistant."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Kegiatan / Tema Kajian *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kajian Kitab Bulughul Maram Bab Shalat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Kegiatan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Kajian Rutin">Kajian Rutin</option>
                <option value="Kajian Subuh">Kajian Subuh</option>
                <option value="Workshop Keislaman">Workshop Keislaman</option>
                <option value="Sosial & Santunan">Sosial & Santunan</option>
                <option value="Peringatan Hari Besar Islam">Peringatan Hari Besar Islam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Narasumber / Ustadz
              </label>
              <input
                type="text"
                placeholder="Contoh: Ustadz Dr. H. Khalid Basalamah, MA"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Waktu Mulai *
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lokasi / Ruangan
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ruang Utama Masjid"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Singkat Acara
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan gambaran materi atau sasaran kegiatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="actReg"
                checked={regRequired}
                onChange={(e) => setRegRequired(e.target.checked)}
                className="rounded text-emerald-700 w-4 h-4"
              />
              <label htmlFor="actReg" className="text-xs text-slate-700 dark:text-slate-300">
                Wajibkan formulir pendaftaran peserta
              </label>
            </div>

            <div>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs"
              >
                <option value="upcoming">Status: Mendatang</option>
                <option value="ongoing">Status: Berlangsung</option>
                <option value="completed">Status: Selesai</option>
                <option value="cancelled">Status: Dibatalkan</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Jadwal Kegiatan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
