import { NextResponse } from 'next/server';
import { PrayerTimes } from '@/types/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Jakarta';
  const country = 'Indonesia';

  // Offline default fallback prayer schedule for Jakarta/WIB
  const today = new Date();
  const dateFormatted = today.toISOString().split('T')[0];

  const defaultSchedule: PrayerTimes = {
    date: dateFormatted,
    imsak: '04:09',
    fajr: '04:19',
    sunrise: '05:35',
    dhuhr: '11:46',
    asr: '14:58',
    maghrib: '17:53',
    isha: '19:04',
    locationName: `${city}, Indonesia`,
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
          locationName: `${city}, Indonesia`,
        });
      }
    }
  } catch (error) {
    console.warn('External prayer times API unavailable, using calibrated Indonesian schedule:', error);
  }

  return NextResponse.json(defaultSchedule);
}
