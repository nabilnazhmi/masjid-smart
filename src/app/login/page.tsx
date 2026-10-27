'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Landmark, ShieldCheck, Key, ArrowRight, UserCheck, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataStore } from '@/lib/data/store';
import { DEMO_PROFILES } from '@/lib/data/demo-data';
import { UserProfile } from '@/types/database';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check against demo accounts or email match
    const matched = DEMO_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      DataStore.setCurrentUser(matched);
      DataStore.addAuditLog('USER_LOGIN', 'auth', matched.id, { email: matched.email });
      router.push('/admin');
    } else {
      // Simulate successful admin login for any valid email during demo
      const customUser: UserProfile = {
        id: `user-${Date.now()}`,
        full_name: email.split('@')[0],
        email: email,
        role: 'admin',
      };
      DataStore.setCurrentUser(customUser);
      DataStore.addAuditLog('USER_LOGIN', 'auth', customUser.id, { email });
      router.push('/admin');
    }
  };

  const handleQuickDemoLogin = (profile: UserProfile) => {
    DataStore.setCurrentUser(profile);
    DataStore.addAuditLog('QUICK_DEMO_LOGIN', 'auth', profile.id, { role: profile.role });
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-lg border border-amber-400/30">
            <Landmark className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-2xl text-emerald-950 dark:text-white tracking-tight">
            MasjidSmart <span className="text-amber-500">AI</span>
          </span>
        </Link>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Portal Masuk Pengurus DKM
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Silakan masuk untuk mengelola administrasi, keuangan, dan dakwah masjid
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-6 sm:p-8 shadow-xl border-slate-200 dark:border-slate-800">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email Pengurus
              </label>
              <input
                type="email"
                required
                placeholder="admin@masjidsmart.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={loading}>
              Masuk ke Dashboard DKM
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Akses Cepat Pengujian Demo:
            </p>
            <div className="space-y-2">
              {DEMO_PROFILES.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => handleQuickDemoLogin(prof)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between text-left transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{prof.full_name}</p>
                    <p className="text-[10px] text-slate-400">{prof.email}</p>
                  </div>
                  <Badge
                    variant={
                      prof.role === 'admin'
                        ? 'success'
                        : prof.role === 'bendahara'
                        ? 'warning'
                        : 'info'
                    }
                  >
                    Masuk sbg {prof.role}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-emerald-800 dark:text-emerald-400 hover:underline">
            ← Kembali ke Halaman Publik Masjid
          </Link>
        </div>
      </div>
    </div>
  );
}
