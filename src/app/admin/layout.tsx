'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  Calendar,
  Megaphone,
  Landmark,
  Bot,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { DEMO_PROFILES } from '@/lib/data/demo-data';
import { UserProfile, MosqueSettings } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mosqueSettings, setMosqueSettings] = useState<MosqueSettings | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(DataStore.getCurrentUser());
    setMosqueSettings(DataStore.getSettings());
  }, []);

  const handleSwitchRole = (profile: UserProfile) => {
    DataStore.setCurrentUser(profile);
    setCurrentUser(profile);
    setRoleSwitcherOpen(false);
  };

  const handleLogout = () => {
    DataStore.setCurrentUser(null);
    router.push('/');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Keuangan', href: '/admin/keuangan', icon: Wallet },
    { label: 'Kategori Transaksi', href: '/admin/kategori', icon: Tags },
    { label: 'Kegiatan', href: '/admin/kegiatan', icon: Calendar },
    { label: 'Pengumuman', href: '/admin/pengumuman', icon: Megaphone },
    { label: 'Profil Masjid', href: '/admin/profil', icon: Landmark },
    { label: 'AI Assistant', href: '/admin/ai-assistant', icon: Bot },
    { label: 'Pengguna & Akses', href: '/admin/pengguna', icon: Users },
    { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-200">
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-900 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">MasjidSmart Admin</h2>
            <p className="text-[10px] text-emerald-300 truncate max-w-[180px]">
              {mosqueSettings?.mosque_name || 'Masjid'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-emerald-900 text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-emerald-950 text-emerald-100 flex flex-col justify-between border-r border-emerald-900 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900/80">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-inner border border-amber-400/30">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-white text-base leading-tight flex items-center gap-1">
                  MasjidSmart <span className="text-amber-400">AI</span>
                </h1>
                <span className="text-[10px] text-emerald-300 font-medium">
                  Portal Pengurus DKM
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : 'text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session & Logout Footer */}
        <div className="p-4 border-t border-emerald-900/80 bg-emerald-950/80 space-y-3">
          {/* Active user role preview */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 transition-colors text-left"
            >
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.full_name || 'Pengurus DKM'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-amber-300 font-semibold uppercase">
                    Peran: {currentUser?.role || 'admin'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0" />
            </button>

            {/* Role switcher dropdown for demo */}
            {roleSwitcherOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-emerald-900 rounded-xl shadow-xl border border-emerald-700 p-2 space-y-1 z-50 animate-in fade-in">
                <p className="text-[10px] text-emerald-300 font-semibold px-2 py-1 uppercase">
                  Simulasi Akun Demo:
                </p>
                {DEMO_PROFILES.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => handleSwitchRole(prof)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      currentUser?.id === prof.id
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'text-emerald-200 hover:bg-emerald-800/60'
                    }`}
                  >
                    <span className="truncate">{prof.full_name}</span>
                    <span className="text-[10px] uppercase font-mono text-amber-300">
                      {prof.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-emerald-200 bg-emerald-900/40 hover:bg-emerald-900 py-2 rounded-lg transition-colors border border-emerald-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Publik</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-red-300 hover:bg-red-950/60 rounded-lg transition-colors border border-red-900/40"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
