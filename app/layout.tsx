import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Worldwide AI Recipe Generator | Quick & Easy Food Recipes',
  description: 'Generate authentic food recipes and stunning photos from any country or dish name using AI.',
  keywords: ['AI Recipe Generator', 'Food Recipes', 'Global Cuisine', 'Cooking Assistant', 'Easy Recipes'],
  verification: {
    google: 'google8b20eb296239f801', // 👈 ඔයාගේ Google verification code එක
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
