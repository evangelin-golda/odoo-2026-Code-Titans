import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dayflow — Human Resource Management System',
  description: 'Every workday, perfectly aligned. Comprehensive HRMS employee experience portal.',
  openGraph: {
    title: 'Dayflow — Human Resource Management System',
    description: 'Every workday, perfectly aligned. Comprehensive HRMS employee experience portal.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dayflow — Human Resource Management System',
    description: 'Every workday, perfectly aligned. Comprehensive HRMS employee experience portal.',
  },
};

import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
