import React from 'react';
import { PrayerTimesBar } from '@/components/public/PrayerTimesBar';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PrayerTimesBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
