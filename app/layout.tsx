// app/layout.tsx
import './globals.css'; // Your global CSS file (e.g., Tailwind CSS)
import { Toaster } from 'sonner'; // Import the Toaster component

export const metadata = {
  title: 'Finance Tracker',
  description: 'Track your income and expenses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" richColors /> {/* Sonner Toaster */}
      </body>
    </html>
  );
}
