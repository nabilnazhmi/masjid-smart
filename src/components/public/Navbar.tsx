'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Landmark, Menu, X, ShieldCheck, Sparkles, HeartHandshake, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Profil Masjid', href: '/profil' },
    { label: 'Informasi Kegiatan', href: '/kegiatan' },
    { label: 'Transparansi Keuangan', href: '/keuangan' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 shadow-md group-hover:bg-emerald-900 transition-colors border border-amber-400/30">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-emerald-900 dark:text-emerald-400 tracking-tight flex items-center gap-1.5">
                MasjidSmart <span className="text-amber-500 font-black">AI</span>
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Sistem Informasi & Transparansi Masjid
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/keuangan#donasi">
              <Button variant="secondary" size="sm" className="hidden lg:inline-flex">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                Salurkan Infaq
              </Button>
            </Link>

            <Link href="/admin">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                Portal DKM
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/admin">
              <Button variant="primary" size="sm" className="px-2.5 h-9 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                DKM
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                pathname === link.href
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            <Link href="/keuangan#donasi" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full justify-center">
                <HeartHandshake className="w-4 h-4" />
                Salurkan Infaq & Sedekah
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
