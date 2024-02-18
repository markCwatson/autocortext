import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('h-full bg-gray-50', inter.className)}>
      <body className="min-h-screen h-full bg-my-color8 antialiased">
        <Providers>
          <Toaster position="bottom-right" />
          <main>
            <section className="pt-0">{children}</section>
          </main>
        </Providers>
      </body>
    </html>
  );
}
