import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EnquiryProvider } from '@/context/EnquiriesContext';

export const metadata: Metadata = {
  title: 'NEXORA | Intelligent B2B Digital Technology & Automated AI Systems',
  description: 'Next-generation enterprise digital solutions powered by AI enquiry triage, cloud engineering, and data analytics.',
  keywords: ['Enterprise AI', 'Automated Enquiry Management', 'Cloud Engineering', 'Data Analytics', 'Next.js SaaS'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased">
        <EnquiryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </EnquiryProvider>
      </body>
    </html>
  );
}
