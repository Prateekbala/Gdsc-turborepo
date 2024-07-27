"use client";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '../@/components/ui/toaster';
import { EdgeStoreProvider } from '../@/lib/edgestore';
const inter = Inter({ subsets: ['latin'] });



interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body >
        <EdgeStoreProvider>
          {children}
          <Toaster />
          </EdgeStoreProvider>
        </body>
      </AuthProvider>
    </html>
  );
}