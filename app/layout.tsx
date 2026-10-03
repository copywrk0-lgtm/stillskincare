import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const sans=localFont({src:[{path:'../public/fonts/dm-sans-latin-400-normal.woff2',weight:'400',style:'normal'},{path:'../public/fonts/dm-sans-latin-500-normal.woff2',weight:'500',style:'normal'}],variable:'--font-sans',display:'swap'});
const serif=localFont({src:'../public/fonts/italiana-latin-400-normal.woff2',weight:'400',variable:'--font-serif',display:'swap'});
export const metadata: Metadata = { title: 'STILL — Stay you.', description: 'A different point of view on skincare. Discover the STILL ritual, understand your skin, and begin a conversation with a professional.', robots:{index:false,follow:false} };
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body><noscript><style>{'.loader{display:none!important}.reveal{opacity:1!important;transform:none!important}'}</style></noscript>{children}</body></html>}
