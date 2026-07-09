import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Monthsary ❤️',
  description: 'A celebration of our love, memories, and time together.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-space: 'Space Grotesk', sans-serif;
            --font-playfair: 'Playfair Display', serif;
            --font-inter: 'Inter', sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased font-inter min-h-screen aurora-bg" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
