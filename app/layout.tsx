import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const sans=localFont({src:[{path:'../public/fonts/dm-sans-latin-400-normal.woff2',weight:'400',style:'normal'},{path:'../public/fonts/dm-sans-latin-500-normal.woff2',weight:'500',style:'normal'}],variable:'--font-sans',display:'swap'});
const serif=localFont({src:'../public/fonts/italiana-latin-400-normal.woff2',weight:'400',variable:'--font-serif',display:'swap'});
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL || 'https://stillskincare.vercel.app';
export const metadata: Metadata = {
 metadataBase:new URL(siteUrl),
 title:'STILL — Thoughtful hydration. Stay you.',
 description:'Explore a considered hydration routine, two skincare concept products and a one-minute skin quiz. An independent brand concept by Copywrk.',
 robots:{index:process.env.NEXT_PUBLIC_ALLOW_INDEXING==='true',follow:true},
 openGraph:{type:'website',locale:'en_US',siteName:'STILL',title:'STILL — Thoughtful hydration. Stay you.',description:'A simpler routine for dry, tight skin. Explore the skincare concept by Copywrk.',images:[{url:'/images/social-preview.jpg',width:1200,height:630,alt:'STILL — Thoughtful hydration. An independent skincare concept by Copywrk.'}]},
 twitter:{card:'summary_large_image',title:'STILL — Stay you.',description:'Thoughtful hydration. An independent skincare concept by Copywrk.',images:['/images/social-preview.jpg']}
};
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body><noscript><style>{'.loader{display:none!important}.reveal{opacity:1!important;transform:none!important}'}</style></noscript>{children}</body></html>}
