import type { Metadata } from 'next';
import './globals.css';
import { AiChatWidget } from '@/components/ai/AiChatWidget';

export const metadata: Metadata = {
  title: 'MasjidSmart AI - Sistem Informasi Masjid & Transparansi Keuangan',
  description:
    'Sistem informasi masjid berbasis AI terpadu untuk administrasi DKM, transparansi pembukuan kas, informasi jadwal kajian ibadah, dan pelayanan jamaah.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}
