import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });

export const metadata: Metadata = {
  title: 'مقرأة الإمام الجزري للإقراء والإجازة بالسند',
  description: 'إقراء متقن وإجازة بالسند برواية حفص عن عاصم والقراءات السبع.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}