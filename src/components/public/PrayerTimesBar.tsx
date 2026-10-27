'use client';

import React, { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { PrayerTimes } from '@/types/database';

export function PrayerTimesBar() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);

  useEffect(() => {
    // Fetch prayer times for Bogor / Jonggol
    fetch('/api/prayer-times?city=Bogor')
      .then((res) => res.json())
      .then((data: PrayerTimes) => {
        setPrayerTimes(data);
      })
      .catch((err) => console.error('Failed to load prayer times:', err));

    // Update digital clock every second
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Determine next upcoming prayer
  useEffect(() => {
    if (!prayerTimes) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Subuh', time: prayerTimes.fajr },
      { name: 'Terbit', time: prayerTimes.sunrise },
      { name: 'Dzuhur', time: prayerTimes.dhuhr },
      { name: 'Ashar', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isya', time: prayerTimes.isha },
    ];

    for (const p of prayers) {
      const [h, m] = p.time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > currentMinutes) {
        setNextPrayer(p);
        return;
      }
    }
    // If all prayers passed today, next is tomorrow's Subuh
    setNextPrayer({ name: 'Subuh Esok', time: prayerTimes.fajr });
  }, [prayerTimes]);

  if (!prayerTimes) {
    return (
      <div className="w-full bg-emerald-950 text-white/80 py-2.5 px-4 text-xs flex justify-center items-center">
        <span>Memuat jadwal salat hari ini...</span>
      </div>
    );
  }

  const items = [
    { label: 'Imsak', time: prayerTimes.imsak },
    { label: 'Subuh', time: prayerTimes.fajr },
    { label: 'Terbit', time: prayerTimes.sunrise },
    { label: 'Dzuhur', time: prayerTimes.dhuhr },
    { label: 'Ashar', time: prayerTimes.asr },
    { label: 'Maghrib', time: prayerTimes.maghrib },
    { label: 'Isya', time: prayerTimes.isha },
  ];

  return (
    <div className="w-full bg-emerald-950 text-emerald-100 border-b border-emerald-900/60 py-2 px-4 shadow-inner text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{currentTime || 'WIB'}</span>
          </span>
          <span className="hidden sm:inline-block text-emerald-600">•</span>
          <span className="flex items-center gap-1 text-emerald-300/90 text-[11px]">
            <MapPin className="w-3 h-3 text-amber-400" />
            {prayerTimes.locationName}
          </span>
          {nextPrayer && (
            <span className="hidden lg:inline-flex items-center gap-1 text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-medium border border-amber-400/30">
              Menuju {nextPrayer.name}: {nextPrayer.time}
            </span>
          )}
        </div>

        {/* Prayer Time Pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {items.map((item) => {
            const isNext = nextPrayer?.name === item.label;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  isNext
                    ? 'bg-amber-500 text-gray-950 font-bold shadow-xs scale-105'
                    : 'bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-200'
                }`}
              >
                <span className="text-[11px] opacity-90">{item.label}</span>
                <span className="font-mono text-xs font-semibold">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
