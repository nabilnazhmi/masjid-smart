'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, ShieldCheck, Key, History, UserPlus, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataStore } from '@/lib/data/store';
import { DEMO_PROFILES } from '@/lib/data/demo-data';
import { formatDateTimeIndo } from '@/lib/utils';
import { UserProfile, AuditLog, UserRole } from '@/types/database';

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<UserProfile[]>(DEMO_PROFILES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setAuditLogs(DataStore.getAuditLogs());
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsers(updated);
    DataStore.addAuditLog('CHANGE_USER_ROLE', 'user_profile', userId, { newRole });
    setAuditLogs(DataStore.getAuditLogs());
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold">Akses & Keamanan</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Pengguna, Hak Akses (RBAC) & Audit Log
          </h1>
          <p className="text-xs text-slate-500">
            Kelola otoritas staf pengurus DKM, bendahara kas, serta pemantauan log jejak audit sistem
          </p>
        </div>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4" /> Admin DKM
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Akses menyeluruh: mengubah profil masjid, mengatur hak akses, verifikasi pembukuan, kelola kegiatan, dan konfigurasi sistem.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-700 dark:text-amber-400">
            <Key className="w-4 h-4" /> Bendahara Kas
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Akses keuangan: pencatatan pemasukan, pengeluaran kas, ekspor CSV, laporan pembukuan, pembatalan mutasi, dan telaah anomali AI.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-blue-700 dark:text-blue-400">
            <Users className="w-4 h-4" /> Jamaah & Publik
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Akses publik: melihat jadwal kajian, membaca pengumuman, mengakses laporan transparansi terbuka, dan bertanya ke chatbot AI.
          </p>
        </div>
      </div>

      {/* User Accounts Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Daftar Pengguna & Otoritas DKM
          </h3>
          <p className="text-xs text-slate-500">
            Role-Based Access Control (RBAC) terproteksi dengan Row Level Security
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Peran Akses Saat Ini</th>
                <th className="py-3 px-4 text-center">Ubah Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {u.full_name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{u.email}</td>
                  <td className="py-3 px-4 text-slate-500">{u.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        u.role === 'admin'
                          ? 'success'
                          : u.role === 'bendahara'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs"
                    >
                      <option value="admin">Admin DKM</option>
                      <option value="bendahara">Bendahara</option>
                      <option value="jamaah">Jamaah</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Logs Stream */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-800" />
              Jejak Audit Aktivitas Sistem (Audit Trail)
            </h3>
            <p className="text-xs text-slate-500">
              Rekaman perubahan data kas, pembatalan mutasi, dan interaksi penting pengguna
            </p>
          </div>
          <Badge variant="neutral">{auditLogs.length} Aktivitas</Badge>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 flex items-start justify-between gap-4 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {log.actor_name || 'System / Staf DKM'}
                  </span>
                  <Badge variant="neutral" className="text-[10px]">
                    {log.action}
                  </Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Objek: <span className="font-mono">{log.entity_type}</span>{' '}
                  {log.entity_id && `(ID: ${log.entity_id})`}
                </p>
                {log.details && (
                  <p className="text-[10px] text-slate-400 font-mono">
                    {JSON.stringify(log.details)}
                  </p>
                )}
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {formatDateTimeIndo(log.created_at)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
