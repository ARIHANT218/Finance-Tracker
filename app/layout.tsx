// app/layout.tsx
import './globals.css';
import { Toaster } from 'sonner';
import NavBar from '@/components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-muted/40 text-foreground antialiased">
        <NavBar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
