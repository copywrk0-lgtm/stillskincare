import type { Metadata } from 'next';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stillskincare.vercel.app';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "STILL — Stay the age you're in.",
  description: 'A cinematic skincare exploration. Independent portfolio concept by Copywrk.',
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    title: "STILL — Stay the age you're in.",
    description: 'A sensorial journey through skin, formulation and ritual. Independent portfolio concept.',
    images: [{ url: '/images/social-preview.jpg', width: 1200, height: 630, alt: 'STILL skincare design concept by Copywrk' }]
  },
  twitter: {card:'summary_large_image', images:['/images/social-preview.jpg']}
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><head><meta name="theme-color" content="#13100f" /><link rel="stylesheet" href="/styles.css" /><link rel="icon" type="image/svg+xml" href="/assets/icon.svg" /></head><body>{children}</body></html>;
}
