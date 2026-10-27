'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, PlusCircle, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataStore } from '@/lib/data/store';
import { formatDateIndo } from '@/lib/utils';
import { Announcement, AnnouncementPriority, AnnouncementStatus } from '@/types/database';

export default function AdminPengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Umum');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [status, setStatus] = useState<AnnouncementStatus>('published');

  const refresh = () => {
    setAnnouncements(DataStore.getAnnouncements());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleOpenAdd = () => {
    setEditingAnn(null);
    setTitle('');
    setContent('');
    setCategory('Umum');
    setPriority('normal');
    setStatus('published');
    setModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnn(ann);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category || 'Umum');
    setPriority(ann.priority);
    setStatus(ann.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingAnn) {
      DataStore.updateAnnouncement(editingAnn.id, {
        title,
        content,
        category,
        priority,
        status,
      });
    } else {
      DataStore.addAnnouncement({
        title,
        content,
        category,
        priority,
        status,
        published_at: new Date().toISOString(),
      });
    }

    setModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Informasi Resmi</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Pengumuman & Warta Masjid
          </h1>
          <p className="text-xs text-slate-500">
            Publikasikan pengumuman penting, himbauan jamaah, dan laporan berkala DKM
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="gap-1.5">
          <PlusCircle className="w-4 h-4 text-amber-300" />
          + Buat Pengumuman Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {announcements.map((ann) => (
          <Card key={ann.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge
                  variant={
                    ann.priority === 'urgent'
                      ? 'danger'
                      : ann.priority === 'normal'
                      ? 'info'
                      : 'neutral'
                  }
                >
                  {ann.priority === 'urgent' ? 'Penting & Mendesak' : ann.category || 'Umum'}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDateIndo(ann.published_at)}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mt-1">
                {ann.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-4 leading-relaxed">
                {ann.content}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Badge variant={ann.status === 'published' ? 'success' : 'neutral'}>
                {ann.status === 'published' ? 'Terbit (Publik)' : 'Draft'}
              </Badge>
              <button
                onClick={() => handleOpenEdit(ann)}
                className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Ubah
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAnn ? 'Ubah Pengumuman' : 'Buat Pengumuman Baru'}
        description="Pengumuman berstatus Terbit akan langsung muncul di halaman beranda jamaah."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Pengumuman *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Himbauan Pelaksanaan Shalat Gerhana Bulan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori
              </label>
              <input
                type="text"
                placeholder="Umum / Pendidikan / Keuangan"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Mendesak / Penting</option>
                <option value="low">Rendah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Isi Konten Pengumuman *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan isi pengumuman lengkap secara jelas..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status Publikasi
            </label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            >
              <option value="published">Terbit (Ditampilkan ke Jamaah)</option>
              <option value="draft">Draft (Disimpan Internal)</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Pengumuman
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
