import { NextResponse } from 'next/server';
import { PrayerTimes } from '@/types/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || process.env.NEXT_PUBLIC_PRAYER_CITY || 'Bogor';
  const country = 'Indonesia';

  // Offline default calibrated schedule for Bogor / Jonggol WIB
  const today = new Date();
  const dateFormatted = today.toISOString().split('T')[0];

  const defaultSchedule: PrayerTimes = {
    date: dateFormatted,
    imsak: '04:10',
    fajr: '04:20',
    sunrise: '05:36',
    dhuhr: '11:47',
    asr: '14:59',
    maghrib: '17:54',
    isha: '19:05',
    locationName: `${city === 'Bogor' ? 'Jonggol, Kab. Bogor' : city}, Indonesia`,
  };

  try {
    // Attempt fetching from reliable Aladhan Prayer Times API (Method 20: Kemenag Indonesia)
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=20`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (response.ok) {
      const data = await response.json();
      const timings = data?.data?.timings;

      if (timings) {
        return NextResponse.json({
          date: dateFormatted,
          imsak: timings.Imsak?.slice(0, 5) || defaultSchedule.imsak,
          fajr: timings.Fajr?.slice(0, 5) || defaultSchedule.fajr,
          sunrise: timings.Sunrise?.slice(0, 5) || defaultSchedule.sunrise,
          dhuhr: timings.Dhuhr?.slice(0, 5) || defaultSchedule.dhuhr,
          asr: timings.Asr?.slice(0, 5) || defaultSchedule.asr,
          maghrib: timings.Maghrib?.slice(0, 5) || defaultSchedule.maghrib,
          isha: timings.Isha?.slice(0, 5) || defaultSchedule.isha,
          locationName: `${city === 'Bogor' ? 'Jonggol, Kab. Bogor' : city}, Indonesia`,
        });
      }
    }
  } catch (error) {
    console.warn('External prayer times API unavailable, using calibrated schedule:', error);
  }

  return NextResponse.json(defaultSchedule);
}
