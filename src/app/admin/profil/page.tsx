'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataStore } from '@/lib/data/store';
import { MosqueSettings, MosqueStructureMember } from '@/types/database';

export default function AdminProfilPage() {
  const [settings, setSettings] = useState<MosqueSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [mosqueName, setMosqueName] = useState('');
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState('');
  const [vision, setVision] = useState('');
  const [missionText, setMissionText] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountHolder, setBankAccountHolder] = useState('');
  const [structure, setStructure] = useState<MosqueStructureMember[]>([]);

  useEffect(() => {
    const s = DataStore.getSettings();
    setSettings(s);
    setMosqueName(s.mosque_name);
    setTagline(s.tagline || '');
    setAddress(s.address);
    setContactPhone(s.contact_phone || '');
    setContactEmail(s.contact_email || '');
    setDescription(s.description || '');
    setHistory(s.history || '');
    setVision(s.vision || '');
    setMissionText(s.mission?.join('\n') || '');
    setBankName(s.bank_name || '');
    setBankAccountNumber(s.bank_account_number || '');
    setBankAccountHolder(s.bank_account_holder || '');
    setStructure(s.structure_json || []);
  }, []);

  const handleAddStructureMember = () => {
    setStructure([...structure, { role: 'Pengurus', name: '', phone: '' }]);
  };

  const handleRemoveMember = (idx: number) => {
    setStructure(structure.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: keyof MosqueStructureMember, val: string) => {
    const updated = [...structure];
    updated[idx] = { ...updated[idx], [field]: val };
    setStructure(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    const missions = missionText
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);

    const updated: MosqueSettings = {
      ...settings,
      mosque_name: mosqueName,
      tagline,
      address,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      description,
      history,
      vision,
      mission: missions,
      bank_name: bankName,
      bank_account_number: bankAccountNumber,
      bank_account_holder: bankAccountHolder,
      structure_json: structure,
    };

    DataStore.saveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Identitas Masjid</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Pengaturan Profil & Struktur DKM
          </h1>
          <p className="text-xs text-slate-500">
            Perbarui data resmi masjid, visi misi, rekening donasi, dan susunan kepengurusan
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Profil berhasil disimpan!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Dasar */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Identitas & Kontak Resmi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Resmi Masjid *
              </label>
              <input
                type="text"
                required
                value={mosqueName}
                onChange={(e) => setMosqueName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alamat Lengkap Masjid *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telepon / WhatsApp Pengurus
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Sekretariat
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </Card>

        {/* Deskripsi & Visi Misi */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Gambaran Umum, Visi & Misi
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Singkat Masjid
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sejarah Singkat Pendirian
            </label>
            <textarea
              rows={3}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Visi Masjid
            </label>
            <textarea
              rows={2}
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Misi Masjid (Tulis satu poin per baris)
            </label>
            <textarea
              rows={4}
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </Card>

        {/* Rekening Bank Donasi */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            3. Rekening Kas Donasi & QRIS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Bank
              </label>
              <input
                type="text"
                placeholder="Bank Syariah Indonesia (BSI)"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Rekening
              </label>
              <input
                type="text"
                placeholder="7123-4567-89"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Atas Nama Rekening
              </label>
              <input
                type="text"
                placeholder="DKM Masjid Nurul Huda"
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </Card>

        {/* Susunan Pengurus DKM */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              4. Susunan Pengurus Dewan Kemakmuran Masjid (DKM)
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStructureMember}
              className="text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Posisi
            </Button>
          </div>

          <div className="space-y-3">
            {structure.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl items-center"
              >
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Jabatan (e.g. Ketua DKM)"
                    value={item.role}
                    onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Nama Lengkap & Gelar"
                    value={item.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Nomor Kontak (Opsional)"
                    value={item.phone || ''}
                    onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div className="sm:col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan Profil Masjid
          </Button>
        </div>
      </form>
    </div>
  );
}
